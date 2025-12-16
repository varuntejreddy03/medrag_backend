'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Brain, ArrowLeft, User, Calendar, Stethoscope, FileText, Loader2, MessageCircle, Activity, TrendingUp } from 'lucide-react';
import { ChatWithDiagnosis } from '@/components/chat-with-diagnosis';

interface Diagnosis {
  id: number;
  age: number;
  gender: string;
  symptoms: string;
  medical_history: string;
  diagnosis: string;
  confidence_score: string;
  created_at: string;
}

export default function DiagnosisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadDiagnosis(parseInt(params.id as string));
    }
  }, [params.id]);

  const loadDiagnosis = async (id: number) => {
    try {
      const data = await api.getDiagnosis(id);
      setDiagnosis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const parseDiagnosis = (text: string) => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {}
    return null;
  };

  const cleanMarkdown = (text: string) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Error</h2>
          <p className="text-zinc-400 mb-6">{error || 'Diagnosis not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const parsedDiagnosis = parseDiagnosis(diagnosis.diagnosis);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MedRAG</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowChat(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with AI
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Patient Info</h3>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium">
                  {diagnosis.confidence_score}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Demographics</p>
                    <p className="font-semibold text-white">
                      {diagnosis.gender}, {diagnosis.age}y
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Date</p>
                    <p className="font-semibold text-white">
                      {new Date(diagnosis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg">
                  <Activity className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-zinc-500">AI Model</p>
                    <p className="font-semibold text-white">Gemini + FAISS</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symptoms */}
            <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <Stethoscope className="w-5 h-5 text-blue-400" />
                Symptoms
              </h3>
              <p className="text-zinc-300 leading-relaxed">{diagnosis.symptoms}</p>
            </div>

            {diagnosis.medical_history && (
              <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Medical History
                </h3>
                <p className="text-zinc-300 leading-relaxed">{diagnosis.medical_history}</p>
              </div>
            )}

            {/* Diagnosis */}
            <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white">AI Diagnosis</h3>
                <span className="ml-auto px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-300 rounded-full text-xs font-medium">
                  🔍 FAISS Retrieved • 🤖 Gemini Generated
                </span>
              </div>

              {parsedDiagnosis ? (
                <div className="space-y-4">
                  <div className="bg-zinc-950 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">Primary Diagnosis</h4>
                    <p className="text-white font-semibold text-lg">{cleanMarkdown(parsedDiagnosis.primary_diagnosis)}</p>
                  </div>

                  {parsedDiagnosis.differential_diagnoses && (
                    <div className="bg-zinc-950 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-purple-300 mb-2">Differential Diagnoses</h4>
                      <ul className="space-y-1">
                        {parsedDiagnosis.differential_diagnoses.map((d: string, i: number) => (
                          <li key={i} className="text-zinc-300 text-sm">• {cleanMarkdown(d)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsedDiagnosis.recommended_tests && (
                    <div className="bg-zinc-950 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-green-300 mb-2">Recommended Tests</h4>
                      <ul className="space-y-1">
                        {parsedDiagnosis.recommended_tests.map((t: string, i: number) => (
                          <li key={i} className="text-zinc-300 text-sm">• {cleanMarkdown(t)}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-zinc-950 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-yellow-300 mb-2">Confidence Level</h4>
                    <p className="text-white font-semibold">{cleanMarkdown(parsedDiagnosis.confidence)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950 rounded-lg p-4">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-zinc-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanMarkdown(diagnosis.diagnosis).replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showChat && (
        <ChatWithDiagnosis 
          diagnosisId={diagnosis.id} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
}
