import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { VideoCard } from './components/VideoCard';
import { ThemeToggle } from './components/ThemeToggle';
import { ChannelAnalytics } from './components/ChannelAnalytics';
import { useStore } from './store/useStore';
import { Video, ChannelAnalytics as ChannelAnalyticsType } from './types';
import { Toaster } from 'react-hot-toast';
import { Youtube } from 'lucide-react';
import { searchVideos, getChannelAnalytics } from './services/youtube';
import toast from 'react-hot-toast';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const { darkMode, favorites } = useStore();
  const [showFavorites, setShowFavorites] = useState(false);
  const [channelAnalytics, setChannelAnalytics] = useState<ChannelAnalyticsType | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const results = await searchVideos(query);
      setVideos(results);
      setShowFavorites(false);
    } catch (error) {
      toast.error('Failed to fetch videos. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalytics = async (channelId: string) => {
    setLoadingAnalytics(true);
    try {
      const analytics = await getChannelAnalytics(channelId);
      setChannelAnalytics(analytics);
    } catch (error) {
      toast.error('Failed to fetch channel analytics. Please try again.');
      console.error(error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <div className={`flex items-center gap-3 mb-8 ${darkMode ? 'neon-text' : ''}`}>
            <Youtube className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} transition-colors duration-300`} size={40} />
            <div className="relative inline-block">
  <p
    onClick={() => (window.location.href = '/')}
    className={`text-4xl font-bold cursor-pointer transition-colors duration-300 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}
  >
    YouTube Viewer
  </p>
  <p
    className={`absolute top-0 right-0 text-xs font-medium transition-colors duration-300 ${
      darkMode ? 'text-white' : 'text-gray-900'
    }`}
  >
    By Rx
  </p>
</div>

          </div>
          <SearchBar onSearch={handleSearch} />
          <div className="mt-6">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                showFavorites
                  ? 'bg-purple-600 text-white neon-card'
                  : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 shadow-md'}`
              } hover:bg-purple-500 hover:text-white`}
            >
              {showFavorites ? 'Show Search Results' : 'Show Favorites'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-16 w-16 border-4 ${
              darkMode ? 'neon-card border-purple-500' : 'border-purple-600'
            }`}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showFavorites ? favorites : videos).map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onViewAnalytics={handleViewAnalytics}
              />
            ))}
          </div>
        )}
      </div>
      <ThemeToggle />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: darkMode ? {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.5rem',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          } : undefined
        }}
      />
      {(channelAnalytics || loadingAnalytics) && (
        <ChannelAnalytics 
          analytics={channelAnalytics}
          loading={loadingAnalytics}
          onClose={() => {
            setChannelAnalytics(null);
            setLoadingAnalytics(false);
          }}
        />
      )}
    </div>
  );
}

export default App;