import { motion } from 'framer-motion';

export default function ScrollIndicator() {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      {/* Mouse icon */}
      <div className="w-6 h-10 border-2 border-accent-primary rounded-full flex justify-center p-1">
        <motion.div
          className="w-1 h-2 bg-accent-primary rounded-full"
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* "Scroll to explore" text */}
      <motion.p
        className="text-text-secondary text-xs font-medium tracking-wider uppercase"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Scroll to explore
      </motion.p>
    </motion.div>
  );
}
