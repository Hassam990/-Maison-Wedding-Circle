"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80", title: "Luxury Wedding" },
  { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80", title: "Floral Decor" },
  { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80", title: "Celebration" },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80", title: "Elegance" },
  { src: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80", title: "Reception" },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80", title: "Design" },
];

export default function SmoothSlider() {
  // Duplicate images for infinite effect
  const allImages = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden bg-transparent py-10">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {allImages.map((img, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-[300px] h-[400px] rounded-2xl overflow-hidden group shadow-xl"
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-ivory font-bold text-xl">{img.title}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
