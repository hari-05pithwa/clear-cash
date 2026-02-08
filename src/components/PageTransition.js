"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ isExiting }) {
  return (
    <AnimatePresence>
      {isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center"
        >
          {/* Branding Shimmer Animation */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut" 
            }}
            className="text-blue-600 font-black text-4xl tracking-tighter"
          >
            CC
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}