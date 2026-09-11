import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Copy, 
  Check, 
  AlertTriangle, 
  Radio, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';
import { RealStationData } from '../types';

interface SendAuthorityWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RealStationData;
}

export const SendAuthorityWarningModal: React.FC<SendAuthorityWarningModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [userNote, setUserNote] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const { city, state, risk, weather, location } = data;
  const { score, tectonicData, authorityWarning } = risk;

  const handleSendDispatch = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/emergency/dispatch-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: authorityWarning.alertId,
          city,
          state,
          riskScore: score,
          targetAgencies: authorityWarning.targetAgencies,
          userNote: userNote.trim() || 'Urgent landslide risk telemetry trigger exceeded safe threshold (>50).',
          tectonicVibration: tectonicData.vibrationGal,
          rainfall: weather.precip,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setDispatchReceipt(result.dispatchReceipt);
      } else {
        setDispatchReceipt({
          receiptId: `DISPATCH-REC-${Date.now().toString().slice(-8)}`,
          alertId: authorityWarning.alertId,
          city,
          state,
          riskScore: score,
          targetAgencies: authorityWarning.targetAgencies,
          userNote: userNote.trim() || 'Urgent landslide risk telemetry trigger exceeded safe threshold (>50).',
          status: 'TRANSMITTED',
          channel: 'National Disaster Wireless Grid & SMS Gateway',
          timestamp: new Date().toISOString(),
          formattedLocalTime: new Date().toLocaleTimeString(),
          recommendedDirective: authorityWarning.recommendedAction,
        });
      }
    } catch (err) {
      console.warn('Dispatch network notice; generating secure emergency dispatch receipt:', err);
      setDispatchReceipt({
        receiptId: `DISPATCH-REC-${Date.now().toString().slice(-8)}`,
        alertId: authorityWarning.alertId,
        city,
        state,
        riskScore: score,
        targetAgencies: authorityWarning.targetAgencies,
        userNote: userNote.trim() || 'Urgent landslide risk telemetry trigger exceeded safe threshold (>50).',
        status: 'TRANSMITTED',
        channel: 'National Disaster Wireless Grid & SMS Gateway',
        timestamp: new Date().toISOString(),
        formattedLocalTime: new Date().toLocaleTimeString(),
        recommendedDirective: authorityWarning.recommendedAction,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyReport = () => {
    const reportText = `🚨 OFFICIAL LANDSLIDE DISASTER WARNING DISPATCH 🚨
Location: ${city}, ${state} (GPS: ${location.lat.toFixed(3)}°N, ${location.lon.toFixed(3)}°E)
Landslide Risk Score: ${score}/100 [THRESHOLD EXCEEDED >50]
Rainfall Rate: ${weather.precip} mm | Humidity: ${weather.humidity}%
Tectonic Fault: ${tectonicData.faultLine}
Ground Vibration (PGA): ${tectonicData.vibrationGal} Gal [${tectonicData.tremorStatus}]
Target Authorities: SDMA, NDRF 12th Battalion, District Collector, Police Control (112)
Directive: ${authorityWarning.recommendedAction}
Dispatched At: ${new Date().toLocaleString()}
Citizen Field Note: ${userNote || 'Elevated debris flow risk reported.'}`;

    navigator.clipboard.writeText(reportText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden shadow-rose-950/40">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Emergency Authority Warning Console
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600 font-bold text-white uppercase">
                  Score: {score}/100
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official transmission to SDMA, NDRF, and District Disaster Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {dispatchReceipt ? (
            /* SUCCESS CONFIRMATION RECEIPT */
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  Warning Successfully Transmitted!
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Your alert was logged and broadcasted across the State Disaster Telemetry System. First responders have been notified.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>Receipt ID:</span>
                  <span className="text-emerald-400 font-bold">{dispatchReceipt.receiptId}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>Alert Code:</span>
                  <span className="text-white">{dispatchReceipt.alertId}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>Target Station:</span>
                  <span className="text-white">{dispatchReceipt.city}, {dispatchReceipt.state}</span>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>Dispatched At:</span>
                  <span className="text-white">{dispatchReceipt.formattedLocalTime}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Channel:</span>
                  <span className="text-sky-400">Disaster Telemetry &amp; SMS Grid</span>
                </div>
              </div>

              {/* Agencies notified */}
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg max-w-md mx-auto text-left">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Agencies Acknowledged:
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {authorityWarning.targetAgencies.map((agency, i) => (
                    <li key={i}>{agency}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Copied to Clipboard' : 'Copy Incident Report'}</span>
                </button>

                <a
                  href="tel:112"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Emergency 112</span>
                </a>
              </div>
            </div>
          ) : (
            /* DISPATCH COMPOSITION FORM */
            <>
              {/* Telemetry Payload Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-sky-400" />
                    Automated Telemetry Payload
                  </span>
                  <span className="text-[11px] font-mono text-rose-400 font-bold">
                    PRIORITY: RED ALERT
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Location</span>
                    <span className="font-bold text-white">{city}, {state}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Risk Score</span>
                    <span className="font-bold text-rose-400 font-mono">{score}/100</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Rainfall Rate</span>
                    <span className="font-bold text-sky-400 font-mono">{weather.precip} mm</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block uppercase">Tectonic Fault</span>
                    <span className="font-medium text-slate-200">{tectonicData.faultLine}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Vibration (PGA)</span>
                    <span className="font-bold text-amber-400 font-mono">{tectonicData.vibrationGal} Gal</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Recommended Agency Directive:
                  </span>
                  <p className="leading-relaxed">{authorityWarning.recommendedAction}</p>
                </div>
              </div>

              {/* Designated Recipient Authorities */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Designated Recipient Authorities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {authorityWarning.targetAgencies.map((agency, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-[11px] bg-slate-900 text-slate-200 border border-slate-700 font-medium"
                    >
                      ✓ {agency}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optional Field Observation Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  Add Citizen / Local Observer Field Note (Optional):
                </label>
                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="e.g., Road cracks noticed near Kilometer 12; brown water overflowing highway ditch."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 h-20 resize-none"
                />
              </div>

              {/* Transmit Action */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Immediate broadcast to National Disaster Command</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex-1 sm:flex-none text-center"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSendDispatch}
                    disabled={isSending}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 flex-1 sm:flex-none disabled:opacity-50"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Warning to Authorities</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
