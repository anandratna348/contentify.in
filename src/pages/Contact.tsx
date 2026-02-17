import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-2xl mx-auto px-6 py-16 flex-1 w-full">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground text-lg">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Name</label>
              <Input placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <Textarea placeholder="How can we help?" rows={5} required />
            </div>
            <Button type="submit" variant="glow" size="lg" className="w-full" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
              <MessageSquare className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-8 flex items-center gap-3 text-muted-foreground text-sm">
          <Mail className="h-4 w-4 text-primary" />
          <span>support@contentify.in</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
