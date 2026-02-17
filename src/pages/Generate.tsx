import { MainLayout } from "@/components/layout/MainLayout";
import { PostGenerator } from "@/components/generate/PostGenerator";

const Generate = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generate Post</h1>
          <p className="text-muted-foreground mt-1">
            Use AI to create engaging posts for your X audience
          </p>
        </div>

        {/* Generator */}
        <PostGenerator />
      </div>
    </MainLayout>
  );
};

export default Generate;
