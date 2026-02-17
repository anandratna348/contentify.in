import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bot, Play, Pause, Plus, Trash2, Clock, Loader2, AlertCircle,
  Send, RefreshCw, Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { loadApiSettings } from "@/lib/settings";
import { generateXPost, type GeneratedPost } from "@/lib/gemini";
import {
  loadAgentState, saveAgentState, validateScheduleTimes,
  getTodayString, type AgentConfig
} from "@/lib/agent-store";

export function AgentPanel() {
  const [prompt, setPrompt] = useState("");
  const [scheduleTimes, setScheduleTimes] = useState<string[]>(["09:00"]);
  const [isActive, setIsActive] = useState(false);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved state
  useEffect(() => {
    const state = loadAgentState();
    setPrompt(state.config.prompt);
    setScheduleTimes(state.config.scheduleTimes.length > 0 ? state.config.scheduleTimes : ["09:00"]);
    setIsActive(state.config.isActive);
    setPosts(state.posts);
    loadApiSettings().then((s) => setHasApiKeys(!!(s?.geminiApiKey)));
  }, []);

  // Persist state
  const persist = useCallback((config: Partial<AgentConfig>, newPosts?: GeneratedPost[]) => {
    const state = loadAgentState();
    const updated = {
      config: { ...state.config, ...config },
      posts: newPosts ?? posts,
    };
    saveAgentState(updated);
  }, [posts]);

  // Validate times on change
  useEffect(() => {
    setTimeError(validateScheduleTimes(scheduleTimes));
  }, [scheduleTimes]);

  // Scheduler loop — checks every 30s if a post is due
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const check = async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = getTodayString();

      const state = loadAgentState();
      const pendingPost = state.posts.find(
        (p) => p.status === "pending" && p.scheduledDate === today && p.scheduledTime === currentTime
      );

      if (pendingPost) {
        // Mark as posted (mock — real X posting needs edge function)
        const updatedPosts = state.posts.map((p) =>
          p.id === pendingPost.id ? { ...p, status: "posted" as const } : p
        );
        setPosts(updatedPosts);
        saveAgentState({ ...state, posts: updatedPosts });
        toast.success(`Post published! "${pendingPost.content.slice(0, 50)}..."`);
      }

      // Auto-generate for next day if all today's posts are done
      const todayPosts = state.posts.filter((p) => p.scheduledDate === today);
      const allDone = todayPosts.length > 0 && todayPosts.every((p) => p.status !== "pending");
      if (allDone && state.config.prompt) {
        // Generate tomorrow's posts
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().slice(0, 10);
        const hasTomorrow = state.posts.some((p) => p.scheduledDate === tomorrowStr);
        if (!hasTomorrow) {
          await generatePostsForDate(tomorrowStr, state.config.prompt, state.config.scheduleTimes);
        }
      }
    };

    check();
    intervalRef.current = setInterval(check, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive]);

  const generatePostsForDate = async (date: string, userPrompt: string, times: string[]) => {
    const settings = await loadApiSettings();
    if (!settings?.geminiApiKey) {
      toast.error("Please add your Gemini API key in Settings");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateXPost(settings.geminiApiKey, userPrompt, times.length);
      const newPosts: GeneratedPost[] = times.map((time, i) => ({
        id: `${date}-${time}-${Date.now()}-${i}`,
        content: generated[i] || generated[0],
        scheduledTime: time,
        scheduledDate: date,
        status: "pending",
        createdAt: new Date().toISOString(),
      }));

      setPosts((prev) => {
        const updated = [...prev, ...newPosts];
        const state = loadAgentState();
        saveAgentState({ ...state, posts: updated, config: { ...state.config, lastGeneratedDate: date } });
        return updated;
      });
      toast.success(`Generated ${newPosts.length} posts for ${date}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate posts");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStart = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt/topic");
      return;
    }
    if (timeError) {
      toast.error(timeError);
      return;
    }
    if (!hasApiKeys) {
      toast.error("Please add your Gemini API key in Settings first");
      return;
    }

    setIsActive(true);
    persist({ prompt, scheduleTimes, isActive: true });

    const today = getTodayString();
    const hasTodayPosts = posts.some((p) => p.scheduledDate === today);
    if (!hasTodayPosts) {
      await generatePostsForDate(today, prompt, scheduleTimes);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    persist({ isActive: false });
    toast.info("Agent paused");
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    persist({ prompt: newPrompt });
  };

  const addTimeSlot = () => {
    if (scheduleTimes.length >= 6) {
      toast.error("Maximum 6 time slots per day");
      return;
    }
    setScheduleTimes((prev) => {
      const updated = [...prev, "12:00"];
      persist({ scheduleTimes: updated });
      return updated;
    });
  };

  const removeTimeSlot = (index: number) => {
    if (scheduleTimes.length <= 1) return;
    setScheduleTimes((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      persist({ scheduleTimes: updated });
      return updated;
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    setScheduleTimes((prev) => {
      const updated = [...prev];
      updated[index] = value;
      persist({ scheduleTimes: updated });
      return updated;
    });
  };

  const handleRegenerate = async () => {
    if (!prompt.trim()) return;
    const today = getTodayString();
    // Remove today's pending posts
    setPosts((prev) => {
      const updated = prev.filter((p) => !(p.scheduledDate === today && p.status === "pending"));
      saveAgentState({ config: loadAgentState().config, posts: updated });
      return updated;
    });
    await generatePostsForDate(today, prompt, scheduleTimes);
  };

  const deletePost = (id: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveAgentState({ config: loadAgentState().config, posts: updated });
      return updated;
    });
  };

  const today = getTodayString();
  const todayPosts = posts.filter((p) => p.scheduledDate === today);
  const upcomingPosts = posts.filter((p) => p.scheduledDate > today);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Config Panel */}
      <div className="space-y-6">
        {/* Prompt Input */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Agent Prompt</h3>
            {isActive && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Active
              </span>
            )}
          </div>

          {!hasApiKeys && (
            <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 mb-4">
              <AlertCircle className="h-4 w-4 text-warning shrink-0" />
              <p className="text-sm text-warning">
                <Link to="/settings" className="underline font-medium">Add your Gemini API key</Link> in Settings to start generating posts.
              </p>
            </div>
          )}

          <Textarea
            placeholder="Enter your topic or prompt... e.g. 'Relatable tech humor and dev life struggles for engagement'"
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            className="min-h-[120px] bg-secondary/50 border-border resize-none mb-4"
            disabled={isActive}
          />

          <div className="flex gap-2">
            {isActive ? (
              <Button variant="destructive" size="lg" className="flex-1" onClick={handlePause}>
                <Pause className="h-5 w-5" />
                Pause Agent
              </Button>
            ) : (
              <Button
                variant="glow"
                size="lg"
                className="flex-1"
                onClick={handleStart}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Schedule Config */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Daily Schedule</h3>
            </div>
            <span className="text-xs text-muted-foreground">{scheduleTimes.length}/6 slots</span>
          </div>

          <div className="space-y-3">
            {scheduleTimes.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-8">#{i + 1}</span>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updateTimeSlot(i, e.target.value)}
                  className="bg-secondary/50 border-border flex-1"
                  disabled={isActive}
                />
                {scheduleTimes.length > 1 && !isActive && (
                  <Button variant="ghost" size="icon" onClick={() => removeTimeSlot(i)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {timeError && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {timeError}
            </p>
          )}

          {scheduleTimes.length < 6 && !isActive && (
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={addTimeSlot}>
              <Plus className="h-4 w-4" />
              Add Time Slot
            </Button>
          )}

          <p className="text-xs text-muted-foreground mt-3">
            Minimum 3 minutes between posts. Posts are generated daily at these times.
          </p>
        </div>
      </div>

      {/* Posts Queue */}
      <div className="space-y-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Posts</h3>
            {todayPosts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
            )}
          </div>

          {todayPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No posts generated yet</p>
              <p className="text-xs mt-1">Start the agent to generate posts</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {todayPosts
                .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                .map((post) => (
                  <PostCard key={post.id} post={post} onDelete={deletePost} />
                ))}
            </div>
          )}
        </div>

        {upcomingPosts.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {upcomingPosts
                .sort((a, b) => `${a.scheduledDate}${a.scheduledTime}`.localeCompare(`${b.scheduledDate}${b.scheduledTime}`))
                .map((post) => (
                  <PostCard key={post.id} post={post} onDelete={deletePost} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onDelete }: { post: GeneratedPost; onDelete: (id: string) => void }) {
  const statusColors = {
    pending: "bg-warning/10 text-warning border-warning/30",
    posted: "bg-success/10 text-success border-success/30",
    failed: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[post.status]}`}>
            {post.status}
          </span>
          <span className="text-xs text-muted-foreground">
            {post.scheduledDate} · {post.scheduledTime}
          </span>
        </div>
        {post.status === "pending" && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(post.id)}>
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        )}
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}
