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

interface Rocket {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  delay: number;
}

const StarryBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Generate stars with random properties
    const generateStars = () => {
      const starCount = 150;
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 0.5, // Size between 0.5 and 3.5
          opacity: Math.random() * 0.8 + 0.2, // Opacity between 0.2 and 1
          twinkleDelay: Math.random() * 4, // Random delay for twinkling
          twinkleDuration: Math.random() * 3 + 2, // Duration between 2 and 5 seconds
        });
      }
      
      setStars(newStars);
    };

    // Generate rockets with random properties
    const generateRockets = () => {
      const rocketCount = 5;
      const newRockets: Rocket[] = [];
      
      for (let i = 0; i < rocketCount; i++) {
        newRockets.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 0.8 + 0.4, // Size between 0.4 and 1.2
          rotation: Math.random() * 360,
          speed: Math.random() * 0.5 + 0.3, // Speed between 0.3 and 0.8
          delay: Math.random() * 10, // Random delay for animation start
        });
      }
      
      setRockets(newRockets);
    };

    generateStars();
    generateRockets();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A] via-[#0D1321] to-[#0A0F1A]" />
      
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
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            opacity: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [0, 200, 400],
            y: [0, 100, 200],
          }}
          transition={{
            duration: 2,
            delay: i * 2,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating Rocketships */}
      {rockets.map((rocket) => (
        <motion.div
          key={`rocket-${rocket.id}`}
          className="absolute"
          style={{
            left: `${rocket.x}%`,
            top: `${rocket.y}%`,
            transform: `rotate(${rocket.rotation}deg)`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0.6, 0.8, 0],
            scale: [0, rocket.size, rocket.size * 1.2, rocket.size, 0],
            x: [0, 100 * rocket.speed, 200 * rocket.speed, 300 * rocket.speed],
            y: [0, -50 * rocket.speed, -100 * rocket.speed, -150 * rocket.speed],
            rotate: [rocket.rotation, rocket.rotation + 45, rocket.rotation + 90],
          }}
          transition={{
            duration: 8,
            delay: rocket.delay,
            repeat: Infinity,
            repeatDelay: 15,
            ease: "easeInOut",
          }}
        >
          <div className="text-2xl">🚀</div>
        </motion.div>
      ))}

      {/* Floating Tilted Logo */}
      <motion.div
        className="absolute"
        style={{
          left: "15%",
          top: "20%",
        }}
        initial={{
          opacity: 0,
          scale: 0,
          rotate: -15,
        }}
        animate={{
          opacity: [0, 0.3, 0.2, 0.3, 0.2],
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
          className="rounded-md opacity-60"
        />
      </motion.div>

      {/* Second Floating Logo */}
      <motion.div
        className="absolute"
        style={{
          right: "20%",
          bottom: "30%",
        }}
        initial={{
          opacity: 0,
          scale: 0,
          rotate: 25,
        }}
        animate={{
          opacity: [0, 0.2, 0.4, 0.2, 0.3],
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
          className="rounded-md opacity-50"
        />
      </motion.div>
      
      {/* Constellation lines (subtle connecting lines) */}
      {stars.slice(0, 20).map((star, index) => {
        const nextStar = stars[(index + 1) % 20];
        if (!nextStar) return null;
        
        const distance = Math.sqrt(
          Math.pow(star.x - nextStar.x, 2) + Math.pow(star.y - nextStar.y, 2)
        );
        
        // Only connect nearby stars
        if (distance < 15) {
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
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                delay: index * 0.5,
                repeat: Infinity,
                repeatDelay: 6,
              }}
            />
          );
        }
        return null;
      })}
      
      {/* Nebula effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-3xl"
          style={{
            left: "20%",
            top: "30%",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-orange-500/5 to-pink-500/5 blur-3xl"
          style={{
            right: "15%",
            bottom: "25%",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
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
