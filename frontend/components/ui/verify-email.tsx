"use client";

import * as React from "react";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const result = await api.verifyEmail(token);
      setStatus('success');
      setMessage(result.message || 'Email verified successfully!');
      setTimeout(() => router.push('/auth'), 3000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification failed');
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
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl text-white">Email Verification</CardTitle>
            <CardDescription className="text-zinc-300">Verifying your email address</CardDescription>
          </CardHeader>

          <CardContent className="text-center py-8">
            {status === 'loading' && (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 text-zinc-400 animate-spin mx-auto" />
                <p className="text-zinc-300">Verifying your email...</p>
                <p className="text-sm text-zinc-500">Please wait a moment</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-zinc-100 mb-2">Email Verified!</p>
                  <p className="text-zinc-400 mb-4">{message}</p>
                  <p className="text-sm text-zinc-500">Redirecting to login...</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <p className="text-xl font-semibold text-zinc-100 mb-2">Verification Failed</p>
                  <p className="text-zinc-400 mb-6">{message}</p>
                  <Button 
                    onClick={() => router.push('/auth')}
                    className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function VerifyEmailSection() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-zinc-950 text-zinc-50 grid place-items-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
