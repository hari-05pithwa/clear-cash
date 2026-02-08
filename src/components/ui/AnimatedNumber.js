"use client";
import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedNumber({ value }) {
  // Spring configuration for that "bouncy" liquid money feel
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => 
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.floor(current))
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}