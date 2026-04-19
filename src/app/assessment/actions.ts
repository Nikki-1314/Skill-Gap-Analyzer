"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProficiencyLevel } from "@prisma/client";

function parseLevel(v: FormDataEntryValue | null): ProficiencyLevel | null {
  if (!v) return null;
  const s = String(v);
  if (s in ProficiencyLevel) return s as ProficiencyLevel;
  return null;
}

export async function createAssessment(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) redirect("/sign-in");

  const roleId = String(formData.get("roleId") ?? "");
  if (!roleId) redirect("/roles");

  const roleSkills = await prisma.roleSkill.findMany({
    where: { roleId },
    select: { skillId: true },
  });

  const ratings = roleSkills
    .map((rs) => {
      const level = parseLevel(formData.get(`skill_${rs.skillId}`));
      if (!level) return null;
      const evidence = formData.get(`evidence_${rs.skillId}`);
      return {
        skillId: rs.skillId,
        selfLevel: level,
        evidence: evidence ? String(evidence) : null,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const assessment = await prisma.$transaction(async (tx) => {
    const created = await tx.assessment.create({
      data: { userId: user.id, roleId },
    });

    if (ratings.length) {
      await tx.assessmentSkillRating.createMany({
        data: ratings.map((r) => ({ ...r, assessmentId: created.id })),
      });
    }

    return created;
  });

  redirect(`/dashboard/${assessment.id}`);
}

