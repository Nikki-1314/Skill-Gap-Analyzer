import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProficiencyLevel } from "@prisma/client";
import { createAssessment } from "@/app/assessment/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LEVELS: { value: ProficiencyLevel; label: string }[] = [
  { value: ProficiencyLevel.NONE, label: "None" },
  { value: ProficiencyLevel.BEGINNER, label: "Beginner" },
  { value: ProficiencyLevel.INTERMEDIATE, label: "Intermediate" },
  { value: ProficiencyLevel.ADVANCED, label: "Advanced" },
  { value: ProficiencyLevel.EXPERT, label: "Expert" },
];

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ roleId?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Please sign in to take an assessment.</CardDescription>
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

  const { roleId } = await searchParams;
  if (!roleId) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No role selected</CardTitle>
            <CardDescription>Choose a role before starting an assessment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/roles">Back to roles</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { roleSkills: { include: { skill: true }, orderBy: { skill: { name: "asc" } } } },
  });

  if (!role) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Role not found</CardTitle>
            <CardDescription>Pick a different role.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/roles">Back to roles</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Self assessment</h1>
        <p className="text-muted-foreground">
          Role template: {role.name} • Enter your current level for each skill to create your report.
        </p>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">How this is different from roles</CardTitle>
          <CardDescription>
            Roles are templates with target levels. This page captures your personal skill levels against that
            template.
          </CardDescription>
        </CardHeader>
      </Card>

      <form action={createAssessment} className="flex flex-col gap-4">
        <input type="hidden" name="roleId" value={role.id} />

        {role.roleSkills.map((rs) => (
          <Card key={rs.skillId}>
            <CardHeader>
              <CardTitle className="text-base">{rs.skill.name}</CardTitle>
              <CardDescription>
                Target: {String(rs.targetLevel).toLowerCase()} • Weight: {rs.weight}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`skill_${rs.skillId}`}>Your level</Label>
                <Select name={`skill_${rs.skillId}`} defaultValue={ProficiencyLevel.NONE}>
                  <SelectTrigger id={`skill_${rs.skillId}`}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`evidence_${rs.skillId}`}>Evidence (optional)</Label>
                <Textarea
                  id={`evidence_${rs.skillId}`}
                  name={`evidence_${rs.skillId}`}
                  placeholder="Links, projects, notes…"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" asChild>
            <Link href="/roles">Cancel</Link>
          </Button>
          <Button type="submit">Generate gap report</Button>
        </div>
      </form>
    </main>
  );
}

