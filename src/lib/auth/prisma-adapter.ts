/** biome-ignore-all lint/style/noNonNullAssertion: non-null assertions are required in this context to satisfy strict typing guarantees */
/** biome-ignore-all lint/suspicious/noExplicitAny: required for compatibility with dynamic or untyped data */

import { cookies } from 'next/headers'
import type { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user: any) {
      const cookieStore = await cookies()
      const userIdOnCookies = cookieStore.get('@ignitecall:userId')?.value

      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies.')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })

      cookieStore.delete('@ignitecall:userId')

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email!,
        emailVerified: null,
        username: prismaUser.username,
        avatarUrl: prismaUser.avatarUrl!,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email!,
        emailVerified: null,
        username: user.username,
        avatarUrl: user.avatarUrl!,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatarUrl: user.avatarUrl!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        email: user.email!,
        emailVerified: null,
        username: user.username,
        avatarUrl: user.avatarUrl!,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email!,
        emailVerified: null,
        username: prismaUser.username,
        avatarUrl: prismaUser.avatarUrl!,
      }
    },

    async linkAccount(account: any) {
      await prisma.account.create({
        data: {
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refreshToken,
          accessToken: account.accessToken,
          expiresAt: account.expiresAt,
          tokenType: account.tokenType,
          scope: account.scope,
          idToken: account.idToken,
          sessionState: account.sessionState,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          userId,
          expires,
          sessionToken,
        },
      })

      return {
        userId,
        sessionToken,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.userId,
          expires: session.expires,
          sessionToken: session.sessionToken,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatarUrl: user.avatarUrl!,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          sessionToken,
        },
        data: {
          expires,
          userId,
        },
      })

      return {
        sessionToken: prismaSession.sessionToken,
        userId: prismaSession.userId,
        expires: prismaSession.expires,
      }
    },
  }
}
