import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, TagIcon, BoltIcon } from './IconComponents';

interface SearchFormProps {
  onGenerate: (options: {
    searchQuery: string;
    location: string;
    category: string;
    leadCount: number;
  }) => void;
  isLoading: boolean;
}

const leadCountOptions = [10, 50, 100];

const SearchForm: React.FC<SearchFormProps> = ({ onGenerate, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [leadCount, setLeadCount] = useState(10);
  const [unlimited, setUnlimited] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = unlimited ? 200 : leadCount; // Capping "unlimited" for safety
    onGenerate({ searchQuery, location, category, leadCount: count });
  };

  const handleCountChange = (count: number) => {
    setLeadCount(count);
    setUnlimited(false);
  };

  const handleUnlimitedClick = () => {
    setUnlimited(true);
    setLeadCount(100); // Set a base value even if unlimited is chosen
  }

  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
    >
      <form onSubmit={handleSubmit} className="glass-container rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl shadow-indigo-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Fields */}
          <div className="relative">
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="floating-label-input block w-full px-3 py-3 text-white bg-transparent border-0 border-b-2 border-gray-600 focus:outline-none focus:ring-0 focus:border-purple-500 transition placeholder-transparent"
              placeholder=" "
            />
            <label htmlFor="searchQuery" className="absolute left-3 top-3 text-gray-400 transition-all duration-300">Search Query (e.g., "vegan restaurants")</label>
            <MagnifyingGlassIcon className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
          </div>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="floating-label-input block w-full px-3 py-3 text-white bg-transparent border-0 border-b-2 border-gray-600 focus:outline-none focus:ring-0 focus:border-purple-500 transition placeholder-transparent"
              placeholder=" "
            />
            <label htmlFor="location" className="absolute left-3 top-3 text-gray-400 transition-all duration-300">Place / City</label>
             <MapPinIcon className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
          </div>
          <div className="relative md:col-span-2">
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="floating-label-input block w-full px-3 py-3 text-white bg-transparent border-0 border-b-2 border-gray-600 focus:outline-none focus:ring-0 focus:border-purple-500 transition placeholder-transparent"
              placeholder=" "
            />
            <label htmlFor="category" className="absolute left-3 top-3 text-gray-400 transition-all duration-300">Category (Optional)</label>
            <TagIcon className="absolute right-3 top-3 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Lead Count Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Number of Leads</label>
          <div className="flex items-center gap-2 flex-wrap">
            {leadCountOptions.map(count => (
              <button
                key={count}
                type="button"
                onClick={() => handleCountChange(count)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${!unlimited && leadCount === count ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
              >
                {count}
              </button>
            ))}
            <button
                type="button"
                onClick={handleUnlimitedClick}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${unlimited ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
              >
                Unlimited
              </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(126, 43, 224, 0.6)' }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? (
            <>
              <motion.div 
                className="w-5 h-5 border-2 border-t-transparent border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Generating...
            </>
          ) : (
            <>
              <BoltIcon className="w-5 h-5"/> Generate Leads
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SearchForm;
