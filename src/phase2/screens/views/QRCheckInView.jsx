import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ArrowRight, 
  ScanLine, 
  Check,
  AlertTriangle,
  Wheat,
  Clock
} from 'lucide-react';
import { sharedStore } from '../../store';

export default function QRCheckInView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [inputVal, setInputVal] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanningActive, setIsScanningActive] = useState(false);

  const centerId = adminSession?.centerId || 'center-1';
  const staffName = adminSession?.staffName || 'Center Staff';

  const handleValidate = (valueToTest) => {
    const val = valueToTest || inputVal;
    if (!val.trim()) return;

    const res = sharedStore.checkInFarmer(val, centerId, staffName);
    setScanResult(res);
  };

  const handleSimulateScan = (mockCode) => {
    setInputVal(mockCode);
    handleValidate(mockCode);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Title & Instruction */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <ScanLine className="w-4 h-4" />
          <span>{isHindi ? 'मंडी गेट #1 सत्यापन' : 'Gate #1 Entry Verification'}</span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'गेट पास क्यूआर स्कैनर एवं चेक-इन' : 'QR Scanner & Gate Check-In'}
        </h2>
        <p className="text-xs text-stone-400">
          {isHindi 
            ? 'किसान का क्यूआर कोड स्कैन करें या टोकन नंबर / बैकअप कोड दर्ज करें।' 
            : 'Scan farmer’s digital QR code pass or enter token number / backup code manually.'}
        </p>
      </div>

      {/* BIG VALIDATION RESULT CARD (Green on Success, Red on Error) */}
      {scanResult && (
        <div className="animate-fadeIn">
          {scanResult.success ? (
            <div className="bg-emerald-950/90 border-2 border-emerald-500 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      {isHindi ? 'सत्यापित एवं स्वीकृत' : 'Verified & Admitted'}
                    </span>
                    <h3 className="text-xl font-black">
                      {isHindi ? 'गेट प्रवेश दर्ज किया गया' : 'Center Entry Confirmed'}
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-emerald-300 font-bold">{isHindi ? 'टोकन संख्या' : 'Token'}</span>
                  <div className="text-2xl font-black text-amber-300">
                    #{scanResult.booking.tokenNumber}
                  </div>
                </div>
              </div>

              {/* Farmer Info Strip */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/50">
                  <span className="text-stone-400 block text-[11px]">{isHindi ? 'किसान का नाम' : 'Farmer Name'}</span>
                  <span className="font-bold text-base text-white">{scanResult.booking.farmerName}</span>
                </div>
                <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/50">
                  <span className="text-stone-400 block text-[11px]">{isHindi ? 'फसल व मात्रा' : 'Crop & Qty'}</span>
                  <span className="font-bold text-base text-amber-300">
                    {scanResult.booking.cropName} ({scanResult.booking.quantity} q)
                  </span>
                </div>
                <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/50">
                  <span className="text-stone-400 block text-[11px]">{isHindi ? 'समय स्लॉट' : 'Slot Time'}</span>
                  <span className="font-bold text-white">{scanResult.booking.slotTime}</span>
                </div>
                <div className="bg-emerald-900/40 p-3 rounded-2xl border border-emerald-700/50">
                  <span className="text-stone-400 block text-[11px]">{isHindi ? 'प्रवेश समय' : 'Checked In'}</span>
                  <span className="font-bold text-emerald-300">{scanResult.booking.checkedInAt}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-900/30 rounded-2xl border border-emerald-600/30 text-xs text-emerald-200 flex items-center justify-between">
                <span>{isHindi ? '✓ लाइव कतार और किसान स्टेज ट्रैकर में चरण 2 अपडेट हो गया।' : '✓ Stage 2 (Center Entry) synced to live queue and farmer tracker.'}</span>
              </div>
            </div>
          ) : (
            <div className="bg-red-950/90 border-2 border-red-500 rounded-3xl p-6 text-white space-y-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                    {isHindi ? 'चेक-इन अस्वीकृत' : 'Check-In Rejected'}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {scanResult.message}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-stone-300">
                {isHindi 
                  ? 'कृपया किसान का टोकन नंबर, मंडी केंद्र और निर्धारित स्लॉट समय की पुनः जांच करें।' 
                  : 'Please check the token validity, scheduled center, or redirect farmer to walk-in desk.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SCANNER CAMERA EMULATOR / INPUT */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <span>{isHindi ? 'कैमरा स्कैनर' : 'Optical QR Scanner'}</span>
          </h3>
          <button
            type="button"
            onClick={() => setIsScanningActive(!isScanningActive)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              isScanningActive ? 'bg-red-900/60 text-red-300 border border-red-500' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {isScanningActive ? (isHindi ? 'स्कैनर बंद करें' : 'Stop Camera') : (isHindi ? 'कैमरा चालू करें' : 'Open Camera')}
          </button>
        </div>

        {/* Viewport simulation */}
        <div className="relative bg-stone-950 rounded-2xl h-48 border-2 border-dashed border-stone-700 flex flex-col items-center justify-center overflow-hidden">
          {isScanningActive ? (
            <div className="text-center space-y-2">
              <div className="w-24 h-24 border-2 border-emerald-400 rounded-2xl mx-auto flex items-center justify-center animate-pulse relative">
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-sm animate-bounce"></div>
                <QrCode className="w-12 h-12 text-emerald-400 opacity-60" />
              </div>
              <span className="text-[11px] text-emerald-300 font-bold block">
                {isHindi ? 'क्यूआर कोड को फ्रेम के बीच में रखें...' : 'Align QR code within optical frame...'}
              </span>
            </div>
          ) : (
            <div className="text-center space-y-1 text-stone-500">
              <QrCode className="w-10 h-10 mx-auto text-stone-700" />
              <span className="text-xs font-semibold block">
                {isHindi ? 'कैमरा तैयार है' : 'Optical scanner standby'}
              </span>
            </div>
          )}
        </div>

        {/* Manual Token Number or Backup Code Input */}
        <div className="space-y-2 pt-2 border-t border-stone-800">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'मैन्युअल टोकन नंबर या बैकअप कोड' : 'Manual Entry (Token # or Backup Code)'}</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 147 or AGRI-7K92M"
              className="flex-1 bg-stone-950 border-2 border-stone-700 focus:border-emerald-500 rounded-2xl p-3.5 text-sm font-bold text-white placeholder-stone-600 outline-hidden uppercase tracking-wider"
              onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
            />
            <button
              type="button"
              onClick={() => handleValidate()}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm rounded-2xl flex items-center gap-2 active:scale-95 shadow-md"
            >
              <span>{isHindi ? 'जांचें' : 'Validate'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Demo QR Emulation Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-stone-400 block mb-1.5">
            {isHindi ? 'त्वरित डेमो परीक्षण चिप्स:' : 'Quick Demo Tokens to test:'}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSimulateScan('147')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold active:scale-95"
            >
              #147 (Ram Kishan)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateScan('144')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold active:scale-95"
            >
              #144 (Jagjit Singh)
            </button>
            <button
              type="button"
              onClick={() => handleSimulateScan('AGRI-7K92M')}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-mono font-bold active:scale-95"
            >
              Backup: AGRI-7K92M
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
