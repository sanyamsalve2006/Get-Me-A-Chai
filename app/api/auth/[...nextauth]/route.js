import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import DiscordProvider from "next-auth/providers/discord"
import User from "@/models/User"
import mongoose from "mongoose"

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return
  }

  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise()
    return
  }

  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/chai"
  )
}

const providers = []

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  )
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  )
}

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  providers.push(
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    })
  )
}

export const authOptions = {
  providers,
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email) {
        return false
      }

      await connectDatabase()

      let currentUser = await User.findOne({ email: user.email })
      if (!currentUser) {
        const preferredUsername =
          typeof profile?.login === "string"
            ? profile.login
            : user.email.split("@")[0]
        const baseUsername =
          preferredUsername.toLowerCase().replace(/[^a-z0-9_-]/g, "") ||
          "creator"
        let username = baseUsername
        let suffix = 1

        while (await User.exists({ username })) {
          username = `${baseUsername}${suffix}`
          suffix += 1
        }

        currentUser = await User.create({
          email: user.email,
          username,
          name: user.name || username,
        })
      }

      user.name = currentUser.username || currentUser.name || user.name
      return true
    },
    async session({ session }) {
      if (!session.user?.email) {
        return session
      }

      await connectDatabase()
      const dbUser = await User.findOne({ email: session.user.email })
      if (dbUser) {
        session.user.name = dbUser.username || dbUser.name || session.user.name
      }

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
