import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Brain, Shield, Zap } from 'lucide-react';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface LandingLoginProps {
  onLogin: (email: string) => void;
}

const LandingLogin: React.FC<LandingLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-white overflow-auto">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {!showLogin ? (
          // Landing Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Brain className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to MedRAG
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Professional Medical AI
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/30">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-white">AI Diagnosis</h3>
                    <p className="text-white text-sm">Advanced AI-powered medical analysis</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/30">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Secure</h3>
                    <p className="text-white text-sm">HIPAA compliant and secure</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-slate-900/50 border-slate-700/30">
                  <CardContent className="p-6 text-center">
                    <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-white">Fast</h3>
                    <p className="text-white text-sm">Instant medical insights</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <RainbowButton
                onClick={() => setShowLogin(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </RainbowButton>
            </motion.div>
          </motion.div>
        ) : (
          // Login Section
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="bg-slate-900/90 border-slate-700/30">
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <CardTitle className="text-2xl text-white">Welcome to MedRAG</CardTitle>
                <p className="text-gray-400">Enter your email to continue</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-800/50 border-slate-600/30 text-white"
                      required
                    />
                  </div>
                  <RainbowButton
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </RainbowButton>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ← Back to landing
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingLogin;