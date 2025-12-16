"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Brain, FileText, Users, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

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
    <section className="fixed inset-0 bg-zinc-950 text-zinc-50 overflow-y-auto">
      <style>{`
        .fade-in { opacity: 0; animation: fadeIn .8s ease .2s forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        
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

      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none" />

      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      <div className="relative">
        <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MedRAG</h1>
                <p className="text-xs text-zinc-400">AI Medical Assistant</p>
              </div>
            </div>
            <nav className="flex gap-3">
              <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800" onClick={() => router.push('/auth')}>
                Login
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50" onClick={() => router.push('/auth')}>
                Sign Up
              </Button>
            </nav>
          </div>
        </header>

        <section className="container mx-auto px-6 py-20 text-center fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-semibold backdrop-blur-sm">
              🤖 Powered by AI & RAG Technology
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              AI-Powered Medical
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Diagnosis System
              </span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Advanced RAG technology with FAISS vector search and Gemini AI for accurate medical diagnosis
            </p>
            <Button 
              onClick={() => router.push('/auth')}
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-2xl hover:shadow-blue-500/50 transition transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 fade-in">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur hover:bg-zinc-900/90 transition group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Real-time Analysis</h3>
                <p className="text-zinc-400">
                  Instant diagnosis using FAISS vector search and Gemini AI with medical knowledge base
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur hover:bg-zinc-900/90 transition group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Case Management</h3>
                <p className="text-zinc-400">
                  Track and manage all patient diagnoses with auto-email reports
                </p>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/70 backdrop-blur hover:bg-zinc-900/90 transition group">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Similar Cases</h3>
                <p className="text-zinc-400">
                  Learn from similar cases with RAG-powered retrieval and knowledge graphs
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </section>
  );
}
