import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import { User } from 'next-auth'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user: User) {},
    async getUser(id) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      })

      return {
        id: user.id,
        avatar_url: user.avatar_url!,
        email: user.email!,
        emailVerified: null,
        name: user.name,
        username: user.username,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      })

      return {
        id: user.id,
        avatar_url: user.avatar_url!,
        email: user.email!,
        emailVerified: null,
        name: user.name,
        username: user.username,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {},
    async updateUser(user) {},
    async deleteUser(userId) {},
    async linkAccount(account) {},
    async unlinkAccount({ providerAccountId, provider }) {},
    async createSession({ sessionToken, userId, expires }) {},
    async getSessionAndUser(sessionToken) {},
    async updateSession({ sessionToken }) {},
    async deleteSession(sessionToken) {},
    async createVerificationToken({ identifier, expires, token }) {},
    async useVerificationToken({ identifier, token }) {},
  }
}
