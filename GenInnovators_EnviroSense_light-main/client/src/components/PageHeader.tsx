import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6", className)}>
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-4 solar-glow-text">
          {title}
        </h1>
        <p className="text-xl text-white/40 leading-relaxed max-w-3xl font-medium">
          {description}
        </p>
      </motion.div>
      {children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-shrink-0"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
