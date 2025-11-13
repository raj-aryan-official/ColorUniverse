import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import ColorCard from './ColorCard';

const ColorGrid = ({ familyName, shades, onCopy }) => (
  <motion.section
    layout
    className="w-full rounded-3xl bg-white/60 p-6 shadow-soft backdrop-blur-lg transition-all duration-300 md:p-8 dark:bg-slate-900/70 dark:text-slate-100"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
  >
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3rem] text-slate-500 dark:text-slate-400">
          Chromatic Family
        </p>
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-50">{familyName}</h2>
      </div>
      <p className="text-sm text-slate-500 sm:max-w-sm dark:text-slate-400">
        Tap a shade to copy its HEX code instantly. Explore hundreds of meticulously crafted tones that traverse the full spectrum of this family.
      </p>
    </div>

    {shades.length === 0 ? (
      <motion.div
        layout
        className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 p-10 text-center text-slate-500 sm:mt-8 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">No shades found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Try a different search term or explore another color family.
        </p>
      </motion.div>
    ) : (
      <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <AnimatePresence initial={false}>
          {shades.map((shade) => (
            <motion.div
              key={shade.hex}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <ColorCard shade={shade} onCopy={onCopy} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </motion.section>
);

ColorGrid.propTypes = {
  familyName: PropTypes.string.isRequired,
  shades: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      hex: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default ColorGrid;


