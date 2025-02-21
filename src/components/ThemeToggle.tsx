import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';

export const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-800 text-purple-400 neon-card' 
          : 'bg-white text-purple-600 shadow-lg'
      } hover:bg-purple-500 hover:text-white`}
    >
      {darkMode ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};