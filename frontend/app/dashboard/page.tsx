'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Brain, Plus, FileText, Calendar, User, Loader2, LogOut, Activity, TrendingUp, Clock, Search, Filter, BarChart3, Stethoscope, Zap } from 'lucide-react';
import { AdminSettings } from '@/components/admin-settings';

interface Diagnosis {
  id: number;
  session_id: string;
  symptoms: string;
  diagnosis_result: any;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    loadDiagnoses();
  }, []);

  const loadDiagnoses = async () => {
    try {
      const data = await api.getUserDiagnoses();
      setDiagnoses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      if (err.message?.includes('403') || err.message?.includes('authenticated')) {
        router.push('/auth/login');
        return;
      }
      setError(err.message || 'Failed to load diagnoses');
      setDiagnoses([]);
    } finally {
      setLoading(false);
    }
  };

  const extractDiagnosisTitle = (result: any) => {
    if (!result) return 'Processing...';
    if (typeof result === 'object') {
      return result.primary_diagnosis || result.diagnosis || 'Diagnosis';
    }
    if (typeof result === 'string') {
      return result.substring(0, 50) || 'Diagnosis';
    }
    return 'Diagnosis';
  };

  const filteredDiagnoses = diagnoses.filter(d => 
    d.symptoms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thisMonth = diagnoses.filter(d => 
    new Date(d.created_at).getMonth() === new Date().getMonth()
  ).length;

  // Animated background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.15 + 0.03,
      o: Math.random() * 0.25 + 0.1,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.15 + 0.03;
          p.o = Math.random() * 0.25 + 0.1;
        }
        ctx.fillStyle = `rgba(59,130,246,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.5, 1.5);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };
    window.addEventListener('resize', onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <style>{`
        .fade-in { opacity: 0; animation: fadeIn .8s ease .3s forwards; }
        @keyframes fadeIn { to { opacity: 1; } }
        .slide-up { opacity: 0; transform: translateY(20px); animation: slideUp .6s ease .4s forwards; }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-30 mix-blend-screen pointer-events-none" />
      
      <header className="relative border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-md opacity-60"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Medical Dashboard</h1>
                <p className="text-sm text-zinc-400">AI-Powered Diagnosis System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/diagnosis/new')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-emerald-500/25"
              >
                <Zap className="w-4 h-4" />
                Quick Demo
              </button>
              <button
                onClick={() => router.push('/diagnosis/new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                New Case
              </button>
              <button
                onClick={async () => {
                  await api.logout();
                  router.push('/');
                }}
                className="px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8 fade-in">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider">TOTAL</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{diagnoses.length}</p>
              <p className="text-sm text-zinc-400">Medical Cases</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider">RECENT</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{thisMonth}</p>
              <p className="text-sm text-zinc-400">This Month</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider">AI</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">100%</p>
              <p className="text-sm text-zinc-400">AI Powered</p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-zinc-400 font-semibold tracking-wider">RAG</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">FAISS</p>
              <p className="text-sm text-zinc-400">Vector DB</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 slide-up">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medical cases..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl text-zinc-50 placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* Admin Settings - Only visible to admin users */}
        <div className="mb-8">
          <AdminSettings />
        </div>

        {/* Cases List */}
        <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 slide-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Medical Cases</h2>
              <p className="text-zinc-400 text-sm">Recent diagnosis history</p>
            </div>
            <button className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 border border-zinc-700/50 rounded-xl text-zinc-300 text-sm flex items-center gap-2 transition-all duration-200 backdrop-blur">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : filteredDiagnoses.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No cases found</h3>
              <p className="text-white/60 mb-6">
                {searchTerm ? 'Try a different search term' : 'Create your first diagnosis to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => router.push('/diagnosis/new')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  Create Diagnosis
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDiagnoses.map((diagnosis, index) => (
                <div
                  key={diagnosis.id}
                  onClick={() => router.push(`/diagnosis/${diagnosis.id}`)}
                  className="group relative bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-xl text-sm font-medium ${
                            diagnosis.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            diagnosis.status === 'processing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {diagnosis.status === 'completed' ? '✓ Complete' : 
                             diagnosis.status === 'processing' ? '⏳ Processing' : '✗ Failed'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-200">
                          {extractDiagnosisTitle(diagnosis.diagnosis_result)}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm mb-3">
                          <span className="flex items-center gap-2 text-zinc-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(diagnosis.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-2 text-zinc-400">
                            <Clock className="w-4 h-4" />
                            {new Date(diagnosis.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-sm font-medium">
                          #{diagnosis.id}
                        </span>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">{diagnosis.symptoms}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
