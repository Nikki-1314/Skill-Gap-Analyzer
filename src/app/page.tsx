import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[90vh] w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <section className="flex flex-col items-center gap-8 max-w-3xl">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-2 self-center">
            Career Growth Tools
          </div>
          <h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Master Your Career <br />
            <span className="text-primary bg-clip-text">Skill by Skill</span>
          </h1>
          <p className="max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Choose a target role, assess your current proficiency, and
            receive a personalized gap analysis to accelerate your professional growth.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto px-8 font-semibold shadow-lg shadow-primary/20">
            <Link href="/roles">Get Started Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 font-semibold">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      <section className="mt-24 grid gap-8 md:grid-cols-2 w-full text-left">
        <Card className="border-none shadow-xl shadow-black/5 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="font-bold">1</span>
            </div>
            <CardTitle className="text-xl">Pick Your Target Role</CardTitle>
            <CardDescription className="text-base">
              Select from curated full-stack role profiles to define your career objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-start px-0 text-primary hover:bg-transparent hover:underline">
              <Link href="/roles">Browse roles &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-black/5 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
          <CardHeader>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <span className="font-bold">2</span>
            </div>
            <CardTitle className="text-xl">Visualize Your Gaps</CardTitle>
            <CardDescription className="text-base">
              Get an instant visualization of the gap between your skills and industry standards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full justify-start px-0 text-primary hover:bg-transparent hover:underline">
              <Link href="/reports">View reports &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 w-full max-w-4xl">
        <div className="rounded-2xl bg-zinc-900 px-8 py-10 text-zinc-100 shadow-2xl dark:bg-primary dark:text-primary-foreground text-left sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold">Ready to advance?</h3>
            <p className="mt-2 text-zinc-400 dark:text-primary-foreground/80">
              Stop guessing your skills. Start measuring them against real-world expectations.
            </p>
          </div>
          <Button asChild size="lg" className="mt-6 sm:mt-0 bg-white text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
            <Link href="/roles">Start Free Assessment</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
