import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : undefined,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
  ...(process.env.DATABASE_HOST !== 'localhost' && {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false,
    },
  }),
});

const prisma = new PrismaClient({ adapter });
type Level = "NONE" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

async function main() {
  const skills = [
    { name: "TypeScript", category: "Frontend", description: "Types, generics, narrowing, TS config", resource_url: "https://www.typescriptlang.org/docs/" },
    { name: "React", category: "Frontend", description: "Hooks, state, performance, patterns", resource_url: "https://react.dev" },
    { name: "Next.js App Router", category: "Frontend", description: "RSC, routing, data fetching, caching", resource_url: "https://nextjs.org/docs" },
    { name: "Tailwind CSS", category: "Frontend", description: "Utility-first styling, responsive design", resource_url: "https://tailwindcss.com/docs" },
    { name: "React Native", category: "Mobile", description: "Native mobile app development with React Native", resource_url: "https://reactnative.dev/docs/getting-started" },
    { name: "State Management", category: "Frontend", description: "Context, Redux, Zustand, app state patterns", resource_url: "https://zustand-demo.pmnd.rs/" },
    { name: "HTML/CSS", category: "Frontend", description: "Semantic HTML, CSS fundamentals, accessibility basics", resource_url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "JavaScript", category: "Frontend", description: "Core JavaScript language and browser APIs", resource_url: "https://javascript.info" },
    { name: "Node.js", category: "Backend", description: "Runtime, async patterns, tooling", resource_url: "https://nodejs.org/en/docs" },
    { name: "REST APIs", category: "Backend", description: "Design, validation, pagination, errors", resource_url: "https://restfulapi.net" },
    { name: "Express.js", category: "Backend", description: "Middleware, routing, controllers, API architecture", resource_url: "https://expressjs.com" },
    { name: "Microservices", category: "Backend", description: "Service boundaries, communication, resiliency", resource_url: "https://microservices.io" },
    { name: "System Design", category: "Architecture", description: "Scalability, tradeoffs, architecture choices", resource_url: "https://github.com/donnemartin/system-design-primer" },
    { name: "SQL", category: "Database", description: "Joins, indexes, transactions, query design", resource_url: "https://www.sqlshack.com/learn-sql/" },
    { name: "MongoDB", category: "Database", description: "Document modeling, indexing, aggregation basics", resource_url: "https://www.mongodb.com/docs/" },
    { name: "Prisma ORM", category: "Database", description: "Schema design, migrations, query patterns", resource_url: "https://www.prisma.io/docs" },
    { name: "Docker", category: "DevOps", description: "Containerization, Dockerfile, local orchestration", resource_url: "https://docs.docker.com" },
    { name: "CI/CD", category: "DevOps", description: "Build pipelines, test automation, deployment workflows", resource_url: "https://github.com/features/actions" },
    { name: "Kubernetes", category: "DevOps", description: "Workloads, services, deployments, scaling basics", resource_url: "https://kubernetes.io/docs/home/" },
    { name: "Cloud Platforms", category: "DevOps", description: "AWS/GCP/Azure fundamentals, managed services", resource_url: "https://aws.amazon.com/training/" },
    { name: "Monitoring", category: "DevOps", description: "Metrics, logs, alerting, uptime and reliability", resource_url: "https://prometheus.io/docs/introduction/overview/" },
    { name: "Figma", category: "Design", description: "UI mockups, design systems, prototyping", resource_url: "https://help.figma.com/hc/en-us" },
    { name: "Wireframing", category: "Design", description: "Low/high fidelity flows and interaction sketches", resource_url: "https://balsamiq.com/learn/" },
    { name: "UX Research", category: "Design", description: "User interviews, personas, problem framing", resource_url: "https://www.nngroup.com/articles/" },
    { name: "Visual Design", category: "Design", description: "Typography, hierarchy, spacing, color systems", resource_url: "https://refactoringui.com" },
    { name: "Accessibility", category: "Design", description: "Inclusive design and WCAG principles", resource_url: "https://www.w3.org/WAI/fundamentals/accessibility-intro/" },
    { name: "Python", category: "AI/ML", description: "Python for data science and ML workflows", resource_url: "https://docs.python.org/3/" },
    { name: "Statistics", category: "AI/ML", description: "Probability, distributions, hypothesis testing", resource_url: "https://www.khanacademy.org/math/statistics-probability" },
    { name: "Machine Learning", category: "AI/ML", description: "Supervised/unsupervised learning fundamentals", resource_url: "https://www.coursera.org/learn/machine-learning" },
    { name: "Deep Learning", category: "AI/ML", description: "Neural nets, training loops, model tuning", resource_url: "https://www.deeplearning.ai" },
    { name: "Data Preprocessing", category: "AI/ML", description: "Feature engineering, cleaning, transformations", resource_url: "https://scikit-learn.org/stable/modules/preprocessing.html" },
    { name: "Model Deployment", category: "AI/ML", description: "Serving ML models, monitoring drift, MLOps basics", resource_url: "https://ml-ops.org" },
    { name: "Authentication", category: "Backend", description: "Sessions/JWT, OAuth, security basics", resource_url: "https://auth0.com/docs" },
    { name: "Testing", category: "Quality", description: "Unit/integration tests, mocking, test pyramid", resource_url: "https://jestjs.io" },
    { name: "Cloud Architecture", category: "Architecture", description: "Infrastructure design, scalability, high availability", resource_url: "https://cloud.google.com/architecture" },
    { name: "Cyber Security", category: "Security", description: "Vulnerability assessment, encryption, secure coding", resource_url: "https://www.owasp.org" },
    { name: "Data Engineering", category: "Database", description: "ETL pipelines, data warehousing, big data tools", resource_url: "https://dataengineering.wiki" },
  ];

  const upsertedSkills = await Promise.all(
    skills.map((s) =>
      prisma.skill.upsert({
        where: { name: s.name },
        update: { category: s.category, description: s.description, resource_url: s.resource_url },
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
    {
      name: "Cloud Architect",
      description: "Expert in designing scalable, reliable, and secure cloud infrastructure.",
      targets: {
        "Cloud Architecture": { targetLevel: "EXPERT", weight: 3 },
        "Cloud Platforms": { targetLevel: "ADVANCED", weight: 3 },
        "System Design": { targetLevel: "ADVANCED", weight: 3 },
        Docker: { targetLevel: "ADVANCED", weight: 2 },
        Kubernetes: { targetLevel: "ADVANCED", weight: 2 },
        "Cyber Security": { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "Cyber Security Engineer",
      description: "Focuses on protecting systems, networks, and data from digital attacks.",
      targets: {
        "Cyber Security": { targetLevel: "ADVANCED", weight: 3 },
        Authentication: { targetLevel: "ADVANCED", weight: 3 },
        Testing: { targetLevel: "ADVANCED", weight: 2 },
        "Cloud Architecture": { targetLevel: "INTERMEDIATE", weight: 2 },
        Monitoring: { targetLevel: "ADVANCED", weight: 2 },
      },
    },
    {
      name: "Data Engineer",
      description: "Builds and maintains the systems that allow for large-scale data analysis.",
      targets: {
        "Data Engineering": { targetLevel: "ADVANCED", weight: 3 },
        SQL: { targetLevel: "ADVANCED", weight: 3 },
        Python: { targetLevel: "ADVANCED", weight: 2 },
        "Cloud Platforms": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Data Preprocessing": { targetLevel: "INTERMEDIATE", weight: 2 },
      },
    },
    {
      name: "Technical Product Manager",
      description: "Bridging the gap between business needs and technical implementation.",
      targets: {
        "UX Research": { targetLevel: "ADVANCED", weight: 3 },
        "System Design": { targetLevel: "INTERMEDIATE", weight: 2 },
        "REST APIs": { targetLevel: "INTERMEDIATE", weight: 2 },
        "Software Engineer": { targetLevel: "BEGINNER", weight: 1 },
        "Data Preprocessing": { targetLevel: "BEGINNER", weight: 1 },
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

