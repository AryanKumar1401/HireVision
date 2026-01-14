"use client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

const StarryBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const generateStars = () => {
      const starCount = 120;
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          twinkleDelay: Math.random() * 4,
          twinkleDuration: Math.random() * 3 + 2,
        });
      }
      
      setStars(newStars);
    };

    generateStars();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background gradient using design tokens */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-dark)] via-[var(--surface-elevated)] to-[var(--surface-dark)]" />
      
      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{ opacity: star.opacity }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.twinkleDuration,
            delay: star.twinkleDelay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Shooting stars */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-[var(--accent-primary)] rounded-full"
          style={{
            left: `${10 + i * 40}%`,
            top: `${10 + i * 20}%`,
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, 200, 400],
            y: [0, 100, 200],
          }}
          transition={{
            duration: 2,
            delay: i * 5,
            repeat: Infinity,
            repeatDelay: 12,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating Logo */}
      <motion.div
        className="absolute"
        style={{ left: "15%", top: "20%" }}
        initial={{ opacity: 0, scale: 0, rotate: -15 }}
        animate={{
          opacity: [0, 0.2, 0.15, 0.2, 0.15],
          scale: [0, 0.8, 1, 0.9, 0.8],
          rotate: [-15, -10, -20, -15, -18],
          y: [0, -20, 10, -15, 5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/logo.png"
          alt="Floating Logo"
          width={60}
          height={8}
          className="rounded-md opacity-50"
        />
      </motion.div>

      {/* Second Floating Logo */}
      <motion.div
        className="absolute"
        style={{ right: "20%", bottom: "30%" }}
        initial={{ opacity: 0, scale: 0, rotate: 25 }}
        animate={{
          opacity: [0, 0.15, 0.25, 0.15, 0.2],
          scale: [0, 0.6, 0.8, 0.7, 0.6],
          rotate: [25, 30, 20, 25, 28],
          y: [0, 15, -10, 20, -5],
        }}
        transition={{
          duration: 15,
          delay: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/logo.png"
          alt="Floating Logo"
          width={50}
          height={6}
          className="rounded-md opacity-40"
        />
      </motion.div>
      
      {/* Constellation lines */}
      {stars.slice(0, 15).map((star, index) => {
        const nextStar = stars[(index + 1) % 15];
        if (!nextStar) return null;
        
        const distance = Math.sqrt(
          Math.pow(star.x - nextStar.x, 2) + Math.pow(star.y - nextStar.y, 2)
        );
        
        if (distance < 12) {
          return (
            <motion.div
              key={`line-${star.id}-${nextStar.id}`}
              className="absolute bg-gradient-to-r from-white/10 to-transparent"
              style={{
                left: `${Math.min(star.x, nextStar.x)}%`,
                top: `${Math.min(star.y, nextStar.y)}%`,
                width: `${distance}%`,
                height: "1px",
                transformOrigin: "left center",
                transform: `rotate(${Math.atan2(nextStar.y - star.y, nextStar.x - star.x) * (180 / Math.PI)}deg)`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0] }}
              transition={{
                duration: 4,
                delay: index * 0.5,
                repeat: Infinity,
                repeatDelay: 8,
              }}
            />
          );
        }
        return null;
      })}
      
      {/* Nebula effects using design tokens */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-tertiary)]/5 blur-3xl"
          style={{ left: "20%", top: "30%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-violet-500/5 to-[var(--accent-primary)]/5 blur-3xl"
          style={{ right: "15%", bottom: "25%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.08, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default StarryBackground;
