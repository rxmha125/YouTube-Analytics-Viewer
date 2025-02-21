export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
}

export interface VideoSearchResponse {
  items: Video[];
  nextPageToken?: string;
}

export interface RecentVideo {
  title: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

export interface ChannelAnalytics {
  id: string;
  title: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  recentVideos: RecentVideo[];
}