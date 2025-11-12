import React from 'react';
import { motion } from 'framer-motion';
import { Lead } from '../types';
// FIX: Removed unused icon imports for BuildingOfficeIcon and LinkIcon which were not exported from IconComponents.
import { AtSymbolIcon, ClockIcon, GlobeAltIcon, HashtagIcon, MapPinIcon, StarIcon } from './IconComponents';

interface LeadCardProps {
  lead: Lead;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string | number | null | undefined; isLink?: boolean; }> = ({ icon, label, isLink }) => {
    if (!label || label === 'N/A' || label === 0) return null;

    const content = isLink && typeof label === 'string' && label.startsWith('http') ? (
        <a href={label} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">{label.replace(/^(https?:\/\/)?(www\.)?/, '')}</a>
    ) : (
        <span className="text-gray-300">{label}</span>
    );
    
    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-500 mt-0.5">{icon}</div>
            {content}
        </div>
    );
};


const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  return (
    <motion.div
      variants={cardVariants}
      className="glass-container rounded-2xl p-6 space-y-4 relative overflow-hidden group"
    >
        <motion.div 
            className="absolute top-0 left-0 w-full h-full border-2 border-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
                maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)',
            }}
            initial={{ background: 'conic-gradient(from 0deg, transparent 0%, #a855f7 5%, transparent 15%)' }}
            animate={{ background: 'conic-gradient(from 360deg, transparent 0%, #a855f7 5%, transparent 15%)' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-100">{lead.name}</h3>
                {lead.rating > 0 && (
                    <div className="flex items-center bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-sm font-semibold">
                        <StarIcon className="w-4 h-4 mr-1"/>
                        {lead.rating.toFixed(1)}
                    </div>
                )}
            </div>
            
            <p className="text-purple-300 italic text-sm border-l-2 border-purple-400 pl-3">
                "{lead.best_thing}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                <InfoRow icon={<MapPinIcon />} label={lead.place} />
                <InfoRow icon={<AtSymbolIcon />} label={lead.contact} />
                <InfoRow icon={<GlobeAltIcon />} label={lead.website_link} isLink />
                <InfoRow icon={<ClockIcon />} label={lead.opening_time} />
                <InfoRow icon={<HashtagIcon />} label={lead.no} />
            </div>
        </div>
    </motion.div>
  );
};

export default LeadCard;