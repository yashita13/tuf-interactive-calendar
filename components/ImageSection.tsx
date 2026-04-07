import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

type ImageSectionProps = {
  currentDate: Date;
};

export function ImageSection({ currentDate }: ImageSectionProps) {
  return (
    <div className="relative w-full h-[400px] md:h-[450px] overflow-hidden bg-gray-200">
      <img 
        src="https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=1600&auto=format&fit=crop" 
        alt="Mountain Climber" 
        className="w-full h-full object-cover object-center"
      />
      
      {/* Angular Blue Overlay holding Month and Year */}
      <div className="absolute bottom-0 w-full pointer-events-none">
        
        {/* SVG creating the angular cutouts */}
        <div className="relative w-full overflow-hidden text-white" style={{ height: '140px' }}>
          <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
             <path fill="#308be7" fillOpacity="1" d="M0,192L480,320L960,192L1440,320L1440,320L960,320L480,320L0,320Z"></path>
             <path fill="#308be7" fillOpacity="1" d="M0,160L480,288L960,160L1440,288L1440,320L960,320L480,320L0,320Z"></path>
             <path fill="#ffffff" fillOpacity="1" d="M0,256L480,320L960,256L1440,320L1440,320L960,320L480,320L0,320Z"></path>
          </svg>
           {/* Text container */}
          <div className="absolute inset-0 flex justify-end items-end p-8 md:pr-16 md:pb-12 z-10">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentDate.toString()}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-right"
              >
                <div className="text-2xl font-medium tracking-tight text-white/90">
                  {format(currentDate, 'yyyy')}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase mt-1">
                  {format(currentDate, 'MMMM')}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
