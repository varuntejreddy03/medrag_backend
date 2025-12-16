'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Brain, Plus, FileText, Calendar, User, Loader2, LogOut, Activity, TrendingUp, Clock, Search, Filter, BarChart3 } from 'lucide-react';

interface Diagnosis {
  id: number;
  patient_name?: string;
  patient_email?: string;
  age: number;
  gender: string;
  symptoms: string;
  diagnosis: string;
  confidence_score: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const extractDiagnosisTitle = (text: string) => {
    // Try to extract primary diagnosis from JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.primary_diagnosis || 'Diagnosis';
      }
    } catch (e) {}
    
    // Try to extract from markdown
    const primaryMatch = text.match(/(?:Primary Diagnosis|1\. Primary Diagnosis)[:\s]*([^\n*]+)/);
    if (primaryMatch) {
      return primaryMatch[1].replace(/\*\*/g, '').trim();
    }
    
    // Fallback to first line
    return text.split('\n')[0].substring(0, 50).replace(/[*#]/g, '').trim();
  };

  const filteredDiagnoses = diagnoses.filter(d => 
    d.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thisMonth = diagnoses.filter(d => 
    new Date(d.created_at).getMonth() === new Date().getMonth()
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MedRAG Dashboard</h1>
                <p className="text-sm text-white/60">AI-Powered Medical Diagnosis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/diagnosis/new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                New Diagnosis
              </button>
              <button
                onClick={async () => {
                  await api.logout();
                  router.push('/');
                }}
                className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="relative bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/90 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/60 font-semibold">TOTAL</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{diagnoses.length}</p>
              <p className="text-sm text-white/60">Total Cases</p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/90 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/60 font-semibold">MONTH</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">{thisMonth}</p>
              <p className="text-sm text-white/60">This Month</p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/90 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/60 font-semibold">AI</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">100%</p>
              <p className="text-sm text-white/60">AI Powered</p>
            </div>
          </div>

          <div className="relative group">
            <div className="relative bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/90 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white/60 font-semibold">FAISS</span>
              </div>
              <p className="text-4xl font-bold text-white mb-1">RAG</p>
              <p className="text-sm text-white/60">Technology</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search diagnoses..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-50 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Cases List */}
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Cases</h2>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300 text-sm flex items-center gap-2 transition">
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
            <div className="space-y-3">
              {filteredDiagnoses.map((diagnosis) => (
                <div
                  key={diagnosis.id}
                  onClick={() => router.push(`/diagnosis/${diagnosis.id}`)}
                  className="group relative bg-zinc-900/70 hover:bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 cursor-pointer transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {diagnosis.patient_name && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-semibold">
                            {diagnosis.patient_name}
                          </span>
                          {diagnosis.patient_email && (
                            <span className="text-xs text-white/60">{diagnosis.patient_email}</span>
                          )}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition">
                        {extractDiagnosisTitle(diagnosis.diagnosis)}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center gap-1 text-white/60">
                          <User className="w-4 h-4" />
                          {diagnosis.gender}, {diagnosis.age}y
                        </span>
                        <span className="flex items-center gap-1 text-white/60">
                          <Calendar className="w-4 h-4" />
                          {new Date(diagnosis.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-white/60">
                          <Clock className="w-4 h-4" />
                          {new Date(diagnosis.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-semibold">
                      {diagnosis.confidence_score}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">{diagnosis.symptoms}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
