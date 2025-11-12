import React from 'react';
import { motion } from 'framer-motion';
import { Lead } from '../types';
import LeadCard from './LeadCard';

interface LeadGridProps {
  leads: Lead[] | null;
}

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const LeadGrid: React.FC<LeadGridProps> = ({ leads }) => {
  if (!leads || leads.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {leads.map((lead, index) => (
        <LeadCard key={lead.name + index} lead={lead} />
      ))}
    </motion.div>
  );
};

export default LeadGrid;
