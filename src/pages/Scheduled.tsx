import { MainLayout } from "@/components/layout/MainLayout";
import { ScheduledPosts } from "@/components/schedule/ScheduledPosts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Scheduled = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Scheduled Posts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your upcoming scheduled posts
            </p>
          </div>
          <Link to="/generate">
            <Button variant="glow">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Scheduled Posts List */}
        <ScheduledPosts />
      </div>
    </MainLayout>
  );
};

export default Scheduled;
