import React from 'react';
import { ShieldCheck, Car, Waves, AlertOctagon, PhoneCall } from 'lucide-react';

export const CitizenSafetyTips: React.FC = () => {
  const tips = [
    {
      icon: Car,
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      title: 'Driving on Mountain Curves',
      desc: 'Drive at reduced speeds on ghat roads. Use lower gears on steep slopes and keep headlights on during rain or fog.',
    },
    {
      icon: Waves,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      title: 'Notice Muddy Water Runoff',
      desc: 'If clear hillside streams suddenly turn muddy or carry small gravel across the road, stop safely—this is an early warning of slope wash.',
    },
    {
      icon: AlertOctagon,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      title: 'Safe Hillside Parking',
      desc: 'Never park vehicles or take rest stops directly beneath vertical soil cuttings, unsupported boulder faces, or steep mud embankments.',
    },
    {
      icon: PhoneCall,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      title: 'Quick Emergency Help',
      desc: 'In case of road blockages or mudslides, dial 112 (National Emergency), 1077 (District Disaster Control), or 1033 (National Highways).',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
            Practical Mountain Safety Guidelines for Everyday Citizens
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          Official NDRF &amp; Road Safety Advisory
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tips.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div 
              key={idx} 
              className="bg-slate-50/80 border border-slate-200 p-4 rounded-xl flex flex-col justify-between gap-2.5 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border ${t.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {t.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
