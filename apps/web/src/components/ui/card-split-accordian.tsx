
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItem {
  id: string | number;
  title: string;
  icon?: React.ReactNode;
  content: string;
}

interface AccordionAppProps {
  items: AccordionItem[];
}

export const AccordionApp: React.FC<AccordionAppProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePosition, setActivePosition] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    if (activeId === null) {
      setActivePosition((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    if (!containerRef.current) return;

    const activeElement = containerRef.current.querySelector(
      `[data-id="${activeId}"]`
    ) as HTMLElement;

    if (activeElement) {
      const { offsetTop, offsetHeight } = activeElement;
      setActivePosition({
        top: offsetTop,
        height: offsetHeight,
        opacity: 1,
      });
    }
  }, [activeId]);

  const toggleAccordion = (id: string | number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div
        ref={containerRef}
        className="w-full max-w-3xl relative space-y-4 sm:space-y-6"
      >
        {/* Background highlight */}
        <motion.div
          className="absolute left-0 right-0 rounded-3xl sm:rounded-[2rem] bg-gradient-to-br from-[#F2FCE2] to-[#A5F3FC] pointer-events-none z-0"
          animate={{
            top: activePosition.top,
            height: activePosition.height,
            opacity: activePosition.opacity,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            mass: 0.8,
          }}
        />

        {/* Accordion Items */}
        {items.map((item) => (
          <div
            key={item.id}
            data-id={item.id}
            className="relative z-10 bg-white/50 backdrop-blur-sm border border-black/10 rounded-3xl sm:rounded-[2rem] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleAccordion(item.id)}
              className="w-full p-6 sm:p-8 flex items-center justify-between text-left focus:outline-none"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                  {item.icon || (
                    <span className="font-bold text-lg sm:text-xl">
                      {item.title[0]}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
                  {item.title}
                </h3>
              </div>

              <div className="flex-shrink-0 ml-4">
                <motion.div
                  animate={{
                    rotate: activeId === item.id ? 45 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black flex items-center justify-center"
                >
                  <span className="text-xl sm:text-2xl font-light leading-none">
                    +
                  </span>
                </motion.div>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {activeId === item.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-6 sm:px-8 pb-8 sm:pb-10">
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSplitAccordian = AccordionApp;
