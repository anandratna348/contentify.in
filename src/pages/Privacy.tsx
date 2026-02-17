import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Server, Eye, Trash2, Bell } from "lucide-react";

const sections = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Data Encryption",
    content: "All your data is stored using industry-standard AES-256 encryption at rest and TLS 1.3 encryption in transit. Your credentials and API keys are encrypted using separate encryption keys and are never stored in plain text.",
  },
  {
    icon: <Server className="h-6 w-6" />,
    title: "Data Storage",
    content: "Your data is stored on secure, SOC 2 compliant servers. We use isolated database environments to ensure your information is never mixed with other users' data. Regular backups are performed with encrypted snapshots.",
  },
  {
    icon: <Eye className="h-6 w-6" />,
    title: "Data Access",
    content: "We do not sell, trade, or share your personal data with third parties. Access to your data is strictly limited to authorized personnel for support purposes only, and all access is logged and audited.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Account Security",
    content: "We support secure OAuth-based authentication through trusted providers like Google. Session tokens are short-lived and automatically refreshed. Suspicious login attempts are flagged and blocked.",
  },
  {
    icon: <Trash2 className="h-6 w-6" />,
    title: "Data Deletion",
    content: "You can request complete deletion of your account and all associated data at any time. Upon deletion, all your data is permanently removed from our servers within 30 days, including all backups.",
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: "Breach Notification",
    content: "In the unlikely event of a data breach, we will notify all affected users within 72 hours via email, detailing the nature of the breach, data affected, and steps taken to mitigate the impact.",
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-16 flex-1">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Your privacy is our priority. Here's how we protect your data.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, i) => (
            <div key={i} className="glass-card rounded-2xl p-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-[52px]">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
