'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Brain, User, Mail, Stethoscope, FileText, Loader2, ChevronRight, Check, AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewDiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const progress = (step / 3) * 100;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await api.createDiagnosis({
        patient_name: patientName,
        patient_email: patientEmail,
        age: parseInt(age),
        gender,
        symptoms,
        medical_history: medicalHistory,
      });

      if (result.id) {
        setSuccess(true);
        setTimeout(() => router.push(`/diagnosis/${result.id}`), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create diagnosis');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-zinc-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Analyzing Patient Data...</h2>
          <p className="text-zinc-400">Generating AI-powered diagnosis</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Diagnosis Complete!</h2>
          <p className="text-zinc-400">Report sent to {patientEmail}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">MedRAG</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-white">Step {step} of 3</span>
            <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <button
                key={s}
                onClick={() => s <= step && setStep(s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </button>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/70 backdrop-blur border border-zinc-800 rounded-xl p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Step 1: Patient Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Patient Information</h2>
                <p className="text-white/60">Enter patient details for diagnosis</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Patient Email *
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="patient@email.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Age *</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="25"
                      required
                      min="0"
                      max="150"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!patientName || !patientEmail || !age || !gender}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue to Symptoms
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Symptoms */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Clinical Manifestations</h2>
                <p className="text-white/60">Describe patient symptoms and history</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <Stethoscope className="inline w-4 h-4 mr-1" />
                    Symptoms *
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the patient's symptoms in detail..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Medical History (Optional)
                  </label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Previous conditions, medications, allergies..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!symptoms}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue to Review
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Review & Submit</h2>
                <p className="text-white/60">Verify all information before generating diagnosis</p>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Patient Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Name:</dt>
                      <dd className="font-medium text-white">{patientName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Email:</dt>
                      <dd className="font-medium text-white">{patientEmail}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Age:</dt>
                      <dd className="font-medium text-white">{age} years</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">Gender:</dt>
                      <dd className="font-medium text-white capitalize">{gender}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    📧 Diagnosis report will be automatically sent to <strong>{patientEmail}</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-lg font-semibold transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  Generate Diagnosis
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
