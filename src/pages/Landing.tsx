import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Activity, Eye, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Landing() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  const features = [
    {
      icon: Activity,
      title: "Continuous Sensing",
      desc: "Passively monitors typing patterns, voice signals, and sleep quality",
    },
    {
      icon: Brain,
      title: "Autonomous AI",
      desc: "Proactively provides interventions without waiting for you to ask",
    },
    {
      icon: Eye,
      title: "Adaptive Learning",
      desc: "Learns from your feedback to personalize support over time",
    },
    {
      icon: Shield,
      title: "Privacy First",
      desc: "Full transparency on data use with opt-out controls",
    },
  ];

  return (
    <div className="min-h-screen gradient-calm flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">MindGuard AI</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-lavender-light px-4 py-1.5 text-sm text-primary mb-6">
              <span className="h-2 w-2 rounded-full bg-primary pulse-calm" />
              Autonomous Mental Health Support
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Your silent companion —{" "}
              <span className="text-primary">always watching, never judging</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              MindGuard AI senses stress signals from your typing, voice, and sleep patterns. 
              It predicts, acts, and adapts — all without you needing to ask for help.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-lg bg-sand/60 border border-border/30 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <Shield className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
                <strong>Disclaimer:</strong> MindGuard AI is a supportive tool, not a diagnostic system. 
                It does not replace professional mental health care.
              </p>
            </div>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Card className="gradient-card border-border/40 shadow-lg shadow-primary/5">
              <CardHeader className="text-center pb-4">
                <CardTitle className="font-display text-2xl">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </CardTitle>
                <CardDescription>
                  {isSignUp
                    ? "Start your journey with autonomous support"
                    : "Sign in to continue your wellness journey"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <Input
                      placeholder="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-background/60"
                    />
                  )}
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/60"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/60"
                  />
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-primary hover:underline"
                  >
                    {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
