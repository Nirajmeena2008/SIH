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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Emergency Helplines
              </h3>
              <span className="text-xs text-slate-500">
                Active for {currentState} &amp; all Indian Mountain Sectors
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
                    <Icon className={`w-5 h-5 ${h.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {h.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {h.desc}
                    </p>
                  </div>
                </div>

                <a 
                  href={`tel:${h.number}`}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-sm shrink-0 shadow-xs transition-colors"
                >
                  {h.number}
                </a>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Toll-free 24x7 from any mobile or landline
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
