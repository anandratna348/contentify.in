import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Heart, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-4xl mx-auto px-6 py-16 flex-1">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">About Contentify</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            We're building the future of content creation — where AI meets creativity to help you grow faster.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          {[
            { icon: <Target className="h-7 w-7" />, title: "Our Mission", desc: "Empower creators and businesses to produce consistent, high-quality content without the burnout." },
            { icon: <Lightbulb className="h-7 w-7" />, title: "Our Vision", desc: "A world where every brand can tell its story effectively, powered by intelligent automation." },
            { icon: <Heart className="h-7 w-7" />, title: "Our Values", desc: "Privacy-first, user-centric design, and relentless focus on simplicity and quality." },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-8 space-y-4 text-center">
              <div className="h-14 w-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
