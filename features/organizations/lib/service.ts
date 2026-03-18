import { prisma } from "@/lib/db"

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = toSlug(base)
  let suffix = 0
  while (await prisma.organization.findUnique({ where: { slug } })) {
    suffix += 1
    slug = `${toSlug(base)}-${suffix}`
  }
  return slug
}

export async function createOrganization(userId: string, name: string) {
  const slug = await uniqueSlug(name)

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      members: {
        create: { userId, role: "owner" },
      },
    },
  })

  return org
}

export async function getUserOrganizations(userId: string) {
  return prisma.organization.findMany({
    where: { members: { some: { userId } } },
    include: { members: { where: { userId }, select: { role: true } } },
    orderBy: { createdAt: "asc" },
  })
}

export async function getOrgMembership(userId: string, organizationId: string) {
  return prisma.member.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
  })
}
