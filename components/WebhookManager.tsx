import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lead, NotificationType } from '../types';
import { CheckCircleIcon, ClipboardDocumentIcon, GlobeAltIcon, PaperAirplaneIcon, XMarkIcon } from './IconComponents';

interface WebhookManagerProps {
  webhookUrl: string;
  onSetWebhook: (url: string) => void;
  onSend: () => void;
  leads: Lead[];
  addNotification: (message: string, type: NotificationType) => void;
}

const WebhookManager: React.FC<WebhookManagerProps> = ({ webhookUrl, onSetWebhook, onSend, leads, addNotification }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(webhookUrl);

  const handleSave = () => {
    try {
      new URL(tempUrl);
      onSetWebhook(tempUrl);
      setIsModalOpen(false);
    } catch (_) {
      addNotification('Please enter a valid URL.', 'error');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify({ leads }, null, 2))
      .then(() => {
        addNotification('JSON copied to clipboard!', 'success');
      })
      .catch(() => {
        addNotification('Failed to copy JSON.', 'error');
      });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-container rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="text-center sm:text-left">
            <h3 className="font-bold text-lg text-white">Export Your Leads</h3>
            <p className="text-sm text-gray-400">Send data to your favorite automation tool.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center">
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-semibold flex items-center gap-2 transition-all"
            >
                <GlobeAltIcon className="w-5 h-5"/> Set Webhook
            </motion.button>
             <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(200, 200, 200, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyJson}
                className="px-4 py-2 rounded-xl bg-gray-500/20 border border-gray-500 text-gray-300 font-semibold flex items-center gap-2 transition-all"
            >
                <ClipboardDocumentIcon className="w-5 h-5"/> Copy JSON
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(74, 222, 128, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onSend}
                className="px-4 py-2 rounded-xl bg-green-500/20 border border-green-500 text-green-300 font-semibold flex items-center gap-2 transition-all"
            >
                <PaperAirplaneIcon className="w-5 h-5"/> Send to Webhook
            </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-40"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="glass-container rounded-2xl p-8 w-full max-w-lg space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <XMarkIcon className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white">Set Webhook URL</h2>
              <p className="text-sm text-gray-400">Enter your n8n, Zapier, or custom webhook URL to send leads automatically.</p>
              <input
                type="url"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://your-webhook-url.com/..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
              <motion.button
                 whileHover={{ scale: 1.03 }}
                 whileTap={{ scale: 0.97 }}
                 onClick={handleSave}
                 className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WebhookManager;
