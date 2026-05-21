"use client";

import { GroqChat } from "@/components/groq-chat";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with navigation */}
      <header className="border-b border-purple-500/20 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Epic
            </div>
            <span className="text-sm text-gray-400">Platform</span>
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm text-cyan-400 font-medium">
              Studio
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Creative Studio
          </h1>
          <p className="text-gray-400">
            Collaborate with AI to refine your creative direction and generate studio-quality content.
          </p>
        </div>

        {/* Chat container with cyber-neon styling */}
        <div className="relative">
          {/* Decorative glow elements */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-xl blur-xl opacity-20 pointer-events-none" />

          {/* Main chat card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden">
            {/* Header accent bar */}
            <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600" />

            {/* Chat component */}
            <div className="min-h-screen flex flex-col">
              <GroqChat />
            </div>
          </div>
        </div>
      </main>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
