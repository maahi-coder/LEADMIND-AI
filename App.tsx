import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sendFormDataToWebhook } from './services/webhookService';
import { Notification as NotificationData, FormData } from './types';

import SearchForm from './components/SearchForm';
import Notification from './components/Notification';
import { SparklesIcon } from './components/IconComponents';
import WebhookSection from './components/WebhookSection';

const initialFormData: FormData = {
  searchQuery: '',
  location: '',
  category: '',
  leadCount: 10,
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const savedUrl = localStorage.getItem('leadmind_webhookUrl');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const addNotification = useCallback((message: string, type: NotificationData['type']) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const handleGenerateLeads = useCallback((options: Omit<FormData, 'leadCount'> & { leadCount: number }) => {
    if (!options.searchQuery || !options.location) {
      addNotification('Please provide both a search query and a location.', 'warning');
      return;
    }
    setFormData(options);
    setIsGenerating(true);
    addNotification('Simulating lead generation...', 'info');

    setTimeout(() => {
      setIsGenerating(false);
      addNotification('Simulation complete. You can now send data to the webhook.', 'success');
    }, 2000);
  }, [addNotification]);
  
  const handleSetWebhook = (url: string) => {
    localStorage.setItem('leadmind_webhookUrl', url);
    setWebhookUrl(url);
    addNotification('Webhook URL saved successfully!', 'success');
  };

  const handleSendToWebhook = useCallback(async () => {
    if (!webhookUrl) {
      addNotification('Webhook URL is not set. Please set it first.', 'warning');
      return;
    }
    if (!formData.searchQuery) {
       addNotification('Please fill out the form and simulate generation first.', 'warning');
      return;
    }

    setIsSending(true);
    const result = await sendFormDataToWebhook(formData, webhookUrl);
    setIsSending(false);

    if (result.success) {
      addNotification('Form data sent to webhook successfully!', 'success');
    } else {
      addNotification(result.message, 'error');
    }
  }, [formData, webhookUrl, addNotification]);

  return (
    <div className="min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      
      <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
        <AnimatePresence>
          {notifications.map(n => (
            <Notification key={n.id} {...n} onClose={() => setNotifications(prev => prev.filter(item => item.id !== n.id))} />
          ))}
        </AnimatePresence>
      </div>
      
      <motion.header 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-10 w-full max-w-2xl"
      >
        <div className="flex justify-center items-center gap-4 mb-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/50">
            <SparklesIcon className="w-8 h-8 text-white"/>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">LeadMind AI</h1>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Think Smart — Find Fast.
        </p>
      </motion.header>

      <main className="w-full max-w-2xl space-y-8">
        <SearchForm onGenerate={handleGenerateLeads} isLoading={isGenerating} />
        <WebhookSection 
            webhookUrl={webhookUrl}
            onUrlChange={handleSetWebhook}
            onSend={handleSendToWebhook}
            isLoading={isSending}
        />
      </main>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Made with ⚡ by Mahi.</p>
      </footer>
    </div>
  );
}