import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Notification as NotificationData } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from './IconComponents';

interface NotificationProps extends NotificationData {
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
  error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />,
  info: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
};

const colors = {
    success: 'border-green-500/50',
    error: 'border-red-500/50',
    warning: 'border-yellow-500/50',
    info: 'border-blue-500/50',
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-container rounded-lg p-4 mb-4 flex items-start gap-3 shadow-lg border ${colors[type]}`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm text-gray-200 font-medium">{message}</p>
    </motion.div>
  );
};

export default Notification;
