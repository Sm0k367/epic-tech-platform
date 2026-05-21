import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Cyber-neon gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Epic Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Cinematic AI media generation studio. Collaborate with intelligent agents to create studio-quality content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Launch Studio
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
            >
              View Documentation
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Feature section placeholder */}
      <div className="w-full py-24 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Groq Chatbot",
                description: "AI-powered creative advisor with strong persona for prompt engineering",
              },
              {
                title: "Multi-Agent Orchestration",
                description: "Writer, Director, and Renderer agents collaborate on your vision",
              },
              {
                title: "Studio-Quality Output",
                description: "Generate cinematic images, video, and audio with fal.ai",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
