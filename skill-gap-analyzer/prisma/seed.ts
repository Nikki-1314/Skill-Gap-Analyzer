import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : undefined,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });
type Level = "NONE" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

async function main() {
  const skills = [
    { name: "TypeScript", category: "Frontend", description: "Types, generics, narrowing, TS config" },
    { name: "React", category: "Frontend", description: "Hooks, state, performance, patterns" },
    { name: "Next.js App Router", category: "Frontend", description: "RSC, routing, data fetching, caching" },
    { name: "Tailwind CSS", category: "Frontend", description: "Utility-first styling, responsive design" },
    { name: "React Native", category: "Mobile", description: "Native mobile app development with React Native" },
    { name: "State Management", category: "Frontend", description: "Context, Redux, Zustand, app state patterns" },
    { name: "HTML/CSS", category: "Frontend", description: "Semantic HTML, CSS fundamentals, accessibility basics" },
    { name: "JavaScript", category: "Frontend", description: "Core JavaScript language and browser APIs" },
    { name: "Node.js", category: "Backend", description: "Runtime, async patterns, tooling" },
    { name: "REST APIs", category: "Backend", description: "Design, validation, pagination, errors" },
    { name: "Express.js", category: "Backend", description: "Middleware, routing, controllers, API architecture" },
    { name: "Microservices", category: "Backend", description: "Service boundaries, communication, resiliency" },
    { name: "System Design", category: "Architecture", description: "Scalability, tradeoffs, architecture choices" },
    { name: "SQL", category: "Database", description: "Joins, indexes, transactions, query design" },
    { name: "MongoDB", category: "Database", description: "Document modeling, indexing, aggregation basics" },
    { name: "Prisma ORM", category: "Database", description: "Schema design, migrations, query patterns" },
    { name: "Docker", category: "DevOps", description: "Containerization, Dockerfile, local orchestration" },
    { name: "CI/CD", category: "DevOps", description: "Build pipelines, test automation, deployment workflows" },
    { name: "Kubernetes", category: "DevOps", description: "Workloads, services, deployments, scaling basics" },
    { name: "Cloud Platforms", category: "DevOps", description: "AWS/GCP/Azure fundamentals, managed services" },
    { name: "Monitoring", category: "DevOps", description: "Metrics, logs, alerting, uptime and reliability" },
    { name: "Figma", category: "Design", description: "UI mockups, design systems, prototyping" },
    { name: "Wireframing", category: "Design", description: "Low/high fidelity flows and interaction sketches" },
    { name: "UX Research", category: "Design", description: "User interviews, personas, problem framing" },
    { name: "Visual Design", category: "Design", description: "Typography, hierarchy, spacing, color systems" },
    { name: "Accessibility", category: "Design", description: "Inclusive design and WCAG principles" },
    { name: "Python", category: "AI/ML", description: "Python for data science and ML workflows" },
    { name: "Statistics", category: "AI/ML", description: "Probability, distributions, hypothesis testing" },
    { name: "Machine Learning", category: "AI/ML", description: "Supervised/unsupervised learning fundamentals" },
    { name: "Deep Learning", category: "AI/ML", description: "Neural nets, training loops, model tuning" },
    { name: "Data Preprocessing", category: "AI/ML", description: "Feature engineering, cleaning, transformations" },
    { name: "Model Deployment", category: "AI/ML", description: "Serving ML models, monitoring drift, MLOps basics" },
    { name: "Authentication", category: "Backend", description: "Sessions/JWT, OAuth, security basics" },
    { name: "Testing", category: "Quality", description: "Unit/integration tests, mocking, test pyramid" },
  ];

  const upsertedSkills = await Promise.all(
    skills.map((s) =>
      prisma.skill.upsert({
        where: { name: s.name },
        update: { category: s.category, description: s.description },
        create: s,
      }),
    ),
  );

  const skillByName = new Map(upsertedSkills.map((s) => [s.name, s]));

  const roles: Array<{
    name: string;
    description: string;
    targets: Record<string, { targetLevel: Level; weight?: number }>;
  }> = [
    {
      name: "Full-Stack Engineer (Next.js)",
      description: "Builds modern full-stack web apps with Next.js, TypeScript, Prisma, and MySQL.",
      targets: {
        TypeScript: { targetLevel: "ADVANCED", weight: 3 },
        React: { targetLevel: "ADVANCED", weight: 3 },
        "Next.js App Router": { targetLevel: "ADVANCED", weight: 3 },
        "Tailwind CSS": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Node.js": { targetLevel: "INTERMEDIATE", weight: 2 },
        "REST APIs": { targetLevel: "INTERMEDIATE", weight: 2 },
        SQL: { targetLevel: "INTERMEDIATE", weight: 2 },
        "Prisma ORM": { targetLevel: "INTERMEDIATE", weight: 2 },
        Authentication: { targetLevel: "INTERMEDIATE", weight: 2 },
        Testing: { targetLevel: "BEGINNER", weight: 1 },
      },
    },
    {
      name: "Frontend Engineer (React)",
      description: "Builds high-quality web UIs with React, TypeScript, and modern frontend practices.",
      targets: {
        JavaScript: { targetLevel: "ADVANCED", weight: 3 },
        TypeScript: { targetLevel: "ADVANCED", weight: 3 },
        React: { targetLevel: "ADVANCED", weight: 3 },
        "HTML/CSS": { targetLevel: "ADVANCED", weight: 2 },
        "Tailwind CSS": { targetLevel: "INTERMEDIATE", weight: 2 },
        "State Management": { targetLevel: "INTERMEDIATE", weight: 2 },
        Testing: { targetLevel: "INTERMEDIATE", weight: 2 },
        Accessibility: { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "Backend Engineer (Node.js)",
      description: "Designs robust backend systems, APIs, and data layers using Node.js.",
      targets: {
        "Node.js": { targetLevel: "ADVANCED", weight: 3 },
        "Express.js": { targetLevel: "ADVANCED", weight: 3 },
        "REST APIs": { targetLevel: "ADVANCED", weight: 3 },
        SQL: { targetLevel: "INTERMEDIATE", weight: 2 },
        MongoDB: { targetLevel: "INTERMEDIATE", weight: 2 },
        Authentication: { targetLevel: "INTERMEDIATE", weight: 2 },
        Microservices: { targetLevel: "INTERMEDIATE", weight: 2 },
        Testing: { targetLevel: "INTERMEDIATE", weight: 2 },
        "System Design": { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "Mobile App Developer (React Native)",
      description: "Builds performant cross-platform mobile applications using React Native.",
      targets: {
        JavaScript: { targetLevel: "ADVANCED", weight: 3 },
        TypeScript: { targetLevel: "INTERMEDIATE", weight: 2 },
        React: { targetLevel: "ADVANCED", weight: 3 },
        "React Native": { targetLevel: "ADVANCED", weight: 3 },
        "State Management": { targetLevel: "INTERMEDIATE", weight: 2 },
        "REST APIs": { targetLevel: "INTERMEDIATE", weight: 2 },
        Testing: { targetLevel: "INTERMEDIATE", weight: 2 },
        Accessibility: { targetLevel: "BEGINNER", weight: 1 },
      },
    },
    {
      name: "DevOps Engineer",
      description: "Builds and operates reliable deployment and infrastructure workflows.",
      targets: {
        Docker: { targetLevel: "ADVANCED", weight: 3 },
        "CI/CD": { targetLevel: "ADVANCED", weight: 3 },
        Kubernetes: { targetLevel: "INTERMEDIATE", weight: 2 },
        "Cloud Platforms": { targetLevel: "INTERMEDIATE", weight: 2 },
        Monitoring: { targetLevel: "INTERMEDIATE", weight: 2 },
        "System Design": { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "UI/UX Designer",
      description: "Designs intuitive and accessible user experiences and polished interfaces.",
      targets: {
        Figma: { targetLevel: "ADVANCED", weight: 3 },
        Wireframing: { targetLevel: "ADVANCED", weight: 3 },
        "UX Research": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Visual Design": { targetLevel: "ADVANCED", weight: 3 },
        Accessibility: { targetLevel: "INTERMEDIATE", weight: 2 },
        "HTML/CSS": { targetLevel: "BEGINNER", weight: 1 },
      },
    },
    {
      name: "Software Engineer",
      description: "Generalist engineer with strong coding, system, and quality fundamentals.",
      targets: {
        JavaScript: { targetLevel: "INTERMEDIATE", weight: 2 },
        TypeScript: { targetLevel: "INTERMEDIATE", weight: 2 },
        React: { targetLevel: "INTERMEDIATE", weight: 2 },
        "Node.js": { targetLevel: "INTERMEDIATE", weight: 2 },
        SQL: { targetLevel: "INTERMEDIATE", weight: 2 },
        Testing: { targetLevel: "INTERMEDIATE", weight: 2 },
        "System Design": { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "AI/ML Engineer",
      description: "Builds machine learning systems from data prep to model deployment.",
      targets: {
        Python: { targetLevel: "ADVANCED", weight: 3 },
        Statistics: { targetLevel: "ADVANCED", weight: 3 },
        "Machine Learning": { targetLevel: "ADVANCED", weight: 3 },
        "Deep Learning": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Data Preprocessing": { targetLevel: "ADVANCED", weight: 3 },
        "Model Deployment": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Cloud Platforms": { targetLevel: "BEGINNER", weight: 1 },
      },
    },
  ];

  for (const roleDef of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description },
      create: { name: roleDef.name, description: roleDef.description },
    });

    for (const [skillName, target] of Object.entries(roleDef.targets)) {
      const skill = skillByName.get(skillName);
      if (!skill) continue;
      await prisma.roleSkill.upsert({
        where: { roleId_skillId: { roleId: role.id, skillId: skill.id } },
        update: {
          targetLevel: target.targetLevel,
          weight: target.weight ?? 1,
        },
        create: {
          roleId: role.id,
          skillId: skill.id,
          targetLevel: target.targetLevel,
          weight: target.weight ?? 1,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

