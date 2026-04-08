'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileImage, FileText, X, Loader2, CheckCircle2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { ExportTemplate } from './ExportTemplate';
import { useCalendar } from '@/hooks/useCalendar';
import { useNotes } from '@/hooks/useNotes';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendar: ReturnType<typeof useCalendar>;
  notesStore: ReturnType<typeof useNotes>;
}

export function ExportModal({ isOpen, onClose, calendar, notesStore }: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { selectionStats } = calendar;
  
  if (!selectionStats) return null;

  // Filter notes in range
  const notesInRange = notesStore.notes.filter(note => {
    const noteDate = new Date(note.dateKey);
    return noteDate >= selectionStats.start && noteDate <= selectionStats.end;
  });

  const handleExport = async (format: 'png' | 'pdf') => {
    setIsExporting(true);
    setSuccess(false);

    try {
      // Find the hidden template
      const element = document.getElementById('export-container');
      if (!element) throw new Error('Export container not found');

      // Generate Image
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#0c0c0e'
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `chronicle-timeline-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`chronicle-timeline-${new Date().getTime()}.pdf`);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card-bg border border-border-color rounded-[2.5rem] shadow-2xl z-[101] overflow-hidden"
          >
            {/* Hidden Export component for capture */}
            <div className="fixed -left-[9999px] top-0">
              <ExportTemplate 
                range={selectionStats} 
                notes={notesInRange} 
                accentColor="var(--accent-blue)" 
              />
            </div>

            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white mb-1 uppercase tracking-widest">Export Timeline</h3>
                  <p className="text-xs font-bold text-gray-text/40">GENERATE PROFESSIONAL RECORD</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-text hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleExport('png')}
                  disabled={isExporting}
                  className="w-full group flex items-center justify-between p-6 bg-background/40 hover:bg-accent-blue/10 border border-border-color hover:border-accent-blue/40 rounded-3xl transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                      <FileImage size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">Capture Image</p>
                      <p className="text-xs text-gray-text/40 font-black tracking-widest">HIGH RES PNG</p>
                    </div>
                  </div>
                  <Download size={20} className="text-gray-text group-hover:text-accent-blue transition-colors" />
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isExporting}
                  className="w-full group flex items-center justify-between p-6 bg-background/40 hover:bg-indigo-500/10 border border-border-color hover:border-indigo-500/40 rounded-3xl transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-white">Document PDF</p>
                      <p className="text-xs text-gray-text/40 font-black tracking-widest">READY TO PRINT</p>
                    </div>
                  </div>
                  <Download size={20} className="text-gray-text group-hover:text-indigo-400 transition-colors" />
                </button>
              </div>

              {/* Status Indicator */}
              <AnimatePresence>
                {(isExporting || success) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/[0.02]"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 size={20} className="text-accent-blue animate-spin" />
                        <span className="text-xs font-black tracking-widest text-accent-blue">PROCESSING ASSETS...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        <span className="text-xs font-black tracking-widest text-emerald-500">EXPORT READY — CHECK DOWNLOADS</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
