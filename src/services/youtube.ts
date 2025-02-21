import axios from 'axios';
import { Video, VideoSearchResponse, ChannelAnalytics } from '../types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function searchVideos(query: string): Promise<Video[]> {
  try {
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 9,
        q: query,
        type: 'video',
        key: API_KEY,
      },
    });

    const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId).join(',');

    const statsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    return searchResponse.data.items.map((item: any, index: number) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      viewCount: statsResponse.data.items[index].statistics.viewCount,
      likeCount: statsResponse.data.items[index].statistics.likeCount || '0',
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error('Failed to fetch videos');
  }
}

export async function getChannelAnalytics(channelId: string): Promise<ChannelAnalytics> {
  try {
    const [channelResponse, videosResponse] = await Promise.all([
      axios.get(`${BASE_URL}/channels`, {
        params: {
          part: 'statistics,snippet',
          id: channelId,
          key: API_KEY,
        },
      }),
      axios.get(`${BASE_URL}/search`, {
        params: {
          part: 'snippet',
          channelId,
          maxResults: 10,
          order: 'date',
          type: 'video',
          key: API_KEY,
        },
      }),
    ]);

    const channel = channelResponse.data.items[0];
    const videoIds = videosResponse.data.items.map((item: any) => item.id.videoId).join(',');
    
    const videoStatsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'statistics',
        id: videoIds,
        key: API_KEY,
      },
    });

    // Ensure all data is properly serializable
    const recentVideos = videoStatsResponse.data.items.map((item: any, index: number) => ({
      title: String(videosResponse.data.items[index].snippet.title),
      viewCount: Number(item.statistics.viewCount) || 0,
      likeCount: Number(item.statistics.likeCount) || 0,
      publishedAt: String(videosResponse.data.items[index].snippet.publishedAt),
    }));

    return {
      id: String(channelId),
      title: String(channel.snippet.title),
      thumbnail: String(channel.snippet.thumbnails.default.url),
      subscriberCount: Number(channel.statistics.subscriberCount) || 0,
      videoCount: Number(channel.statistics.videoCount) || 0,
      viewCount: Number(channel.statistics.viewCount) || 0,
      recentVideos: recentVideos,
    };
  } catch (error) {
    console.error('Error fetching channel analytics:', error);
    throw new Error('Failed to fetch channel analytics');
  }
}