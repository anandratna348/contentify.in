import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { Zap, PenTool, Calendar, BarChart3, ArrowRight, Shield, Lock, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <PenTool className="h-8 w-8" />,
    title: "Create Your Content",
    description: "Use our AI-powered editor to generate engaging posts tailored to your audience and brand voice.",
    step: "01",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Schedule & Automate",
    description: "Plan your content calendar and schedule posts at optimal times for maximum engagement.",
    step: "02",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Track Performance",
    description: "Monitor your post performance with detailed analytics and insights to refine your strategy.",
    step: "03",
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Grow Your Audience",
    description: "Leverage data-driven recommendations to consistently grow your reach and engagement.",
    step: "04",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Contentify</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button variant="glow" size="sm">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-6 py-24 lg:py-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            AI-Powered Content Automation
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
            Automate Your
            <span className="gradient-text block">Content Strategy</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate, schedule, and analyze your social media posts with the power of AI.
            Save hours every week and grow your audience effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/login">
              <Button variant="glow" size="lg" className="text-lg px-10 h-14">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-10 h-14">
                See How It Works
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border/50 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">256-bit Encryption</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Your Data is Private</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered Intelligence</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get started in minutes with our simple four-step process
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="group relative glass-card rounded-2xl p-8 hover-lift cursor-default"
              >
                <div className="absolute -top-4 -right-2 text-7xl font-black text-primary/5 group-hover:text-primary/10 transition-colors select-none">
                  {step.step}
                </div>
                <div className="relative space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="relative space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Supercharge Your Content?
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Join thousands of creators who save hours every week with Contentify.
            </p>
            <Link to="/login">
              <Button variant="glow" size="lg" className="text-lg px-10 h-14 mt-4">
                Start for Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
