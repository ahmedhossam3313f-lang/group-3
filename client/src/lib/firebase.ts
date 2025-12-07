import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, set, serverTimestamp, off, onDisconnect, increment } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(v => v !== '');

let app: ReturnType<typeof initializeApp> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { database, ref, push, onValue, set, serverTimestamp, off, onDisconnect, increment };

export interface ChatMessage {
  id?: string;
  username: string;
  message: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface RadioMetadata {
  title: string;
  artist: string;
  coverUrl?: string;
  showName?: string;
  hostName?: string;
  isLive: boolean;
  listenerCount: number;
  updatedAt: number;
}

export function subscribeToChat(callback: (messages: ChatMessage[]) => void): () => void {
  if (!database) {
    callback([{
      id: 'welcome',
      username: 'System',
      message: 'Welcome to JoyJam Radio! Chat will be available once Firebase is configured.',
      timestamp: Date.now(),
      isSystem: true
    }]);
    return () => {};
  }

  const chatRef = ref(database, 'radio/chat');
  const unsubscribe = onValue(chatRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const messages = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: key,
        ...value
      }));
      messages.sort((a, b) => a.timestamp - b.timestamp);
      const recentMessages = messages.slice(-100);
      callback(recentMessages);
    } else {
      callback([{
        id: 'welcome',
        username: 'System',
        message: 'Welcome to JoyJam Radio chat!',
        timestamp: Date.now(),
        isSystem: true
      }]);
    }
  });

  return () => off(chatRef);
}

export async function sendChatMessage(username: string, message: string): Promise<void> {
  if (!database) {
    console.warn('Firebase not configured, message not sent');
    return;
  }

  const chatRef = ref(database, 'radio/chat');
  await push(chatRef, {
    username,
    message,
    timestamp: Date.now(),
    isSystem: false
  });
}

export function subscribeToRadioMetadata(callback: (metadata: RadioMetadata) => void): () => void {
  if (!database) {
    callback({
      title: 'JoyJam Radio',
      artist: 'Live Stream',
      isLive: true,
      listenerCount: 127,
      updatedAt: Date.now()
    });
    return () => {};
  }

  const metadataRef = ref(database, 'radio/metadata');
  const unsubscribe = onValue(metadataRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      callback({
        title: 'JoyJam Radio',
        artist: 'Live Stream',
        isLive: true,
        listenerCount: 127,
        updatedAt: Date.now()
      });
    }
  });

  return () => off(metadataRef);
}

export async function updateRadioMetadata(metadata: Partial<RadioMetadata>): Promise<void> {
  if (!database) {
    console.warn('Firebase not configured');
    return;
  }

  const metadataRef = ref(database, 'radio/metadata');
  await set(metadataRef, {
    ...metadata,
    updatedAt: Date.now()
  });
}

export function trackListener(): () => void {
  if (!database) return () => {};

  const listenersRef = ref(database, 'radio/listeners');
  const myListenerRef = push(listenersRef);
  
  set(myListenerRef, {
    joinedAt: Date.now(),
    active: true
  });

  onDisconnect(myListenerRef).remove();

  return () => {
    set(myListenerRef, null);
  };
}

export function subscribeToListenerCount(callback: (count: number) => void): () => void {
  if (!database) {
    callback(127);
    return () => {};
  }

  const listenersRef = ref(database, 'radio/listeners');
  const unsubscribe = onValue(listenersRef, (snapshot) => {
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    callback(Math.max(count, 1));
  });

  return () => off(listenersRef);
}

export const isFirebaseReady = () => !!database;
