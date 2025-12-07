import { QueryClient } from "@tanstack/react-query";
import { db } from "./database";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});

export const queryFunctions = {
  releases: () => db.releases.getAll(),
  releasesPublished: () => db.releases.getPublished(),
  artists: () => db.artists.getAll(),
  artistsFeatured: () => db.artists.getFeatured(),
  events: () => db.events.getAll(),
  eventsUpcoming: () => db.events.getUpcoming(),
  posts: () => db.posts.getAll(),
  postsPublished: () => db.posts.getPublished(),
  radioShows: () => db.radioShows.getAll(),
  playlists: () => db.playlists.getAll(),
  videos: () => db.videos.getAll(),
  contacts: () => db.contacts.getAll(),
  radioSettings: () => db.radioSettings.get(),
};
