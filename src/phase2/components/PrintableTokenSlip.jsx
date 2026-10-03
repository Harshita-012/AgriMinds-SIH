import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Download, CheckCircle2 } from 'lucide-react';

export default function PrintableTokenSlip({ booking, isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const printRef = useRef(null);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    token: booking.tokenNumber,
    code: booking.backupCode,
    center: booking.centerName,
    date: booking.date,
    slot: booking.slotTime,
    crop: booking.cropName
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white text-stone-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-300 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm">
              {isHindi ? 'मंडी टोकन पर्ची (प्रिंट / रसीद)' : 'Mandi Gate Token Slip'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="p-6 overflow-y-auto space-y-4 printable-slip bg-white">
          {/* Slip Header */}
          <div className="border-b-2 border-dashed border-stone-300 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-black text-emerald-800">AgriMinds</span>
              <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                {isHindi ? 'गेट पास' : 'Gate Pass'}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-700">{booking.centerName}</p>
            <p className="text-[11px] text-stone-500">
              {booking.date} | {booking.slotTime}
            </p>
          </div>

          {/* Token Hero */}
          <div className="text-center py-2 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              {isHindi ? 'टोकन संख्या' : 'Token Number'}
            </span>
            <div className="text-4xl font-black text-emerald-900 tracking-tight">
              #{booking.tokenNumber}
            </div>
            <div className="text-xs font-mono font-bold text-stone-700">
              {isHindi ? 'बैकअप कोड: ' : 'Backup Code: '}
              <span className="bg-white px-2 py-0.5 rounded border border-stone-200">
                {booking.backupCode}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-200">
            <QRCodeSVG value={qrPayload} size={130} level="M" />
            <span className="text-[10px] text-stone-400 mt-2 font-medium">
              {isHindi ? 'गेट स्कैनर पर दिखाएं (ऑफ़लाइन मान्य)' : 'Scan at entry gate (Works offline)'}
            </span>
          </div>

          {/* Details Table */}
          <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 text-xs space-y-1.5 divide-y divide-stone-200/60">
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{isHindi ? 'किसान का नाम' : 'Farmer Name'}:</span>
              <span className="font-bold text-stone-900">{booking.farmerName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{isHindi ? 'मोबाइल' : 'Mobile'}:</span>
              <span className="font-bold text-stone-900">{booking.mobile}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{isHindi ? 'फसल एवं मात्रा' : 'Crop & Quantity'}:</span>
              <span className="font-bold text-emerald-800">
                {booking.cropName} ({booking.quantity} {t('common.quintal')})
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">{isHindi ? 'किसान कार्ड (मास्क)' : 'Kisan Card'}:</span>
              <span className="font-mono font-bold text-stone-700">
                {booking.kisanCardMasked || '••••-••••-8921'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-center text-stone-400 pt-1 border-t border-dashed border-stone-300">
            {isHindi ? 'कृपया निर्धारित समय पर मंडी गेट पर पहुंचें। 30 मिनट ग्रेस समय।' : 'Arrive on time. 30-minute grace window.'}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'पर्ची प्रिंट करें' : 'Print Slip'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-sm rounded-2xl active:scale-95"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
