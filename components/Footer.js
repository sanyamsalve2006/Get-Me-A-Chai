import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t  border-white/10 bg-[#080d19]">

      {/* Background Glow */}
      <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-indigo-600/10 blur-[120px]" />

      {/* Main Footer Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 lg:px-8">

        {/* Footer Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div>

            <Image
              src="/chai_logo.png"
              alt="GetMeAChai"
              width={200}
              height={75}
              className="h-16 w-auto object-contain"
            />

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              A little help can make someone&apos;s day.

              Support dreams, ideas, and people who need
              a cup of chai.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">

              {/* Instagram */}
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-white/5
                  text-slate-400
                  transition-all duration-200
                  hover:border-[#d97736]/40
                  hover:bg-[#d97736]/10
                  hover:text-[#f4a261]
                "
              >
                <FaInstagram size={17} />
              </span>

              {/* Twitter */}
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-white/5
                  text-slate-400
                  transition-all duration-200
                  hover:border-[#d97736]/40
                  hover:bg-[#d97736]/10
                  hover:text-[#f4a261]
                "
              >
                <FaTwitter size={17} />
              </span>

              {/* LinkedIn */}
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-white/5
                  text-slate-400
                  transition-all duration-200
                  hover:border-[#d97736]/40
                  hover:bg-[#d97736]/10
                  hover:text-[#f4a261]
                "
              >
                <FaLinkedin size={17} />
              </span>

              {/* GitHub */}
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-white/10
                  bg-white/5
                  text-slate-400
                  transition-all duration-200
                  hover:border-[#d97736]/40
                  hover:bg-[#d97736]/10
                  hover:text-[#f4a261]
                "
              >
                <FaGithub size={17} />
              </span>

            </div>

          </div>


          {/* ================= PLATFORM ================= */}
          <div>

            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  href="/#community"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  Discover
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  Start a Campaign
                </Link>
              </li>

              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  How It Works
                </Link>
              </li>

              <li>
                <Link
                  href="/#about"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  About Us
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= SUPPORT ================= */}
          <div>

            <h3 className="text-sm font-semibold text-white">
              Get started
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  How it works
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  Sign in
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-400 transition hover:text-[#f4a261]"
                >
                  Creator dashboard
                </Link>
              </li>

            </ul>

          </div>


          {/* ================= CALL TO ACTION ================= */}
          <div>

            <h3 className="text-sm font-semibold text-white">
              Ready to create? ☕
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Set up your supporter page and share it with your community.
            </p>

            <Link
              href="/login"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#d97736] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e58a4a]"
            >
              Start a campaign
            </Link>

          </div>

        </div>


        {/* ================= BOTTOM ================= */}
        <div
          className="
            mt-14
            flex flex-col gap-4
            border-t border-white/[0.08]
            pt-7
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Copyright */}
          <p className="text-xs text-slate-500">
            © 2026 GetMeAChai. All rights reserved.
          </p>

          {/* Made With */}
          <p className="flex items-center gap-1 text-xs text-slate-500">

            Made with

            <Heart
              size={13}
              className="fill-[#d97736] text-[#d97736]"
            />

            and chai

          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;