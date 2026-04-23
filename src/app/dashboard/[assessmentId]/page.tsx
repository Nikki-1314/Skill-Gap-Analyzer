import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProficiencyLevel } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GapChart } from "./GapChart";
import { Roadmap } from "./Roadmap";

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
      skillId: rs.skillId,
      skill: rs.skill.name,
      target: levelToNumber(rs.targetLevel),
      self: levelToNumber(r?.selfLevel ?? ProficiencyLevel.NONE),
      weight: rs.weight,
      resource_url: rs.skill.resource_url,
    };
  });

  const gaps = chartData
    .map((d) => ({
      ...d,
      gap: Math.max(0, d.target - d.self),
      impact: Math.max(0, d.target - d.self) * d.weight,
    }))
    .sort((a, b) => b.impact - a.impact);

  const totalWeightedTarget = chartData.reduce((acc, d) => acc + d.target * d.weight, 0);
  const totalWeightedAchieved = chartData.reduce((acc, d) => acc + Math.min(d.self, d.target) * d.weight, 0);
  
  const matchPercentage = totalWeightedTarget > 0 
    ? Math.round((totalWeightedAchieved / totalWeightedTarget) * 100) 
    : 100;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">Skill Analysis</h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-[0.2em]">
            {assessment.role.name} • {new Date(assessment.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 text-right">Total Match</span>
            <span className="text-4xl font-black text-primary leading-none">{matchPercentage}%</span>
          </div>
          <div className="flex items-center gap-2 border-l pl-8">
            <Button asChild variant="outline" className="font-bold rounded-xl shadow-sm border-2">
              <Link href="/reports">Reports</Link>
            </Button>
            <Button asChild className="font-bold rounded-xl shadow-md">
              <Link href="/roles">New Scan</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          <Card className="border-none shadow-none bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <CardTitle className="text-xl font-black">Gap Analysis</CardTitle>
              </div>
              <CardDescription className="font-bold text-slate-400 text-xs uppercase tracking-wider">
                Comparative proficiency visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GapChart data={chartData.map(({ skill, target, self }) => ({ skill, target, self }))} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Roadmap gaps={gaps} />
        </div>
      </div>
    </main>
  );
}
