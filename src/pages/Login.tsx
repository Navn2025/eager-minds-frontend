import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Fingerprint,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const switchMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError("");
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !shouldNavigate) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate, shouldNavigate]);

  // Navigate after user state is actually updated in context
  useEffect(() => {
    if (shouldNavigate && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      setShouldNavigate(false);
    }
  }, [shouldNavigate, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      // Trigger navigation after the user state updates
      setShouldNavigate(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "An error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen pt-28 sm:pt-32 md:pt-44 pb-12 sm:pb-16 md:pb-20 relative overflow-hidden">
      {/* Brand aurora ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-pink-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <motion.header
        key={isLogin ? "login-header" : "register-header"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-12 md:mb-14 mt-2 sm:mt-4 space-y-4 text-left w-full max-w-xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/70">
          <Fingerprint size={12} className="text-purple-400" />
          <span>Security Protocol</span>
        </div>

        <div className="inline-flex rounded-full border border-white/12 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={cn(
              "rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              isLogin
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-white/60 hover:text-white",
            )}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={cn(
              "rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
              !isLogin
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-white/60 hover:text-white",
            )}
          >
            Register
          </button>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white">
          {isLogin ? "Welcome" : "Create"}{" "}
          <span className="text-gradient">
            {isLogin ? "Back." : "Account."}
          </span>
        </h1>
        <p className="text-white/40 text-base sm:text-lg font-medium max-w-md leading-relaxed">
          {isLogin
            ? "Enter your credentials to access the Eager Minds Club."
            : "Initialize your profile to join the Eager Minds Club."}
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <Card className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.8rem] md:rounded-[4rem] p-2 sm:p-3 md:p-4 bg-white/[0.01] border-white/5 shadow-[0_0_100px_rgba(255,255,255,0.02)] group">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Cpu size={120} />
          </div>

          <CardContent className="p-6 sm:p-8 md:p-14 space-y-8 sm:space-y-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Lock size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                    Full Name
                  </label>
                  <div className="relative group/input">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      autoComplete="name"
                      className="w-full pl-14 pr-6 py-3.5 sm:py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">
                  Email
                </label>
                <div className="relative group/input">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="w-full pl-14 pr-6 py-3.5 sm:py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors italic"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group/input">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-white transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    className="w-full pl-14 pr-6 py-3.5 sm:py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-white placeholder:text-white/10 focus:bg-white focus:text-black transition-all text-sm font-bold outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 sm:h-16 rounded-[1.5rem] bg-gradient-to-r from-pink-500 via-purple-600 to-violet-600 text-white font-black uppercase tracking-widest text-[11px] group shadow-[0_6px_30px_rgba(168,85,247,0.35)] hover:shadow-[0_8px_36px_rgba(236,72,153,0.40)] hover:scale-[1.02] transition-all border-none"
                disabled={loading}
              >
                {loading
                  ? "Decrypting..."
                  : isLogin
                    ? "Initiate Session"
                    : "Authorize Creation"}
                <ArrowRight
                  size={18}
                  className="ml-3 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </form>

            <div className="pt-6 text-center">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                {isLogin ? "New to the club?" : "Already a member?"}
              </p>
              <button
                onClick={() => switchMode(!isLogin)}
                className="text-white font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all flex items-center gap-2 mx-auto px-6 py-2 rounded-full border border-purple-400/20 bg-purple-500/5 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:border-transparent hover:text-white"
              >
                {isLogin ? "Register Now" : "Sign In Here"}
                <Sparkles size={12} />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
