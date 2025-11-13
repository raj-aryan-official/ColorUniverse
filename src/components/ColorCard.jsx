import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const getTextColor = (hex) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#0F172A' : '#FFFFFF';
};

const ColorCard = ({ shade, onCopy }) => (
  <motion.button
    layout
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.98 }}
    className="group relative flex h-32 w-full items-center justify-center rounded-2xl text-center font-medium shadow-soft ring-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
    style={{
      backgroundColor: shade.hex,
      color: getTextColor(shade.hex),
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
    }}
    onClick={() => onCopy(shade)}
    title={`Copy ${shade.name} (${shade.hex})`}
  >
    <span className="text-base sm:text-lg md:text-xl drop-shadow-md transition-transform duration-200 group-hover:translate-y-[-2px]">
      {shade.name}
    </span>
    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-10 group-focus-visible:opacity-20" style={{ background: '#FFFFFF' }} />
  </motion.button>
);

ColorCard.propTypes = {
  shade: PropTypes.shape({
    name: PropTypes.string.isRequired,
    hex: PropTypes.string.isRequired,
  }).isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default ColorCard;


