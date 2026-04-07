import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-1 flex-col px-6 py-12">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-4xl font-semibold tracking-tight">
            Skill Gap Analyzer
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Choose a target full-stack role, rate your current proficiency, and
            get a clear gap report with charts and prioritized next steps.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/roles">Get started</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/reports">My reports</Link>
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1) Pick a role</CardTitle>
            <CardDescription>
              Use role profiles to define what “good” looks like.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/roles">Open roles</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">3) View gap report</CardTitle>
            <CardDescription>
              See target vs your level and focus on the biggest gaps first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/reports">Go to reports</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ready?</CardTitle>
            <CardDescription>
              Start from the roles page, choose a profile, and generate your first report.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Tip: if GitHub sign-in fails, update your `.env` OAuth values.
            </p>
            <Button asChild>
              <Link href="/roles">Start assessment</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
