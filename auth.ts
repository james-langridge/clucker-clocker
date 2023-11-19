import {PrismaAdapter} from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type {NextAuthConfig} from 'next-auth'
import Google from 'next-auth/providers/google'

import {db} from '@/lib/db'

export const config = {
  adapter: PrismaAdapter(db),
  theme: {
    logo: 'https://clucker-clocker.vercel.app/logo.png',
  },
  providers: [Google],
  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.id = user.id
      }

      return session
    },
  },
} satisfies NextAuthConfig

export const {handlers, auth, signIn, signOut} = NextAuth(config)
