import { supabase } from './supabase';

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  imageUrl?: string;
  spotifyArtistId?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
  };
  featured: boolean;
  createdAt: string;
}

export interface Release {
  id: string;
  title: string;
  slug: string;
  artistId?: string;
  artistName: string;
  coverUrl?: string;
  releaseDate?: string;
  genres?: string[];
  spotifyAlbumId?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  soundcloudUrl?: string;
  previewUrl?: string;
  type: string;
  featured: boolean;
  featuredUntil?: string;
  published: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  venue: string;
  address?: string;
  city: string;
  country: string;
  lat?: string;
  lng?: string;
  date: string;
  endDate?: string;
  imageUrl?: string;
  ticketUrl?: string;
  ticketPrice?: string;
  capacity?: number;
  rsvpCount: number;
  artistIds?: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverUrl?: string;
  category: string;
  tags?: string[];
  authorId?: string;
  authorName?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  publishedAt?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

export interface RadioShow {
  id: string;
  title: string;
  slug: string;
  description?: string;
  hostName: string;
  hostBio?: string;
  hostImageUrl?: string;
  coverUrl?: string;
  streamUrl?: string;
  recordedUrl?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  timezone: string;
  isLive: boolean;
  published: boolean;
  createdAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  spotifyPlaylistId?: string;
  spotifyUrl?: string;
  trackCount: number;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface Video {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  youtubeId?: string;
  vimeoId?: string;
  artistId?: string;
  artistName?: string;
  duration?: string;
  category: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  category: string;
  attachmentUrl?: string;
  status: string;
  createdAt: string;
}

export interface RadioSettings {
  id: string;
  stationName: string;
  streamUrl?: string;
  fallbackStreamUrl?: string;
  currentTrack?: string;
  currentArtist?: string;
  currentCoverUrl?: string;
  currentShowName?: string;
  currentHostName?: string;
  isLive: boolean;
  listenerCount: number;
  updatedAt: string;
}

function convertSnakeToCamel(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertSnakeToCamel);
  
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = convertSnakeToCamel(obj[key]);
    return acc;
  }, {} as any);
}

function convertCamelToSnake(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(convertCamelToSnake);
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = convertCamelToSnake(obj[key]);
    return acc;
  }, {} as any);
}

export const db = {
  artists: {
    async getAll(): Promise<Artist[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('artists').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getFeatured(): Promise<Artist[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('artists').select('*').eq('featured', true);
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Artist | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('artists').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async getBySlug(slug: string): Promise<Artist | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('artists').select('*').eq('slug', slug).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(artist: Partial<Artist>): Promise<Artist> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('artists').insert(convertCamelToSnake(artist)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, artist: Partial<Artist>): Promise<Artist> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('artists').update(convertCamelToSnake(artist)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('artists').delete().eq('id', id);
      if (error) throw error;
    }
  },

  releases: {
    async getAll(): Promise<Release[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('releases').select('*').order('release_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getPublished(): Promise<Release[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('releases').select('*').eq('published', true).order('release_date', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Release | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('releases').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(release: Partial<Release>): Promise<Release> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('releases').insert(convertCamelToSnake(release)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, release: Partial<Release>): Promise<Release> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('releases').update(convertCamelToSnake(release)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('releases').delete().eq('id', id);
      if (error) throw error;
    }
  },

  events: {
    async getAll(): Promise<Event[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getUpcoming(): Promise<Event[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('events').select('*').eq('published', true).gte('date', new Date().toISOString()).order('date', { ascending: true });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Event | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(event: Partial<Event>): Promise<Event> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('events').insert(convertCamelToSnake(event)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, event: Partial<Event>): Promise<Event> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('events').update(convertCamelToSnake(event)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    }
  },

  posts: {
    async getAll(): Promise<Post[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getPublished(): Promise<Post[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('posts').select('*').eq('published', true).order('published_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Post | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(post: Partial<Post>): Promise<Post> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('posts').insert(convertCamelToSnake(post)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, post: Partial<Post>): Promise<Post> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('posts').update(convertCamelToSnake(post)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    }
  },

  radioShows: {
    async getAll(): Promise<RadioShow[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('radio_shows').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<RadioShow | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('radio_shows').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(show: Partial<RadioShow>): Promise<RadioShow> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('radio_shows').insert(convertCamelToSnake(show)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, show: Partial<RadioShow>): Promise<RadioShow> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('radio_shows').update(convertCamelToSnake(show)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('radio_shows').delete().eq('id', id);
      if (error) throw error;
    }
  },

  playlists: {
    async getAll(): Promise<Playlist[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('playlists').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Playlist | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(playlist: Partial<Playlist>): Promise<Playlist> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('playlists').insert(convertCamelToSnake(playlist)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, playlist: Partial<Playlist>): Promise<Playlist> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('playlists').update(convertCamelToSnake(playlist)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('playlists').delete().eq('id', id);
      if (error) throw error;
    }
  },

  videos: {
    async getAll(): Promise<Video[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Video | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(video: Partial<Video>): Promise<Video> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('videos').insert(convertCamelToSnake(video)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, video: Partial<Video>): Promise<Video> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('videos').update(convertCamelToSnake(video)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    }
  },

  contacts: {
    async getAll(): Promise<Contact[]> {
      if (!supabase) return [];
      const { data, error } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(convertSnakeToCamel);
    },
    async getById(id: string): Promise<Contact | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async create(contact: Partial<Contact>): Promise<Contact> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('contacts').insert(convertCamelToSnake(contact)).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async update(id: string, contact: Partial<Contact>): Promise<Contact> {
      if (!supabase) throw new Error('Database not configured');
      const { data, error } = await supabase.from('contacts').update(convertCamelToSnake(contact)).eq('id', id).select().single();
      if (error) throw error;
      return convertSnakeToCamel(data);
    },
    async delete(id: string): Promise<void> {
      if (!supabase) throw new Error('Database not configured');
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
    }
  },

  radioSettings: {
    async get(): Promise<RadioSettings | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('radio_settings').select('*').limit(1).single();
      if (error) return null;
      return convertSnakeToCamel(data);
    },
    async update(settings: Partial<RadioSettings>): Promise<RadioSettings> {
      if (!supabase) throw new Error('Database not configured');
      const { data: existing } = await supabase.from('radio_settings').select('id').limit(1).single();
      if (existing) {
        const { data, error } = await supabase.from('radio_settings').update(convertCamelToSnake(settings)).eq('id', existing.id).select().single();
        if (error) throw error;
        return convertSnakeToCamel(data);
      } else {
        const { data, error } = await supabase.from('radio_settings').insert(convertCamelToSnake(settings)).select().single();
        if (error) throw error;
        return convertSnakeToCamel(data);
      }
    }
  }
};
