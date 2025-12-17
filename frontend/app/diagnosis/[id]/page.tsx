'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Brain, ArrowLeft, User, Calendar, Stethoscope, FileText, Loader2, MessageCircle, Activity, TrendingUp, AlertCircle, Zap, Shield } from 'lucide-react';
import { ChatWithDiagnosis } from '@/components/chat-with-diagnosis';

interface Diagnosis {
  id: number;
  session_id: string;
  symptoms: string;
  diagnosis_result: any;
  status: string;
  created_at: string;
}

export default function DiagnosisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated background effect - must be at top level
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
      v: Math.random() * 0.1 + 0.02,
      o: Math.random() * 0.15 + 0.05,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.1 + 0.02;
          p.o = Math.random() * 0.15 + 0.05;
        }
        ctx.fillStyle = `rgba(59,130,246,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.4, 1.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { setSize(); init(); };
    window.addEventListener('resize', onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (params.id) {
      loadDiagnosis(parseInt(params.id as string));
    }
  }, [params.id]);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    
    if (diagnosis?.status === 'processing') {
      pollInterval = setInterval(async () => {
        try {
          const statusData = await api.getDiagnosisStatus(params.id as string);
          setStatusMessage(statusData.message || '');
          setProgress(statusData.progress || 0);
          
          if (statusData.status === 'completed' || statusData.status === 'failed') {
            loadDiagnosis(parseInt(params.id as string));
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Status polling error:', error);
        }
      }, 2000); // Poll every 2 seconds
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [diagnosis?.status, params.id]);

  const loadDiagnosis = async (id: number) => {
    try {
      const data = await api.getDiagnosis(id.toString());
      setDiagnosis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const parseDiagnosis = (result: any) => {
    if (!result) return null;
    if (typeof result === 'object') return result;
    if (typeof result === 'string') {
      try {
        return JSON.parse(result);
      } catch (e) {}
    }
    return null;
  };

  const cleanMarkdown = (text: any) => {
    if (!text) return '';
    const str = typeof text === 'string' ? text : String(text);
    return str
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/###/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Loading Clinical Report</h2>
            <p className="text-zinc-400 text-lg">Analyzing medical data...</p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
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

  const parsedDiagnosis = parseDiagnosis(diagnosis.diagnosis_result);



  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <style>{`
        .report-animate { opacity: 0; transform: translateY(20px); animation: slideUp .6s ease .3s forwards; }
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-20 mix-blend-screen pointer-events-none" />
      
      <header className="relative border-b border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Clinical Assessment Report</h1>
              <p className="text-base text-zinc-300 font-medium">AI-Assisted Clinical Decision Support System</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowChat(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Clinical Consultation
            </button>
            <button
              onClick={() => router.push('/diagnosis/new')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <Zap className="w-4 h-4" />
              New Demo
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-300 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur"
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
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 report-animate">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Clinical Case Details</h3>
                <span className={`px-3 py-1 rounded-xl text-sm font-medium ${
                  diagnosis.status === 'completed' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' :
                  diagnosis.status === 'processing' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' :
                  'bg-red-500/20 border border-red-500/30 text-red-300'
                }`}>
                  {diagnosis.status === 'completed' ? '✓ Complete' : 
                   diagnosis.status === 'processing' ? '⏳ Processing' : '✗ Failed'}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-950 rounded-lg">
                  <User className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Session ID</p>
                    <p className="font-semibold text-white text-xs">
                      {diagnosis.session_id.substring(0, 8)}...
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
                    <p className="text-xs text-zinc-500">Decision Support</p>
                    <p className="font-semibold text-white">AI Clinical Assistant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symptoms */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 report-animate">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-white mb-4">
                <Stethoscope className="w-6 h-6 text-blue-400" />
                Clinical Presentation
              </h3>
              <p className="text-zinc-300 leading-relaxed text-lg">{diagnosis.symptoms}</p>
            </div>



            {/* Diagnosis */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 report-animate">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-300" />
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Clinical Decision Support Report</h3>
                <span className="ml-auto px-6 py-3 bg-gradient-to-r from-emerald-500/30 to-blue-500/30 border-2 border-emerald-400/50 text-emerald-200 rounded-xl text-base font-bold shadow-lg">
                  🔬 AI Medical Analysis
                </span>
              </div>

              {parsedDiagnosis ? (
                <div className="space-y-6">
                  {/* Primary Diagnosis */}
                  <div className="bg-zinc-950 rounded-lg p-6 border-l-4 border-blue-500">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Primary Diagnosis
                    </h4>
                    <p className="text-white font-semibold text-xl mb-2">{cleanMarkdown(parsedDiagnosis.primary_diagnosis)}</p>
                    {parsedDiagnosis.confidence_score && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-zinc-400">Confidence:</span>
                        <div className="flex-1 bg-zinc-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{width: `${(parsedDiagnosis.confidence_score * 100)}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-white">{Math.round(parsedDiagnosis.confidence_score * 100)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Clinical Summary */}
                  {parsedDiagnosis.clinical_summary && (
                    <div className="bg-zinc-950 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-3">Clinical Summary</h4>
                      <p className="text-zinc-300 leading-relaxed">{cleanMarkdown(parsedDiagnosis.clinical_summary)}</p>
                    </div>
                  )}

                  {/* Differential Diagnoses */}
                  {parsedDiagnosis.differential_diagnoses && parsedDiagnosis.differential_diagnoses.length > 0 && (
                    <div className="bg-zinc-950 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-purple-300 mb-4">Differential Diagnoses</h4>
                      <div className="space-y-3">
                        {parsedDiagnosis.differential_diagnoses.map((d: any, i: number) => (
                          <div key={i} className="border border-zinc-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-white">{cleanMarkdown(d.condition || d)}</h5>
                              {d.probability && (
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                  {Math.round(d.probability * 100)}%
                                </span>
                              )}
                            </div>
                            {d.rationale && (
                              <p className="text-sm text-zinc-400">{cleanMarkdown(d.rationale)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment Plan */}
                  {parsedDiagnosis.treatment_plan && parsedDiagnosis.treatment_plan.length > 0 && (
                    <div className="bg-zinc-950 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-green-300 mb-4">Treatment Plan</h4>
                      <div className="space-y-3">
                        {parsedDiagnosis.treatment_plan.map((t: any, i: number) => (
                          <div key={i} className="border border-zinc-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-white">{cleanMarkdown(t.intervention || t)}</h5>
                              {t.urgency && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  t.urgency === 'immediate' ? 'bg-red-500/20 text-red-300' :
                                  t.urgency === 'routine' ? 'bg-green-500/20 text-green-300' :
                                  'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {t.urgency}
                                </span>
                              )}
                            </div>
                            {t.type && (
                              <span className="text-xs text-zinc-500 capitalize">{t.type}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tests */}
                  {parsedDiagnosis.recommended_tests && parsedDiagnosis.recommended_tests.length > 0 && (
                    <div className="bg-zinc-950 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-cyan-300 mb-4">Recommended Tests</h4>
                      <div className="space-y-3">
                        {parsedDiagnosis.recommended_tests.map((t: any, i: number) => (
                          <div key={i} className="border border-zinc-800 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-white">{cleanMarkdown(t.test || t)}</h5>
                              {t.priority && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  t.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                  t.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                  'bg-green-500/20 text-green-300'
                                }`}>
                                  {t.priority} priority
                                </span>
                              )}
                            </div>
                            {t.rationale && (
                              <p className="text-sm text-zinc-400">{cleanMarkdown(t.rationale)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Red Flags & Follow-up */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsedDiagnosis.red_flags && parsedDiagnosis.red_flags.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-red-300 mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Warning Signs
                        </h4>
                        <ul className="space-y-1">
                          {parsedDiagnosis.red_flags.map((flag: string, i: number) => (
                            <li key={i} className="text-red-200 text-sm">• {cleanMarkdown(flag)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {parsedDiagnosis.follow_up && (
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-300 mb-3">Follow-up Plan</h4>
                        <p className="text-blue-200 text-sm">{cleanMarkdown(parsedDiagnosis.follow_up)}</p>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  {(parsedDiagnosis.prognosis || parsedDiagnosis.patient_education) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {parsedDiagnosis.prognosis && (
                        <div className="bg-zinc-950 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-yellow-300 mb-2">Prognosis</h4>
                          <p className="text-zinc-300 text-sm">{cleanMarkdown(parsedDiagnosis.prognosis)}</p>
                        </div>
                      )}
                      
                      {parsedDiagnosis.patient_education && (
                        <div className="bg-zinc-950 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-green-300 mb-2">Patient Education</h4>
                          <p className="text-zinc-300 text-sm">{cleanMarkdown(parsedDiagnosis.patient_education)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Medical Reasoning */}
                  {parsedDiagnosis.reasoning && (
                    <div className="bg-zinc-950 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-zinc-300 mb-3">Medical Reasoning</h4>
                      <p className="text-zinc-400 leading-relaxed text-sm">{cleanMarkdown(parsedDiagnosis.reasoning)}</p>
                    </div>
                  )}
                </div>
              ) : diagnosis.status === 'processing' ? (
                <div className="bg-zinc-950 rounded-lg p-8 text-center border border-zinc-800">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <div className="w-14 h-14 bg-zinc-950 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                    <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">AI Clinical Analysis in Progress</h4>
                  <p className="text-zinc-300 mb-6 text-lg">{statusMessage || 'Processing clinical data and generating diagnosis...'}</p>
                  <div className="w-full bg-zinc-800 rounded-full h-3 mb-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-500 animate-pulse" style={{width: `${progress || 50}%`}}></div>
                  </div>
                  <div className="flex justify-center space-x-1 mb-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <p className="text-sm text-zinc-500">Clinical analysis typically takes 30-60 seconds</p>
                </div>
              ) : diagnosis.status === 'failed' ? (
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-300 mb-3">Using Demo Clinical Analysis</h4>
                    <p className="text-zinc-300 mb-4">AI service temporarily unavailable. Displaying professional demo case for demonstration purposes.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      Retry Analysis
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-bold text-blue-300 mb-3">Demo Clinical Analysis</h4>
                    <p className="text-zinc-300">Professional medical analysis will appear here. System ready for demonstration.</p>
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
