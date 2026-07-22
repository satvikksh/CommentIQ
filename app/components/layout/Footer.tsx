import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { FaYoutube, FaGithub, FaLinkedin } from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const productLinks = [
    { title: "Features", href: "#features" },
    { title: "How It Works", href: "#how-it-works" },
    { title: "Dashboard", href: "/dashboard" },
    { title: "Pricing", href: "#" },
  ];

  const resourceLinks = [
    { title: "Documentation", href: "#" },
    { title: "API", href: "#" },
    { title: "Blog", href: "#" },
    { title: "FAQ", href: "#faq" },
  ];

  const companyLinks = [
    { title: "About", href: "#" },
    { title: "Contact", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="border-t border-white/10 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="rounded-xl bg-red-600 p-3">
                <FaYoutube className="text-2xl text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-black">CommentIQ</h2>
                <p className="text-sm text-zinc-500">AI Powered Analytics</p>
              </div>
            </Link>

            <p className="mt-6 max-w-md leading-8 text-zinc-400">
              Understand what your audience is really saying. CommentIQ
              transforms thousands of YouTube comments into meaningful insights,
              summaries, and actionable analytics using AI.
            </p>

            {/* Contact */}
            <div className="mt-8 space-y-3 text-zinc-400">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-400" />
                support@commentiq.ai
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-red-400" />
                India
              </div>
            </div>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              {[
                {
                  icon: FaGithub,
                  href: "#",
                },
                {
                  icon: FaXTwitter,
                  href: "#",
                },
                {
                  icon: FaLinkedin,
                  href: "#",
                },
              ].map((social, index) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-red-500/40 hover:bg-red-500/10"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Product</h3>

            <div className="space-y-4">
              {productLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center gap-2 text-zinc-400 transition hover:text-white"
                >
                  {link.title}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Resources</h3>

            <div className="space-y-4">
              {resourceLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center gap-2 text-zinc-400 transition hover:text-white"
                >
                  {link.title}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Company</h3>

            <div className="space-y-4">
              {companyLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center gap-2 text-zinc-400 transition hover:text-white"
                >
                  {link.title}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} CommentIQ. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="#" className="transition hover:text-white">
              Privacy
            </Link>

            <Link href="#" className="transition hover:text-white">
              Terms
            </Link>

            <Link href="#" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
