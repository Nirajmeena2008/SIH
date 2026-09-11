import React from 'react';
import { ShieldCheck, Car, Waves, AlertOctagon, PhoneCall } from 'lucide-react';

export const CitizenSafetyTips: React.FC = () => {
  const tips = [
    {
      icon: Car,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      title: 'Driving on Mountain Curves',
      desc: 'Drive at reduced speeds on ghat roads. Use lower gears on steep slopes and keep headlights on during rain or fog.',
    },
    {
      icon: Waves,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Notice Muddy Water Runoff',
      desc: 'If clear hillside streams suddenly turn muddy or carry small gravel across the road, stop safely—this is an early warning of slope wash.',
    },
    {
      icon: AlertOctagon,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Safe Hillside Parking',
      desc: 'Never park vehicles or take rest stops directly beneath vertical soil cuttings, unsupported boulder faces, or steep mud embankments.',
    },
    {
      icon: PhoneCall,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: 'Quick Emergency Help',
      desc: 'In case of road blockages or mudslides, dial 112 (National Emergency), 1077 (District Disaster Control), or 1033 (National Highways).',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            Practical Mountain Safety Guidelines for Everyday Citizens
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Official NDRF & Road Safety Advisory
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tips.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg border ${t.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">
                  {t.title}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
