import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { ReleasesCarousel } from "@/components/releases-carousel";
import { EventsSection } from "@/components/events-section";
import { PlaylistsSection } from "@/components/playlists-section";
import { FeaturedArtists } from "@/components/featured-artists";
import { SEOHead, generateStructuredData } from "@/components/seo-head";
import { useQuery } from "@tanstack/react-query";
import type { Release, Event, Playlist, Artist } from "@shared/schema";
import { Play, Users, Disc3, Radio, Headphones, Music2 } from "lucide-react";

function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-primary/5 border-y border-primary/20">
      <motion.div
        className="inline-flex gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

function MarqueeItem({ text, icon: Icon }: { text: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm md:text-base font-medium text-foreground/80 uppercase tracking-wider">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      {text}
      <span className="text-primary ml-4">✦</span>
    </span>
  );
}

function AnimatedCounter({ 
  value, 
  suffix = "", 
  prefix = "",
  duration = 2 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, suffix]);

  return <span ref={ref} className="stat-number">{prefix}0{suffix}</span>;
}

function StatsSection() {
  const stats = [
    { value: 50, suffix: "+", label: "Artists", icon: Users },
    { value: 200, suffix: "+", label: "Releases", icon: Disc3 },
    { value: 24, suffix: "/7", label: "Radio", icon: Radio },
    { value: 1, prefix: "", suffix: "M+", label: "Streams", icon: Headphones },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            The Numbers <span className="gradient-text">Speak</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Growing the future of electronic music, one beat at a time.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 md:p-8 text-center group cursor-pointer"
            >
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 gradient-text">
                <AnimatedCounter 
                  value={stat.value} 
                  suffix={stat.suffix} 
                  prefix={stat.prefix || ""} 
                />
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaveformDivider() {
  return (
    <div className="flex items-center justify-center gap-1 py-8 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary/30 rounded-full"
          initial={{ height: 4 }}
          animate={{ 
            height: [4, Math.random() * 24 + 8, 4],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: releases } = useQuery<Release[]>({
    queryKey: ["/api/releases"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
  });

  const { data: artists } = useQuery<Artist[]>({
    queryKey: ["/api/artists", "featured"],
  });

  const organizationSchema = generateStructuredData("Organization", {
    name: "GroupTherapy Records",
    url: "https://grouptherapy.com",
    logo: "https://grouptherapy.com/logo.png",
    description: "Independent electronic music record label pushing the boundaries of sound",
    sameAs: [
      "https://www.instagram.com/grouptherapyrecords",
      "https://twitter.com/grouptherapy",
      "https://www.youtube.com/grouptherapyrecords",
      "https://open.spotify.com/user/grouptherapyrecords",
      "https://soundcloud.com/grouptherapyrecords",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@grouptherapy.com",
      contactType: "Customer Service",
    },
  });

  const marqueeItems = [
    { text: "New Release: ECHOES EP", icon: Disc3 },
    { text: "Live Radio 24/7", icon: Radio },
    { text: "Summer Tour 2025", icon: Music2 },
    { text: "50+ Artists Worldwide", icon: Users },
    { text: "Stream Now on All Platforms", icon: Play },
    { text: "GroupTherapy Sessions", icon: Headphones },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="GroupTherapy Records - Electronic Music Label | New Releases & Events"
        description="Discover the future of electronic music with GroupTherapy Records. Stream new releases, find upcoming events, listen to 24/7 radio, and connect with cutting-edge artists."
        keywords={["electronic music label", "house music", "techno", "DJ events", "music releases", "live radio", "independent label", "electronic artists", "music streaming"]}
        structuredData={organizationSchema}
      />
      
      <HeroSection
        title="GROUPTHERAPY"
        subtitle="The sound of tomorrow, today. Discover the future of the music you love."
        showRadio={true}
        ctaText="Explore Releases"
        ctaLink="/releases"
      />

      <Marquee speed={40}>
        {marqueeItems.map((item, index) => (
          <MarqueeItem key={index} text={item.text} icon={item.icon} />
        ))}
      </Marquee>

      <StatsSection />

      <WaveformDivider />

      <section className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Fresh <span className="gradient-text">Drops</span>
          </h2>
          <p className="text-muted-foreground mt-2">The latest releases from our roster</p>
        </motion.div>
        <ReleasesCarousel
          releases={releases || []}
          title=""
          autoPlay={true}
          showViewAll={true}
        />
      </section>

      <WaveformDivider />

      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Our <span className="gradient-text">Artists</span>
          </h2>
          <p className="text-muted-foreground mt-2">The creative minds behind the sound</p>
        </motion.div>
        <FeaturedArtists
          artists={artists?.filter((a) => a.featured) || []}
          title=""
        />
      </section>

      <WaveformDivider />

      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Upcoming <span className="gradient-text">Events</span>
          </h2>
          <p className="text-muted-foreground mt-2">Experience the music live</p>
        </motion.div>
        <EventsSection
          events={events || []}
          title=""
          showViewAll={true}
        />
      </section>

      <WaveformDivider />

      <section className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Curated <span className="gradient-text">Playlists</span>
          </h2>
          <p className="text-muted-foreground mt-2">Handpicked selections for every mood</p>
        </motion.div>
        <PlaylistsSection
          playlists={playlists || []}
          title=""
        />
      </section>

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6"
            >
              <Radio className="w-8 h-8" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              GroupTherapy <span className="gradient-text">Radar</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Stay updated with the latest news, interviews, and behind-the-scenes content from the label.
            </p>
            <motion.a
              href="/news"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              data-testid="link-news-cta"
            >
              Read Latest News
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
