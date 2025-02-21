import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChannelAnalytics as ChannelAnalyticsType } from '../types';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  analytics: ChannelAnalyticsType | null;
  loading: boolean;
  onClose: () => void;
}

export const ChannelAnalytics: React.FC<Props> = ({ analytics, loading, onClose }) => {
  const { darkMode } = useStore();
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: darkMode ? '#fff' : '#000',
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#000',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#fff' : '#000',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#fff' : '#000',
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const viewsData: ChartData<'line'> | null = analytics ? {
    labels: analytics.recentVideos.map(video => 
      new Date(video.publishedAt).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Views per Video',
        data: analytics.recentVideos.map(video => video.viewCount).reverse(),
        borderColor: '#b026ff',
        backgroundColor: 'rgba(176, 38, 255, 0.5)',
        tension: 0.4,
      },
    ],
  } : null;

  const likesData: ChartData<'bar'> | null = analytics ? {
    labels: analytics.recentVideos.map(video => 
      video.title.substring(0, 20) + '...'
    ).reverse(),
    datasets: [
      {
        label: 'Likes per Video',
        data: analytics.recentVideos.map(video => video.likeCount).reverse(),
        backgroundColor: 'rgba(77, 77, 255, 0.7)',
      },
    ],
  } : null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`}>
      <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl ${
        darkMode 
          ? 'bg-gray-800/90 neon-card' 
          : 'bg-white shadow-2xl'
      } p-6`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <X size={24} />
        </button>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-16 w-16 border-4 ${
              darkMode ? 'neon-card border-purple-500' : 'border-purple-600'
            }`}></div>
          </div>
        ) : analytics ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <img
                src={analytics.thumbnail}
                alt={analytics.title}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white neon-text' : 'text-gray-900'}`}>
                  {analytics.title}
                </h2>
                <div className={`flex gap-6 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span>{formatNumber(analytics.subscriberCount)} subscribers</span>
                  <span>{formatNumber(analytics.videoCount)} videos</span>
                  <span>{formatNumber(analytics.viewCount)} total views</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Views Trend
                </h3>
                <div className="h-[400px]">
                  {viewsData && <Line options={chartOptions} data={viewsData} />}
                </div>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Likes by Video
                </h3>
                <div className="h-[400px]">
                  {likesData && <Bar options={chartOptions} data={likesData} />}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};