"use client"
import { useEffect, useState } from 'react'
import Script from 'next/script'
import { initiate, verifyPayment } from '@/action/useraction'
import { fetchuser, fetchpayments } from '@/action/useraction'
const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentForm] = useState({ name: "", message: "", amount: "" })
    const [razorpayLoaded, setRazorpayLoaded] = useState(false)
    const [razorpayError, setRazorpayError] = useState(false)
    const [isPaying, setIsPaying] = useState(false)
    const [paymentMessage, setPaymentMessage] = useState("")
    const [currentuser, setCurrentuser] = useState(null)
    const [payment, setPayment] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const [pageError, setPageError] = useState("")

    useEffect(() => {
        let isCurrent = true

        const getData = async () => {
            setPageLoading(true)
            setPageError("")

            try {
                const [user, payments] = await Promise.all([
                    fetchuser(username),
                    fetchpayments(username),
                ])

                if (isCurrent) {
                    setCurrentuser(user)
                    setPayment(payments)
                }
            } catch (error) {
                console.error("Could not load creator page:", error)
                if (isCurrent) setPageError("We couldn't load this creator page. Please try again.")
            } finally {
                if (isCurrent) setPageLoading(false)
            }
        }

        getData()
        return () => {
            isCurrent = false
        }
    }, [username])
    const pay = async (amountInPaise) => {
        if (isPaying) return
        if (!paymentform.name.trim()) {
            setPaymentMessage("Enter your name before sending a chai.")
            return
        }
        setIsPaying(true)
        setPaymentMessage("")

        try {
            if (!razorpayLoaded || !window.Razorpay) {
                throw new Error("Payment checkout is still loading. Please try again.")
            }

            const order = await initiate(amountInPaise, username, paymentform)
            const checkout = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Get Me A Chai",
                description: "Support this creator",
                order_id: order.id,
                method: { upi: true },
                prefill: { name: paymentform.name.trim() },
                theme: { color: "#3399cc" },
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        })
                        setPaymentMessage("Payment successful. Thank you for your support!")
                        try {
                            setPayment(await fetchpayments(username))
                        } catch (refreshError) {
                            console.error("Payment succeeded, but supporters could not be refreshed:", refreshError)
                            setPaymentMessage("Payment successful. Thank you! Refresh the page to update the supporter list.")
                        }
                    } catch (error) {
                        setPaymentMessage(error.message || "Could not verify the payment.")
                    } finally {
                        setIsPaying(false)
                    }
                },
                modal: {
                    ondismiss: () => setIsPaying(false),
                },
            })

            checkout.on("payment.failed", (response) => {
                setPaymentMessage(
                    response.error?.description || "Payment failed. Please try again."
                )
                setIsPaying(false)
            })
            checkout.open()
        } catch (error) {
            setPaymentMessage(error.message || "Could not start the payment.")
            setIsPaying(false)
        }
    }

    const handleChange = (e) => {
        setPaymentForm((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }))
    }

    const payCustomAmount = () => {
        const amountInRupees = Number(paymentform.amount)
        const amountInPaise = Math.round(amountInRupees * 100)

        if (!Number.isFinite(amountInRupees) || amountInPaise < 100) {
            setPaymentMessage("Enter a payment amount of at least ₹1.")
            return
        }

        pay(amountInPaise)
    }

    return (

        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
                onError={() => {
                    setRazorpayError(true)
                    setPaymentMessage("Could not load Razorpay checkout. Please refresh and try again.")
                }}
            />

            <main className="min-h-screen pb-16">
                <div className="relative h-48 sm:h-64 md:h-85">
                    <img
                        src={currentuser?.coverpic || "/Demon_slayer.png"}
                        alt={`${username}'s cover`}
                        className="absolute h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 left-4 z-10 size-24 translate-y-1/2 overflow-hidden rounded-full border-4 border-orange-400 bg-slate-900 shadow-xl ring-4 ring-slate-950 sm:left-50 sm:size-28">
                        <img
                            src={currentuser?.profilepic || "/Cat_hi.gif"}
                            alt={`${username}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <section className="mx-auto mt-2 flex w-full max-w-6xl flex-col gap-6 px-4 pt-12 sm:px-6 sm:pt-14">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="break-words text-3xl font-extrabold sm:text-4xl">{currentuser?.name || username}</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                                Support {currentuser?.name || username} and help make their next idea happen.
                            </p>
                        </div>
                        <a href="#support" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500">
                            Send a chai
                        </a>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Supporter page</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{payment.length} {payment.length === 1 ? "supporter" : "supporters"}</span>
                    </div>
                </section>
                <section id="support" className="mx-auto mt-10 grid w-full max-w-6xl scroll-mt-24 gap-5 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
                        <h2 className="mb-5 text-xl font-bold text-white">Recent supporters</h2>
                        {pageLoading ? (
                            <p className="text-sm text-zinc-400">Loading supporters...</p>
                        ) : pageError ? (
                            <p role="alert" className="text-sm text-red-300">{pageError}</p>
                        ) : payment.length === 0 ? (
                            <p className="text-sm leading-6 text-zinc-400">Be the first to support {currentuser?.name || username} with a chai.</p>
                        ) : (
                            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                                {payment.map((p) => (
                                    <div key={p._id} className="flex items-center justify-between gap-3 rounded-xl bg-zinc-800 p-3">
                                        <span className="min-w-0 break-words text-white">{p.name}</span>
                                        <span className="shrink-0 font-semibold text-amber-400">₹{(Number(p.amount) / 100).toLocaleString("en-IN")}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6">
                        <h2 className="mb-5 text-xl font-bold text-white">Send a chai</h2>
                        {pageLoading ? (
                            <p className="text-sm text-zinc-400">Loading creator details...</p>
                        ) : pageError ? (
                            <p role="alert" className="text-sm text-red-300">{pageError}</p>
                        ) : !currentuser ? (
                            <p role="status" className="text-sm text-zinc-300">We couldn&apos;t find a creator with that username.</p>
                        ) : (
                            <div>
                                <div className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        aria-label="Your name"
                                        maxLength={80}
                                        required
                                        value={paymentform.name}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    />

                                    <input
                                        type="text"
                                        name="message"
                                        placeholder="Message (optional)"
                                        aria-label="Message"
                                        maxLength={500}
                                        value={paymentform.message}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    />

                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Donation amount (₹)"
                                        aria-label="Donation amount in rupees"
                                        min="1"
                                        step="0.01"
                                        value={paymentform.amount}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    />

                                    <button
                                        type="button"
                                        onClick={payCustomAmount}
                                        disabled={isPaying || !razorpayLoaded || razorpayError}
                                        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 font-bold text-black shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isPaying ? "Opening secure checkout..." : "Pay custom amount"}
                                    </button>
                                    {paymentMessage && !razorpayError && (
                                        <p role="status" aria-live="polite" className="text-sm text-white">
                                            {paymentMessage}
                                        </p>
                                    )}
                                </div>
                                <div className="my-4 flex flex-wrap gap-3">
                                    <button type="button" disabled={isPaying || !razorpayLoaded || razorpayError} onClick={() => pay(1000)} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 font-bold text-black shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
                                        ₹10
                                    </button>
                                    <button type="button" disabled={isPaying || !razorpayLoaded || razorpayError} onClick={() => pay(2000)} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 font-bold text-black shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
                                        ₹20
                                    </button>
                                    <button type="button" disabled={isPaying || !razorpayLoaded || razorpayError} onClick={() => pay(3000)} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 font-bold text-black shadow-lg shadow-blue-500/30 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60">
                                        ₹30
                                    </button>
                                </div>
                                {razorpayError ? (
                                    <p role="alert" className="text-xs text-red-300">{paymentMessage}</p>
                                ) : !razorpayLoaded ? (
                                    <p className="text-xs text-zinc-400">Secure checkout is loading...</p>
                                ) : null}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}

export default PaymentPage
