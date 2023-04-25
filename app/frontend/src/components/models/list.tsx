import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelListTypes {
  id: string;
  lastModified: string;
  downloads: number;
  type: string;
}

export default function ModelList({
  id,
  lastModified,
  downloads,
  type,
  children,
}: React.PropsWithChildren<ModelListTypes>) {
  let [isExpand, setIsExpand] = useState(false);
  return (
    <div className="relative mb-3 overflow-hidden rounded-lg bg-white shadow-card transition-all last:mb-0 hover:shadow-large dark:bg-light-dark">
      <div
        className="relative grid h-auto cursor-pointer grid-cols-4 items-center gap-3 py-4 sm:h-20 sm:grid-cols-6 sm:gap-6 sm:py-0"
        onClick={() => setIsExpand(!isExpand)}
      >
        <div className="truncate px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Name
          </span>
          {id}
        </div>
        <div className="px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm">
          <span className="mb-1 block font-medium text-gray-600 dark:text-gray-400 sm:hidden">
            Type
          </span>
          {lastModified}
        </div>
        <div className="hidden px-4 text-xs font-medium uppercase tracking-wider text-black dark:text-white sm:px-8 sm:text-sm lg:block">
          {type}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpand && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="border-t border-dashed border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-8 sm:py-6">
              <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden"></div>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
