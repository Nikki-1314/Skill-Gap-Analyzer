import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Please sign in to view your saved reports.</CardDescription>
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

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: {
      id: true,
      assessments: {
        orderBy: { createdAt: "desc" },
        include: { role: true, ratings: true },
      },
    },
  });

  const reports = user?.assessments ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My reports</h1>
          <p className="text-muted-foreground">
            Reopen any past assessment and continue tracking your progress.
          </p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/roles">New assessment</Link>
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No reports yet</CardTitle>
            <CardDescription>
              You have not submitted an assessment yet. Start one to save your first report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/roles">Start assessment</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="text-base">{report.role.name}</CardTitle>
                <CardDescription>
                  {new Date(report.createdAt).toLocaleString()} • {report.ratings.length} skill ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/${report.id}`}>Open report</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

