import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const { darkMode } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className={`w-full px-6 py-4 rounded-lg text-lg transition-all duration-300 focus:outline-none ${
            darkMode 
              ? 'bg-gray-800/80 border border-purple-500/30 text-white placeholder-gray-400 focus:neon-card' 
              : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:shadow-lg'
          }`}
        />
        <button
          type="submit"
          className={`absolute right-4 top-1/2 -translate-y-1/2 ${
            darkMode ? 'text-purple-400' : 'text-purple-600'
          } hover:text-purple-500 transition-colors duration-300`}
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};