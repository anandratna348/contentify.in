import { useState } from "react";
import { Calendar, Clock, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ScheduledPost {
  id: string;
  content: string;
  scheduledDate: string;
  scheduledTime: string;
}

const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    content: "🚀 Excited to share our latest update! We've been working hard on improving the user experience. Check it out! #ProductUpdate",
    scheduledDate: "Jan 20, 2024",
    scheduledTime: "09:00 AM",
  },
  {
    id: "2",
    content: "Thread incoming 🧵 5 tips for building a strong personal brand on X:\n\n1/ Be consistent...",
    scheduledDate: "Jan 21, 2024",
    scheduledTime: "02:30 PM",
  },
  {
    id: "3",
    content: "The key to success is showing up every single day. No shortcuts, no hacks - just consistent effort over time. 💪 #Motivation",
    scheduledDate: "Jan 22, 2024",
    scheduledTime: "07:00 AM",
  },
  {
    id: "4",
    content: "What's the one tool that has changed your workflow the most this year? Mine has been AI assistants - they're game changers! 🤖",
    scheduledDate: "Jan 23, 2024",
    scheduledTime: "12:00 PM",
  },
];

export function ScheduledPosts() {
  const [posts, setPosts] = useState(mockScheduledPosts);

  const handleDelete = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast.success("Post deleted successfully");
  };

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No scheduled posts</h3>
          <p className="text-muted-foreground mb-4">
            Generate and schedule your first post to see it here
          </p>
          <Button variant="glow">Create Post</Button>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-foreground line-clamp-3">{post.content}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{post.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{post.scheduledTime}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
