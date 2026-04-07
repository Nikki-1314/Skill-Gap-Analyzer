import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: { roleSkills: { include: { skill: true } } },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Role templates</h1>
        <p className="text-muted-foreground">
          These are benchmark profiles (expected skill targets). Select one to start your personal assessment.
        </p>
      </div>

      {roles.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No roles found</CardTitle>
            <CardDescription>
              Your database is connected but has no role data yet. Run <code>npm run db:seed</code>{" "}
              from the project folder, then refresh this page.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((role) => (
            <Card key={role.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
                {role.description ? (
                  <CardDescription>
                    {role.description} • Template with {role.roleSkills.length} target skills.
                  </CardDescription>
                ) : (
                  <CardDescription>{role.roleSkills.length} target skills in this template.</CardDescription>
                )}
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/assessment/new?roleId=${role.id}`}>Assess myself for this role</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

