import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from './IconComponents';

interface WebhookSectionProps {
  webhookUrl: string;
  onUrlChange: (url: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const WebhookSection: React.FC<WebhookSectionProps> = ({ webhookUrl, onUrlChange, onSend, isLoading }) => {
  const [currentUrl, setCurrentUrl] = useState(webhookUrl);

  useEffect(() => {
    setCurrentUrl(webhookUrl);
  }, [webhookUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUrl(e.target.value);
  };
  
  const handleUrlBlur = () => {
    if (currentUrl !== webhookUrl) {
      onUrlChange(currentUrl);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
    >
      <div className="glass-container rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-indigo-900/20">
        <h3 className="text-lg font-bold text-white">Send to Webhook</h3>
        <p className="text-sm text-gray-400">
          Enter your n8n or other webhook URL below. The form data will be sent as a POST request.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="url"
              value={currentUrl}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              placeholder="Enter n8n Webhook URL"
              className="flex-grow w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
            <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(74, 222, 128, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onSend}
                disabled={isLoading}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <motion.div 
                    className="w-5 h-5 border-2 border-t-transparent border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-5 h-5"/> Send to Webhook
                </>
              )}
            </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WebhookSection;
