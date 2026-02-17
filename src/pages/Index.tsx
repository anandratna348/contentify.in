import { Send, Calendar, TrendingUp, Zap } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your posting overview
            </p>
          </div>
          <Link to="/generate">
            <Button variant="glow" size="lg">
              <Zap className="h-5 w-5" />
              Generate New Post
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Posts This Week"
            value={12}
            change="+3 from last week"
            changeType="positive"
            icon={<Send className="h-6 w-6" />}
          />
          <StatsCard
            title="Scheduled"
            value={8}
            change="Next in 2 hours"
            changeType="neutral"
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatsCard
            title="Total Engagement"
            value="2.4K"
            change="+18% this month"
            changeType="positive"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="AI Generated"
            value={45}
            change="This month"
            changeType="neutral"
            icon={<Zap className="h-6 w-6" />}
          />
        </div>

        {/* Recent Posts */}
        <RecentPosts />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
