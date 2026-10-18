"use client"
import { useSession, signOut } from "next-auth/react"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session } = useSession()
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1120]/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/chai_logo.png"
                        alt="GetMeAChai"
                        width={220}
                        height={80}
                        priority
                        className="h-16 w-auto object-contain sm:h-20"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        href="/"
                        className="text-base font-medium text-slate-300 transition hover:text-[#f4a261]"
                    >
                        Home
                    </Link>

                    <Link
                        href="/#community"
                        className="text-base font-medium text-slate-300 transition hover:text-[#f4a261]"
                    >
                        Discover
                    </Link>

                    <Link
                        href="/#how-it-works"
                        className="text-base font-medium text-slate-300 transition hover:text-[#f4a261]"
                    >
                        How It Works
                    </Link>

                    <Link
                        href="/#about"
                        className="text-base font-medium text-slate-300 transition hover:text-[#f4a261]"
                    >
                        About
                    </Link>

                </div>

                {/* Right Section */}
                <div className="hidden items-center gap-3 md:flex">

                    {/* Start Campaign */}
                    <Link href={session ? "/dashboard" : "/login"} className="rounded-full bg-[#d97736] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition hover:bg-[#e58a4a] hover:shadow-orange-500/20">
                        Start a Campaign
                    </Link>

                    {/* Login */}
                    {!session &&
                        <Link
                            href="/login"
                            className="rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/30"                    >
                            Login
                        </Link>}
                    {session &&
                        <div><div className="relative">
                            <button
                                type="button"
                                aria-expanded={profileOpen}
                                aria-haspopup="menu"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 p-1.5 pr-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
                                
                            >
                                {/* Profile picture */}
                                <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-orange-400 via-pink-500 to-purple-600">
                                    <User className="size-5 text-white" />
                                </div>

                                <span className="text-sm font-medium text-slate-200">
                                    {session.user.name}
                                </span>

                                <ChevronDown
                                    className={`size-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                
                                <div role="menu" className="absolute right-0 top-14 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

                                    {/* Profile Header */}
                                    <div className="border-b border-white/10 px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-orange-400 via-pink-500 to-purple-600">
                                                <User className="size-6 text-white" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-white">
                                                    {session.user.name} 👋
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="p-2">

                                        <Link
                                            href={`/${encodeURIComponent(session.user.name || "")}`}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                                            role="menuitem"
                                        >
                                            <User className="size-4" />
                                            Profile
                                        </Link>

                                        <Link
                                            href="/dashboard"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                                            role="menuitem"
                                        >
                                            <Settings className="size-4" />
                                            Settings
                                        </Link>

                                        <div className="my-2 h-px bg-white/10" />

                                        <button
                                            onClick={() => {
                                                signOut()
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                            type="button"
                                            role="menuitem"
                                        >
                                            <LogOut className="size-4" />
                                            Logout
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div></div>
                    }
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 md:hidden"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-white/10 bg-[#0b1120]/95 px-4 py-5 backdrop-blur-xl md:hidden sm:px-6">

                    <div className="flex flex-col gap-1">

                        <Link
                            href="/"
                            className="rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Home
                        </Link>

                        <Link
                            href="/#community"
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Discover
                        </Link>

                        <Link
                            href="/#how-it-works"
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            How It Works
                        </Link>

                        <Link
                            href="/#about"
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            About
                        </Link>

                        <Link href={session ? "/dashboard" : "/login"} onClick={() => setMenuOpen(false)} className="mt-3 rounded-xl bg-[#d97736] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#e58a4a]">
                            Start a Campaign
                        </Link>

                        {/* Mobile Login */}
                        {!session ? (
                            <Link
                                href="/login"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                            >
                                Login
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={`/${encodeURIComponent(session.user.name || "")}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                                >
                                    Profile page
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => signOut()}
                                    className="mt-2 rounded-xl border border-white/10 px-5 py-3 font-semibold text-red-300 transition hover:bg-red-500/10"
                                >
                                    Sign out
                                </button>
                            </>
                        )}

                    </div>

                </div>
            )}

        </nav>
    );
};

export default Navbar;