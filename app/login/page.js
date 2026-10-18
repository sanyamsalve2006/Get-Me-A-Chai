"use client"

import { useEffect, useState } from "react"
import { getProviders, signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FaDiscord, FaFacebook, FaGithub, FaGoogle } from "react-icons/fa6"

const loginProviders = [
  { id: "github", label: "Continue with GitHub", Icon: FaGithub },
  { id: "google", label: "Continue with Google", Icon: FaGoogle },
  { id: "facebook", label: "Continue with Facebook", Icon: FaFacebook },
  { id: "discord", label: "Continue with Discord", Icon: FaDiscord },
]

export default function LoginOptions() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [providers, setProviders] = useState(null)
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [providerLoadError, setProviderLoadError] = useState("")
  const [error, setError] = useState("")
  const [signingInWith, setSigningInWith] = useState("")

  useEffect(() => {
    if (session) router.replace("/dashboard")
  }, [router, session])

  useEffect(() => {
    let isCurrent = true

    const loadProviders = async () => {
      try {
        const availableProviders = await getProviders()
        if (isCurrent) setProviders(availableProviders || {})
      } catch (providerError) {
        console.error("Could not load sign-in providers:", providerError)
        if (isCurrent) {
          setProviderLoadError("Sign-in options could not be loaded. Please refresh and try again.")
        }
      } finally {
        if (isCurrent) setLoadingProviders(false)
      }
    }

    loadProviders()
    return () => {
      isCurrent = false
    }
  }, [])

  const handleSignIn = async (providerId) => {
    if (signingInWith || !providers?.[providerId]) return

    setError("")
    setSigningInWith(providerId)

    try {
      await signIn(providerId, { callbackUrl: "/dashboard" })
    } catch (signInError) {
      console.error(`${providerId} sign-in failed:`, signInError)
      setError(`Could not start ${providerId} sign-in. Please try again.`)
      setSigningInWith("")
    }
  }

  return (
    <main className="flex min-h-[75svh] w-full items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-center shadow-2xl shadow-black/20 sm:p-9">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-400/10">
          <span className="text-3xl" aria-hidden="true">☕</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Sign in to set up your page and connect with your supporters.
        </p>

        <div className="mt-8 grid gap-3">
          {loginProviders.map(({ id, label, Icon }) => {
            const isConfigured = Boolean(providers?.[id])
            const isDisabled =
              loadingProviders ||
              status === "loading" ||
              Boolean(signingInWith) ||
              !isConfigured

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSignIn(id)}
                disabled={isDisabled}
                aria-label={isConfigured ? label : `${label} (not configured)`}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 font-semibold text-slate-200 outline-none transition-colors hover:border-white/20 hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon className="shrink-0 text-lg text-white" aria-hidden="true" />
                <span>
                  {signingInWith === id ? "Connecting..." : label}
                </span>
              </button>
            )
          })}
        </div>

        {providerLoadError && <p role="alert" className="mt-4 text-sm text-red-300">{providerLoadError}</p>}
        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}

        {!loadingProviders && providers && (
          <p className="mt-5 text-xs leading-5 text-slate-500">
            Enable Google, Facebook, or Discord by setting the matching
            GOOGLE_, FACEBOOK_, or DISCORD_ client ID and client secret on the
            server, then restart the app.
          </p>
        )}
      </section>
    </main>
  )
}
