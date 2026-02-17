import { useState } from "react";
import { Sparkles, Wand2, Copy, Calendar, Send, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const toneOptions = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "😊" },
  { id: "humorous", label: "Humorous", emoji: "😄" },
  { id: "inspirational", label: "Inspirational", emoji: "✨" },
  { id: "educational", label: "Educational", emoji: "📚" },
];

export function PostGenerator() {
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const mockPosts: Record<string, string> = {
      professional: `📊 Just analyzed the latest trends in ${topic}. Key takeaway: adaptation is crucial for success.\n\nHere's what leaders are doing differently:\n• Embracing change\n• Investing in innovation\n• Building resilient teams\n\nWhat's your strategy? 🎯 #Business #Innovation`,
      casual: `Hey everyone! 👋 Been diving deep into ${topic} lately and WOW, there's so much to learn!\n\nAnyone else exploring this? Would love to hear your thoughts! Drop a comment below 💬\n\n#Learning #Community`,
      humorous: `Me: I'll just quickly research ${topic}\n*3 hours later*\nMe: Did you know that... 🤓\n\nAnyone else fall down rabbit holes like this? Just me? Cool cool cool 😅\n\n#Relatable #TechHumor`,
      inspirational: `🌟 Remember: Every expert in ${topic} was once a beginner.\n\nYour journey of a thousand miles begins with a single step.\n\nStart today. Start now. The future you will thank you. 💪\n\n#Motivation #GrowthMindset`,
      educational: `🧵 Thread: Understanding ${topic} in 5 simple points\n\n1/ Let's break down the fundamentals...\n\n[Continue reading for actionable insights]\n\n#Education #Learning #Thread`,
    };

    setGeneratedPost(mockPosts[selectedTone] || mockPosts.professional);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    toast.success("Copied to clipboard!");
  };

  const handleSchedule = () => {
    toast.success("Post scheduled successfully!");
  };

  const handlePostNow = () => {
    toast.success("Post published to X!");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">AI Post Generator</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              What's your topic?
            </label>
            <Textarea
              placeholder="Enter your topic, idea, or key points..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[120px] bg-secondary/50 border-border resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Select tone
            </label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    selectedTone === tone.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  <span>{tone.emoji}</span>
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="glow"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                Generate Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Output Section */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Generated Post</h3>
          {generatedPost && (
            <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isGenerating}>
              <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              Regenerate
            </Button>
          )}
        </div>

        <div className="min-h-[200px] rounded-lg bg-secondary/50 border border-border p-4 mb-4">
          {generatedPost ? (
            <p className="text-foreground whitespace-pre-wrap">{generatedPost}</p>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Your generated post will appear here...
            </p>
          )}
        </div>

        {generatedPost && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleSchedule}>
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button variant="glow" onClick={handlePostNow}>
              <Send className="h-4 w-4" />
              Post Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
