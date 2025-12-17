"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
} from "lucide-react";

export default function TabAuthSection() {
  const router = useRouter();
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login({ email: loginEmail, password: loginPassword });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.signup({ email: signupEmail, password: signupPassword, full_name: signupName });
      setSuccess("OTP sent to your email!");
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const otpCode = otp.join("");
      await api.verifyOtp(signupEmail, otpCode);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="fixed inset-0 bg-zinc-950 text-zinc-50">
      <style>{`
        .card-animate { opacity: 0; transform: translateY(12px); animation: fadeUp .6s ease .25s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .6s ease forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .7s ease forwards}
        .hline:nth-child(1){top:18%;animation-delay:.08s}
        .hline:nth-child(2){top:50%;animation-delay:.16s}
        .hline:nth-child(3){top:82%;animation-delay:.24s}
        .vline:nth-child(4){left:22%;animation-delay:.20s}
        .vline:nth-child(5){left:50%;animation-delay:.28s}
        .vline:nth-child(6){left:78%;animation-delay:.36s}
        @keyframes drawX{to{transform:scaleX(1)}}
        @keyframes drawY{to{transform:scaleY(1)}}

        .tab-shell{ position:relative; min-height: 420px; }
        .tab-panel{
          transition: opacity .22s ease, filter .22s ease;
        }
        .tab-panel[data-state="inactive"]{
          position:absolute; inset:0;
          opacity:0; filter: blur(8px);
          pointer-events:none;
        }
        .tab-panel[data-state="active"]{
          position:relative;
          opacity:1; filter: blur(0px);
        }

        .auth-tabs [role="tablist"] {
          background: #0f0f10; border: 1px solid #27272a; border-radius: 10px; padding: 4px;
        }
        .auth-tabs [role="tab"] {
          font-size: 13px; letter-spacing: .02em; color: #fafafa;
        }
        .auth-tabs [role="tab"][data-state="active"] {
          background: #111113; border-radius: 8px; box-shadow: inset 0 0 0 1px #27272a; color: #fafafa;
        }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none" />

      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
        <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">MedRAG</span>
        <Button variant="outline" className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80" onClick={() => router.push('/')}>
          <span className="mr-2">Home</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </header>

      <div className="h-full w-full grid place-items-center px-4">
        <Card className="card-animate w-full max-w-md border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">Welcome</CardTitle>
            <CardDescription className="text-zinc-300">Log in or create an account</CardDescription>
          </CardHeader>

          <CardContent>
            {error && <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-400">{error}</div>}
            {success && <div className="mb-4 p-3 rounded-lg text-sm bg-green-500/10 text-green-400">{success}</div>}

            <Tabs defaultValue="login" className="auth-tabs w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <div className="tab-shell mt-6">
                <TabsContent value="login" forceMount className="tab-panel space-y-5">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="login-password"
                          type={showLoginPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                          onClick={() => setShowLoginPw((v) => !v)}
                          aria-label={showLoginPw ? "Hide password" : "Show password"}
                        >
                          {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                        <Label htmlFor="remember" className="text-zinc-400">Remember me</Label>
                      </div>
                      <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100">Forgot password?</a>
                    </div>

                    <Button disabled={loading} className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                      {loading ? "Loading..." : "Continue"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" forceMount className="tab-panel space-y-5">
                  {!showOtp ? (
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                          id="signup-password"
                          type={showSignupPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                          onClick={() => setShowSignupPw((v) => !v)}
                          aria-label={showSignupPw ? "Hide password" : "Show password"}
                        >
                          {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox id="terms" className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                      <Label htmlFor="terms" className="text-zinc-400 text-sm">I agree to the Terms & Privacy</Label>
                    </div>

                    <Button disabled={loading} className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
                      {loading ? "Creating..." : "Create account"}
                    </Button>
                  </form>
                  ) : (
                  <div className="space-y-5">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-2">Verify Your Email</h3>
                      <p className="text-sm text-zinc-400">Enter the 6-digit code sent to {signupEmail}</p>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-lg bg-zinc-950 border-zinc-800 text-zinc-50"
                        />
                      ))}
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={loading || otp.some(d => !d)}
                      className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setShowOtp(false)}
                      className="w-full text-sm text-zinc-400 hover:text-zinc-200"
                    >
                      Back to signup
                    </button>
                  </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
            Need help? <a className="ml-1 text-zinc-200 hover:underline" href="#">Contact support</a>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
