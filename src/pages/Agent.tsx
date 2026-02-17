import { MainLayout } from "@/components/layout/MainLayout";
import { AgentPanel } from "@/components/agent/AgentPanel";

const Agent = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agent</h1>
          <p className="text-muted-foreground mt-1">
            Set a prompt, schedule times, and let AI auto-generate & post to X daily
          </p>
        </div>
        <AgentPanel />
      </div>
    </MainLayout>
  );
};

export default Agent;
