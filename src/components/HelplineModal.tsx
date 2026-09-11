import React from 'react';
import { X, PhoneCall, ShieldAlert, Ambulance, LifeBuoy } from 'lucide-react';

interface HelplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: string;
}

export const HelplineModal: React.FC<HelplineModalProps> = ({
  isOpen,
  onClose,
  currentState,
}) => {
  if (!isOpen) return null;

  const helplines = [
    { title: 'National Emergency Helpline', number: '112', desc: 'Police, Fire, and Ambulance (All India 24x7)', icon: ShieldAlert, color: 'text-rose-400' },
    { title: 'Disaster Management Control Room', number: '1077', desc: 'District Landslide & Natural Disaster Assistance', icon: LifeBuoy, color: 'text-amber-400' },
    { title: 'National Highways Authority (NHAI)', number: '1033', desc: 'Highway blockages, tow trucks, and emergency clearance', icon: PhoneCall, color: 'text-sky-400' },
    { title: 'Ambulance / Medical Emergency', number: '108', desc: 'Emergency mountain patient transfer and first aid', icon: Ambulance, color: 'text-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Emergency Helplines
              </h3>
              <span className="text-xs text-slate-400">
                Active for {currentState} & all Indian Mountain Sectors
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {helplines.map((h, i) => {
            const Icon = h.icon;
            return (
              <div 
                key={i} 
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    <Icon className={`w-5 h-5 ${h.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                      {h.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {h.desc}
                    </p>
                  </div>
                </div>

                <a 
                  href={`tel:${h.number}`}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-sm shrink-0 transition-colors"
                >
                  {h.number}
                </a>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Toll-free 24x7 from any mobile or landline
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
