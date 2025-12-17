'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Key, Save } from 'lucide-react';

const ADMIN_EMAIL = 'demo@example.com'; // Only this user can access

export function AdminSettings() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [perplexityKey, setPerplexityKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await api.getCurrentUser();
      if (user.username === ADMIN_EMAIL) {
        setIsAdmin(true);
        loadApiKeyStatus();
      }
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const loadApiKeyStatus = async () => {
    try {
      const status = await api.getApiKeyStatus();
      // Don't show actual keys for security
      setMessage('API keys loaded');
    } catch (error) {
      console.error('Failed to load API key status');
    }
  };

  const updateApiKey = async (provider: string, key: string) => {
    if (!key.trim()) return;
    
    setLoading(true);
    try {
      await api.updateApiKey(provider, key);
      setMessage(`${provider} API key updated successfully`);
      if (provider === 'gemini') setGeminiKey('');
      if (provider === 'perplexity') setPerplexityKey('');
    } catch (error) {
      setMessage(`Failed to update ${provider} API key`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Hide component for non-admin users
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5" />
          Admin Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className="p-3 rounded-lg text-sm bg-blue-500/10 text-blue-400">
            {message}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="gemini-key" className="text-zinc-300">
            Gemini API Key
          </Label>
          <div className="flex gap-2">
            <Input
              id="gemini-key"
              type="password"
              placeholder="Enter new Gemini API key"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-zinc-50"
            />
            <Button
              onClick={() => updateApiKey('gemini', geminiKey)}
              disabled={loading || !geminiKey.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="perplexity-key" className="text-zinc-300">
            Perplexity API Key
          </Label>
          <div className="flex gap-2">
            <Input
              id="perplexity-key"
              type="password"
              placeholder="Enter new Perplexity API key"
              value={perplexityKey}
              onChange={(e) => setPerplexityKey(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-zinc-50"
            />
            <Button
              onClick={() => updateApiKey('perplexity', perplexityKey)}
              disabled={loading || !perplexityKey.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-zinc-500 mt-4">
          <Key className="w-3 h-3 inline mr-1" />
          Only admin users can modify API keys
        </div>
      </CardContent>
    </Card>
  );
}