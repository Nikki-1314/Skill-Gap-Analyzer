import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProficiencyLevel } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GapChart } from "./GapChart";
import { ProgressChart } from "./ProgressChart";

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

  const totalImpact = gaps.reduce((acc, g) => acc + g.impact, 0);
  
  const totalWeightedTarget = chartData.reduce((acc, d) => acc + d.target * d.weight, 0);
  const totalWeightedAchieved = chartData.reduce((acc, d) => acc + Math.min(d.self, d.target) * d.weight, 0);
  
  const matchPercentage = totalWeightedTarget > 0 
    ? Math.round((totalWeightedAchieved / totalWeightedTarget) * 100) 
    : 100;

  const top = gaps.slice(0, 5);

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
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Match</span>
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

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-none bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Gap Analysis</CardTitle>
            <CardDescription className="font-medium text-slate-400">
              Interactive visualization of your current vs. target skill levels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GapChart data={chartData.map(({ skill, target, self }) => ({ skill, target, self }))} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Priority Roadmap</CardTitle>
            <CardDescription className="text-xs font-medium text-slate-400 uppercase tracking-wider">Strategic Next Steps</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {top.filter(g => g.gap > 0).length > 0 ? (
              top.filter(g => g.gap > 0).map((g, i) => (
                <div key={g.skill} className="group flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{g.skill}</div>
                    {g.resource_url && (
                      <a 
                        href={g.resource_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors font-black uppercase tracking-widest"
                      >
                        Learn &nearr;
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-700 ease-out" 
                        style={{ width: `${(g.self / g.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tabular-nums">
                      {g.self}/{g.target}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">🏆</div>
                <p className="text-sm font-black uppercase tracking-tight">Market Ready</p>
                <p className="text-xs text-slate-400 mt-2 font-medium italic">You have surpassed all target requirements.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

