import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useRadio } from "@/lib/radio-context";
import { useRef } from "react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showRadio?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const FloatingElement = ({ delay = 0, className = "" }: { delay?: number; className?: string }) => (
  <motion.div
    className={`absolute rounded-full bg-primary/20 blur-xl ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const WaveformBar = ({ height, delay }: { height: number; delay: number }) => (
  <motion.div
    className="w-1 rounded-full bg-primary"
    animate={{
      scaleY: [1, 0.4, 1],
    }}
    transition={{
      duration: 0.8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ height }}
  />
);

export function HeroSection({
  title = "GROUPTHERAPY",
  subtitle = "The sound of tomorrow, today",
  backgroundImage,
  showRadio = true,
  ctaText = "Explore Releases",
  ctaLink = "/releases",
}: HeroProps) {
  const { togglePlay, isPlaying } = useRadio();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const titleParts = title.split("THERAPY");

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Mesh Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-background via-primary/5 to-background animate-gradient-mesh" 
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 60%),
                linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.5), hsl(var(--background)))
              `,
              backgroundSize: "200% 200%",
            }}
          />
        )}
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </motion.div>

      {/* Floating Audio-Reactive Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} className="top-[10%] left-[10%] w-64 h-64" />
        <FloatingElement delay={1} className="top-[60%] right-[15%] w-48 h-48" />
        <FloatingElement delay={2} className="top-[30%] right-[25%] w-32 h-32" />
        <FloatingElement delay={3} className="bottom-[20%] left-[20%] w-40 h-40" />

        {/* Decorative waveform elements */}
        <motion.div
          className="absolute top-1/4 left-[5%] flex items-end gap-1 opacity-20"
          animate={{ opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.1 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {[20, 35, 25, 45, 30, 40, 25, 35, 20].map((h, i) => (
            <WaveformBar key={i} height={h} delay={i * 0.1} />
          ))}
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-[8%] flex items-end gap-1 opacity-20"
          animate={{ opacity: isPlaying ? [0.2, 0.4, 0.2] : 0.1 }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          {[25, 40, 20, 50, 35, 45, 30, 40, 25].map((h, i) => (
            <WaveformBar key={i} height={h} delay={i * 0.12} />
          ))}
        </motion.div>
      </div>

      {/* Grid overlay for texture */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        style={{ y: textY, opacity }}
      >
        {/* Staggered Title Animation */}
        <div className="overflow-hidden mb-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base uppercase tracking-[0.3em] text-primary font-medium mb-4"
          >
            Electronic Music Label
          </motion.p>
        </div>

        <h1
          className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter mb-8"
          data-testid="text-hero-title"
        >
          <span className="inline-block overflow-hidden">
            {titleParts[0].split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="inline-block overflow-hidden">
            {"THERAPY".split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i + titleParts[0].length}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block text-primary"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
          data-testid="text-hero-subtitle"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {showRadio && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={togglePlay}
                className={`min-w-[200px] h-14 text-lg gap-3 relative overflow-hidden ${
                  isPlaying
                    ? "bg-primary text-primary-foreground animate-pulse-glow"
                    : "bg-primary/90 text-primary-foreground hover:bg-primary"
                }`}
                data-testid="button-hero-radio"
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="h-5 w-5" />
                    <span className="flex items-center gap-2">
                      Now Playing
                      <span className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1 h-4 bg-current rounded-full"
                            animate={{ scaleY: [1, 0.4, 1] }}
                            transition={{
                              duration: 0.6,
                              delay: i * 0.15,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-current" />
                    Listen Live
                  </>
                )}
              </Button>
            </motion.div>
          )}
          
          <Link href={ctaLink}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] h-14 text-lg gap-3 glass border-primary/20 hover:border-primary/50 hover:bg-primary/10"
                data-testid="button-hero-cta"
              >
                {ctaText}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "50+", label: "Artists" },
            { value: "200+", label: "Releases" },
            { value: "24/7", label: "Radio" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary stat-number">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
}: {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                linear-gradient(to bottom, hsl(var(--muted)), hsl(var(--background)))
              `,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-6"
            data-testid="text-page-title"
          >
            {title.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
            data-testid="text-page-subtitle"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
