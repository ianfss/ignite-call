// biome-ignore lint/correctness/noUnusedImports: required to extend 'next-auth' types
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatarUrl: string
  }
}
