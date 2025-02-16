import { Adapter, AdapterAccount } from 'next-auth/adapters'
import { prisma } from '../prisma'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      return null
    },

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
    async getUserByAccount({ providerAccountId, provider }) {
      const { user } = await prisma.account.findUniqueOrThrow({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
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
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id!,
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
        },
      })

      return {
        id: prismaUser.id,
        avatar_url: prismaUser.avatar_url!,
        email: prismaUser.email!,
        emailVerified: null,
        name: prismaUser.name,
        username: prismaUser.username,
      }
    },

    async linkAccount(account: AdapterAccount) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.create({
        data: {
          expires,
          session_token: sessionToken,
          user_id: userId,
        },
      })

      return {
        sessionToken: session.session_token,
        expires: session.expires,
        userId: session.user_id,
      }
    },
    async getSessionAndUser(sessionToken) {
      const { user, ...session } = await prisma.session.findUniqueOrThrow({
        where: {
          session_token: sessionToken,
        },
        include: {
          user: true,
        },
      })

      return {
        session: {
          expires: session.expires,
          sessionToken: session.session_token,
          userId: session.user_id,
        },
        user: {
          avatar_url: user.avatar_url!,
          email: user.email!,
          emailVerified: null,
          id: user.id,
          name: user.name,
          username: user.username,
        },
      }
    },
    async updateSession({ sessionToken, expires, userId }) {
      const session = await prisma.session.update({
        where: {
          session_token: sessionToken,
        },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        expires: session.expires,
        sessionToken: session.session_token,
        userId: session.user_id,
      }
    },
  }
}
