"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

const steps = [
  {
    number: "01",
    title: "Create your page",
    description: "Sign in and set up a page that tells people what you are creating.",
  },
  {
    number: "02",
    title: "Share your link",
    description: "Invite your community to visit your page and leave you a chai.",
  },
  {
    number: "03",
    title: "Get supported",
    description: "Receive contributions securely through Razorpay checkout.",
  },
]

export default function Home() {
  const { data: session } = useSession()
  const startHref = session ? "/dashboard" : "/login"

  return (
    <main className="text-white">
      <section className="relative flex min-h-[calc(80svh-5rem)] items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px] sm:size-96" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300 backdrop-blur-md">
            <span aria-hidden="true">☕</span>
            <span>A little help, one chai at a time</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-8xl">
            GetMe
            <span className="bg-linear-to-r from-[#f59e0b] via-[#f97316] to-[#ec4899] bg-clip-text text-transparent">
              AChai
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-xl sm:leading-8">
            Let&apos;s take a chai break together. Share a little kindness, support a
            dream, and make someone&apos;s day.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={startHref}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#f97316] via-[#ea580c] to-[#db2777] px-8 py-3 font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
            >
              {session ? "Open your dashboard" : "Start your page"}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 font-semibold text-slate-200 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      <section id="community" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Made for creators</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Your fans are just <span className="text-[#f4a261]">one chai away.</span> ☕
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              Give your community a simple way to support the work they love.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {["Share your creativity", "Build with your community", "Keep making what you love"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 text-center shadow-lg shadow-black/10">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-orange-400/10 text-3xl" aria-hidden="true">
                  ☕
                </div>
                <h3 className="font-bold text-white">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Simple by design</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">How it works</h2>
            </div>
            <Link href={startHref} className="font-semibold text-orange-300 transition hover:text-orange-200">
              {session ? "Go to your dashboard" : "Create your page"} <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                <p className="text-sm font-bold tracking-widest text-orange-300">{step.number}</p>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-7 text-slate-400">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 rounded-3xl border border-orange-300/15 bg-linear-to-br from-orange-400/10 to-pink-500/5 p-6 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Make space for your next idea.</h2>
            <p className="mt-2 max-w-xl leading-7 text-slate-300">Create your page and let your supporters be part of what comes next.</p>
          </div>
          <Link href={startHref} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-400">
            {session ? "Open dashboard" : "Get started"} <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
