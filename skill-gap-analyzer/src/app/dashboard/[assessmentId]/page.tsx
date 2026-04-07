import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProficiencyLevel } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GapChart } from "./GapChart";

function levelToNumber(level: ProficiencyLevel) {
  switch (level) {
    case ProficiencyLevel.NONE:
      return 0;
    case ProficiencyLevel.BEGINNER:
      return 1;
    case ProficiencyLevel.INTERMEDIATE:
      return 2;
    case ProficiencyLevel.ADVANCED:
      return 3;
    case ProficiencyLevel.EXPERT:
      return 4;
  }
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Please sign in to view your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/sign-in">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { assessmentId } = await params;

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      role: {
        include: {
          roleSkills: { include: { skill: true }, orderBy: { skill: { name: "asc" } } },
        },
      },
      ratings: { include: { skill: true } },
      user: true,
    },
  });

  if (!assessment) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Assessment not found</CardTitle>
            <CardDescription>Start a new assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/roles">Choose a role</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (assessment.user.email !== session.user.email) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not allowed</CardTitle>
            <CardDescription>This assessment belongs to another user.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/roles">Back</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const ratingBySkillId = new Map(assessment.ratings.map((r) => [r.skillId, r]));

  const chartData = assessment.role.roleSkills.map((rs) => {
    const r = ratingBySkillId.get(rs.skillId);
    return {
      skill: rs.skill.name,
      target: levelToNumber(rs.targetLevel),
      self: levelToNumber(r?.selfLevel ?? ProficiencyLevel.NONE),
      weight: rs.weight,
    };
  });

  const gaps = chartData
    .map((d) => ({
      ...d,
      gap: Math.max(0, d.target - d.self),
      impact: Math.max(0, d.target - d.self) * d.weight,
    }))
    .sort((a, b) => b.impact - a.impact);

  const totalImpact = gaps.reduce((acc, g) => acc + g.impact, 0);
  const top = gaps.slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gap report</h1>
          <p className="text-muted-foreground">
            {assessment.role.name} • {new Date(assessment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/reports">My reports</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/roles">New assessment</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Target vs current</CardTitle>
            <CardDescription>
              Numeric scale: 0=None, 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GapChart data={chartData.map(({ skill, target, self }) => ({ skill, target, self }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top gaps</CardTitle>
            <CardDescription>Highest impact = gap × weight</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {top.map((g) => (
              <div key={g.skill} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{g.skill}</div>
                  <div className="text-xs text-muted-foreground">
                    Target {g.target} • You {g.self}
                  </div>
                </div>
                <Badge variant={g.gap === 0 ? "secondary" : "default"}>Impact {g.impact}</Badge>
              </div>
            ))}
            <Separator />
            <div className="text-sm text-muted-foreground">
              Total impact score: <span className="font-medium text-foreground">{totalImpact}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

