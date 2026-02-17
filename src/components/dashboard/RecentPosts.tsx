import { Clock, CheckCircle2, AlertCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  content: string;
  status: "posted" | "scheduled" | "failed";
  scheduledAt: string;
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

const mockPosts: Post[] = [
  {
    id: "1",
    content: "🚀 Just launched our new AI-powered feature! The future of automation is here. What do you think about AI in daily workflows? #AI #Automation",
    status: "posted",
    scheduledAt: "2024-01-15 09:00",
    engagement: { likes: 245, retweets: 67, replies: 23 },
  },
  {
    id: "2",
    content: "Thread incoming! 🧵 5 ways to boost your productivity using smart automation tools...",
    status: "scheduled",
    scheduledAt: "2024-01-16 14:30",
  },
  {
    id: "3",
    content: "Happy Monday! Remember: consistency beats intensity. Show up every day, even when it's hard. 💪",
    status: "posted",
    scheduledAt: "2024-01-15 07:00",
    engagement: { likes: 532, retweets: 128, replies: 45 },
  },
  {
    id: "4",
    content: "The best time to plant a tree was 20 years ago. The second best time is now. Start building today! 🌱",
    status: "failed",
    scheduledAt: "2024-01-14 18:00",
  },
];

const statusConfig = {
  posted: {
    icon: CheckCircle2,
    label: "Posted",
    className: "text-success bg-success/10",
  },
  scheduled: {
    icon: Clock,
    label: "Scheduled",
    className: "text-warning bg-warning/10",
  },
  failed: {
    icon: AlertCircle,
    label: "Failed",
    className: "text-destructive bg-destructive/10",
  },
};

export function RecentPosts() {
  return (
    <div className="glass-card rounded-xl">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Posts</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="divide-y divide-border">
        {mockPosts.map((post) => {
          const status = statusConfig[post.status];
          const StatusIcon = status.icon;
          
          return (
            <div key={post.id} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      status.className
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {post.scheduledAt}
                    </span>
                    {post.engagement && (
                      <span className="text-xs text-muted-foreground">
                        {post.engagement.likes} likes · {post.engagement.retweets} retweets
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
