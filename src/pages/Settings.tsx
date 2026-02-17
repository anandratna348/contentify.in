import { MainLayout } from "@/components/layout/MainLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your API keys and preferences
          </p>
        </div>

        {/* Settings Form */}
        <SettingsForm />
      </div>
    </MainLayout>
  );
};

export default Settings;
