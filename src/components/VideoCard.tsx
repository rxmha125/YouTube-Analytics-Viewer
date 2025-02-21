import React from 'react';
import { Heart, Share2, BarChart2 } from 'lucide-react';
import { Video } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface VideoCardProps {
  video: Video;
  onViewAnalytics: (channelId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onViewAnalytics }) => {
  const { favorites, addToFavorites, removeFromFavorites, darkMode } = useStore();
  const isFavorite = favorites.some((v) => v.id === video.id);

  const handleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(video.id);
      toast.success('Removed from favorites');
    } else {
      addToFavorites(video);
      toast.success('Added to favorites');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://youtube.com/watch?v=${video.id}`);
    toast.success('Link copied to clipboard!');
  };

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) {
      return `${(n / 1000000).toFixed(1)}M`;
    }
    if (n >= 1000) {
      return `${(n / 1000).toFixed(1)}K`;
    }
    return num;
  };

  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-300 ${
      darkMode 
        ? 'neon-card bg-gray-800/90 border border-purple-500/30' 
        : 'light-card hover:shadow-xl'
    }`}>
      <div className="relative group">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-semibold mb-2 line-clamp-2 ${darkMode ? 'text-white neon-text' : 'text-gray-900'}`}>
          {video.title}
        </h3>
        <p className={`text-sm mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
          {video.channelTitle}
        </p>
        <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {video.description}
        </p>
        <div className="flex justify-between items-center">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>{formatNumber(video.viewCount)} views</span>
            <span className="mx-2">•</span>
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-all duration-300 ${
                isFavorite
                  ? 'bg-purple-600 text-white neon-card'
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
              } hover:bg-purple-500 hover:text-white`}
            >
              <Heart size={20} />
            </button>
            <button
              onClick={handleShare}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              } hover:bg-purple-500 hover:text-white`}
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => onViewAnalytics(video.channelId)}
              className={`p-2 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              } hover:bg-purple-500 hover:text-white`}
            >
              <BarChart2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};