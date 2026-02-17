import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-16 flex-1">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">Last updated: February 2026</p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using Contentify, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
          </section>

          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Use of Service</h2>
            <p>Contentify provides AI-powered content generation and scheduling tools. You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for all content generated and published through your account.</p>
          </section>

          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized access. We reserve the right to suspend accounts that violate these terms.</p>
          </section>

          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
            <p>Content you create using Contentify belongs to you. However, you grant us a limited license to process and store your content for the purpose of providing our services. The Contentify platform, branding, and technology remain our intellectual property.</p>
          </section>

          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>Contentify is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service, including but not limited to lost revenue or data loss.</p>
          </section>

          <section className="glass-card rounded-2xl p-8 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of significant changes via email.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
