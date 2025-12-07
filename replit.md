# GroupTherapy Records - Record Label Website

## Overview

GroupTherapy Records is a comprehensive electronic music record label website featuring a public-facing platform for music discovery and fan engagement, combined with an admin dashboard for content management. The application showcases releases, artists, events, radio streams, videos, and news content with rich multimedia integration and real-time features.

The platform is built as a single-page application (SPA) using React with TypeScript for the frontend and a serverless backend architecture optimized for Vercel deployment. It supports both development and production environments with different build configurations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18 with TypeScript** powers the user interface
- **Vite** provides fast development builds and optimized production bundles
- **Wouter** handles client-side routing with separate route hierarchies for public and admin sections
- **Shadcn/UI components** built on Radix UI primitives provide the component library with "new-york" styling
- **Tailwind CSS** handles styling with custom design tokens, dark mode support via CSS variables, and custom font stack (Space Grotesk for headlines, Geist for body text)

### State Management Strategy
- **TanStack Query (React Query)** manages server state and API data fetching with aggressive caching (5-minute stale time)
- **React Context** handles global state for radio player and theme management
- **Local component state** via React hooks for UI-specific state
- Query invalidation patterns ensure data consistency after mutations

### Backend Architecture
- **Serverless functions** via Vercel's edge network handle all API requests
- **Express.js** application factory pattern allows code reuse between local development and serverless deployment
- **RESTful API** design with all routes prefixed under `/api`
- **Static file serving** for the compiled Vite build with SPA fallback routing
- **Development mode** integrates Vite dev server as Express middleware for hot module replacement

### Authentication & Security
- **JWT-based authentication** with token signing and verification
- **Bcrypt password hashing** for secure credential storage
- **Rate limiting** on login attempts (5 attempts per 15-minute window) with automatic lockout
- **Session tracking** via database-stored login attempts
- **Optional Clerk integration** for enhanced authentication (configured via environment variables)
- **CORS configuration** with environment-based origin restrictions
- **Security headers** (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection) configured in Vercel deployment

### Database Layer
- **PostgreSQL** as the primary database (designed for Supabase, Neon, or similar providers)
- **Drizzle ORM** provides type-safe database access with schema-first design
- **Abstract storage interface** (`IStorage`) allows swapping between in-memory and database implementations
- **Database schema** includes tables for users, admin users, login attempts, artists, releases, events, posts, contacts, playlists, radio shows, videos, and team members
- **Migration system** via Drizzle Kit for schema versioning

### Media Management
- **Cloudinary integration** for image, audio, and video uploads (optional, falls back gracefully)
- **Firebase Realtime Database** for radio chat and live metadata (optional feature)
- **Upload components** with preview, validation, and progress tracking
- **Responsive image optimization** with multiple aspect ratios supported

### Real-Time Features
- **Radio streaming** integration with Zeno.FM
- **Live chat** via Firebase Realtime Database with real-time message syncing
- **Listener count tracking** with Firebase presence system
- **Radio metadata updates** for current track and show information

### Design System
- **Typography scale**: Space Grotesk (700/600 for headlines), Geist (400/500/300 for body)
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Spacing primitives**: Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- **Animation library**: Framer Motion for page transitions, carousels, and interactive elements
- **Color system**: CSS variables enabling theme switching with separate light/dark palettes
- **Component variants**: Shadcn/UI with custom border radius and color configurations

### Performance Optimizations
- **Code splitting** via Vite's automatic chunking
- **Lazy loading** for images and route components
- **Server dependency bundling** reduces cold start times by minimizing syscalls
- **Aggressive query caching** with TanStack Query reduces API calls
- **Web Vitals monitoring** for LCP, FID, and CLS metrics
- **Preconnect hints** for external resources (Google Fonts, Cloudinary)

### SEO & Metadata
- **Dynamic meta tags** via SEOHead component for page-specific optimization
- **Structured data** (JSON-LD) for enhanced search engine understanding
- **Sitemap generation** via serverless function with dynamic content
- **Robots.txt** configuration blocking admin routes
- **Open Graph and Twitter Card** support for social sharing
- **Canonical URLs** to prevent duplicate content issues

### Deployment Architecture
- **Vercel serverless functions** handle all backend logic
- **Static asset serving** from `dist/public` directory
- **Rewrite rules** route API requests to serverless function, SPA fallback to index.html
- **Environment-based configuration** separates development and production settings
- **Build optimization** with separate client (Vite) and server (esbuild) builds
- **Cold start optimization** via dependency bundling for frequently-used packages

## External Dependencies

### Core Services
- **Vercel**: Hosting platform for serverless deployment
- **PostgreSQL Database**: Supabase, Neon, or Railway recommended for managed PostgreSQL
- **Cloudinary** (optional): Media hosting for images, audio, and video uploads
- **Firebase** (optional): Realtime Database for radio chat and listener tracking
- **Clerk** (optional): Authentication provider for enhanced user management

### API Integrations
- **Zeno.FM**: Radio streaming service (stream URL: https://stream.zeno.fm/yn65fsaurfhvv)
- **Spotify Web API**: For fetching artist and album metadata (via @spotify/web-api-ts-sdk)

### Key Libraries
- **Drizzle ORM**: Database access and migrations
- **TanStack Query**: Server state management
- **Framer Motion**: Animation library
- **React Hook Form + Zod**: Form validation
- **Bcrypt.js**: Password hashing
- **JSON Web Tokens**: Authentication tokens
- **Express.js**: Backend framework

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET` / `JWT_SECRET`: Secret key for session/token encryption (required)
- `NODE_ENV`: Environment indicator (auto-set by Vercel)
- `CORS_ORIGIN`: Allowed CORS origins (optional, defaults to all in production)
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk authentication (optional)
- `VITE_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (optional)
- `VITE_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset (optional)
- `VITE_FIREBASE_*`: Firebase configuration for real-time features (optional)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: Supabase client credentials (optional)

### Development Tools
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS + Autoprefixer**: CSS processing
- **ESLint + Prettier**: Code quality (implied by project structure)
- **Vite Dev Server**: Hot module replacement in development