-- Supabase Database Schema for JoyJam Music Platform
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  image_url TEXT,
  spotify_artist_id TEXT,
  social_links JSONB,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Releases table
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  artist_id UUID REFERENCES artists(id),
  artist_name TEXT NOT NULL,
  cover_url TEXT,
  release_date TIMESTAMPTZ,
  genres TEXT[],
  spotify_album_id TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  soundcloud_url TEXT,
  preview_url TEXT,
  type TEXT DEFAULT 'album',
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  venue TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  lat TEXT,
  lng TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  ticket_url TEXT,
  ticket_price TEXT,
  capacity INTEGER,
  rsvp_count INTEGER DEFAULT 0,
  artist_ids TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  category TEXT DEFAULT 'news',
  tags TEXT[],
  author_id UUID,
  author_name TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  published_at TIMESTAMPTZ,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Radio shows table
CREATE TABLE IF NOT EXISTS radio_shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  host_name TEXT NOT NULL,
  host_bio TEXT,
  host_image_url TEXT,
  cover_url TEXT,
  stream_url TEXT,
  recorded_url TEXT,
  day_of_week INTEGER,
  start_time TEXT,
  end_time TEXT,
  timezone TEXT DEFAULT 'UTC',
  is_live BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT,
  spotify_playlist_id TEXT,
  spotify_url TEXT,
  track_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  youtube_id TEXT,
  vimeo_id TEXT,
  artist_id UUID REFERENCES artists(id),
  artist_name TEXT,
  duration TEXT,
  category TEXT DEFAULT 'music-video',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  attachment_url TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Radio settings table
CREATE TABLE IF NOT EXISTS radio_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_name TEXT DEFAULT 'JoyJam Radio',
  stream_url TEXT,
  fallback_stream_url TEXT,
  current_track TEXT,
  current_artist TEXT,
  current_cover_url TEXT,
  current_show_name TEXT,
  current_host_name TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  listener_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  social_links JSONB,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE
);

-- Press assets table
CREATE TABLE IF NOT EXISTS press_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'logo',
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE radio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_assets ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public read access for artists" ON artists FOR SELECT USING (true);
CREATE POLICY "Public read access for releases" ON releases FOR SELECT USING (published = true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public read access for posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access for radio_shows" ON radio_shows FOR SELECT USING (published = true);
CREATE POLICY "Public read access for playlists" ON playlists FOR SELECT USING (published = true);
CREATE POLICY "Public read access for videos" ON videos FOR SELECT USING (published = true);
CREATE POLICY "Public read access for radio_settings" ON radio_settings FOR SELECT USING (true);
CREATE POLICY "Public read access for team_members" ON team_members FOR SELECT USING (published = true);
CREATE POLICY "Public read access for press_assets" ON press_assets FOR SELECT USING (published = true);

-- Allow public contact submissions
CREATE POLICY "Public can submit contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Insert initial radio settings
INSERT INTO radio_settings (station_name, stream_url, is_live, listener_count)
VALUES ('JoyJam Radio', 'https://stream.zeno.fm/yn65fsaurfhvv', true, 127)
ON CONFLICT DO NOTHING;
