import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Share2, 
  Users, 
  Activity, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Wheat,
  QrCode,
  AlertTriangle,
  RotateCcw,
  XCircle,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import Header from '../components/common/Header';
import { storage } from '../services/storage';
import { simulation } from '../services/simulation';
import { sharedStore } from '../phase2/store';
import WeatherAlertBanner from '../phase2/components/WeatherAlertBanner';

export default function TokenQRScreen({ tokenData, onNavigate, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appealSubmittedMsg, setAppealSubmittedMsg] = useState(null);
  const qrRef = useRef(null);

  const [storeState, setStoreState] = useState(sharedStore.getState());

  useEffect(() => {
    const unsub = sharedStore.subscribe((newState) => {
      setStoreState({ ...newState });
    });
    return () => unsub();
  }, []);

  const activeToken = tokenData || storage.getActiveToken() || {
    tokenNumber: 147,
    backupCode: 'AGRI-7K92M',
    centerName: 'Nilokheri Main Mandi',
    centerAddress: 'GT Road, Nilokheri, Karnal',
    date: 'Today, 24 Sep',
    slotTime: '11:00 AM - 12:30 PM',
    cropName: 'Wheat',
    quantity: 40
  };

  // Find live booking state in sharedStore to check if center rejected
  const liveBooking = storeState.bookings.find(b => b.tokenNumber === activeToken.tokenNumber) || activeToken;

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  const qrPayload = JSON.stringify({
    token: activeToken.tokenNumber,
    code: activeToken.backupCode,
    center: activeToken.centerName,
    date: activeToken.date,
    slot: activeToken.slotTime,
    crop: activeToken.cropName
  });

  const speakerText = t('token.speakerText', { token: activeToken.tokenNumber });

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeToken.backupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Farmer appeals & complaints
  const handleRequestRecheck = () => {
    sharedStore.submitFarmerRequest(
      'recheck',
      activeToken.tokenNumber,
      liveBooking.farmerName || 'Ram Kishan',
      liveBooking.mobile || '9812345678',
      activeToken.cropName,
      'Farmer requested urgent secondary grain sample moisture inspection.'
    );
    setAppealSubmittedMsg(
      isHindi 
        ? 'पुनः जांच अनुरोध खरीद केंद्र पर सफलतापूर्वक भेज दिया गया है।' 
        : 'Re-check request submitted to center manager.'
    );
  };

  const handleFileComplaint = () => {
    const text = window.prompt(
      isHindi ? 'अपनी शिकायत का विवरण दर्ज करें:' : 'Please enter your grievance details:',
      'Grain quality was within fair standard limits'
    );
    if (text) {
      sharedStore.submitFarmerRequest(
        'complaint',
        activeToken.tokenNumber,
        liveBooking.farmerName || 'Ram Kishan',
        liveBooking.mobile || '9812345678',
        activeToken.cropName,
        text
      );
      setAppealSubmittedMsg(
        isHindi 
          ? 'आपकी शिकायत दर्ज कर ली गई है एवं उच्चाधिकारी को अग्रेषित की गई है।' 
          : 'Complaint registered and forwarded to district mandi committee.'
      );
    }
  };

  const handleCancelConfirmed = () => {
    sharedStore.cancelBooking(activeToken.tokenNumber, 'farmer_self_cancel');
    storage.clearActiveToken();
    setShowCancelModal(false);
    onNavigate('home');
  };

  // Generate PNG on HTML5 Canvas
  const generateCanvasImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 780;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f5f5f4';
    ctx.fillRect(0, 0, 600, 780);

    // Header Background
    ctx.fillStyle = '#065f46';
    ctx.roundRect(24, 24, 552, 140, 24);
    ctx.fill();

    // App Name & Pass Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('AgriMinds - Mandi Gate Pass', 48, 68);

    // Token Number Hero
    ctx.fillStyle = '#fcd34d';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`#${activeToken.tokenNumber}`, 48, 128);

    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(24, 180, 552, 570, 24);
    ctx.fill();
    ctx.strokeStyle = '#e7e5e4';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw QR Code from SVG
    const svgElement = qrRef.current?.querySelector('svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 200, 205, 200, 200);
          URL.revokeObjectURL(blobURL);
          resolve();
        };
        img.src = blobURL;
      });
    }

    // Backup Code
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`Backup Code: ${activeToken.backupCode}`, 300, 440);

    // Details
    ctx.textAlign = 'left';
    ctx.fillStyle = '#44403c';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Mandi: ${activeToken.centerName}`, 48, 490);

    ctx.fillStyle = '#78716c';
    ctx.font = '14px sans-serif';
    ctx.fillText(`${activeToken.centerAddress}`, 48, 515);

    ctx.fillStyle = '#44403c';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Date: ${activeToken.date}`, 48, 555);
    ctx.fillText(`Slot Time: ${activeToken.slotTime}`, 48, 585);
    ctx.fillText(`Crop: ${activeToken.cropName} (${activeToken.quantity} Quintals)`, 48, 615);

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('✓ Valid for booked slot window (Works Offline)', 48, 665);

    ctx.fillStyle = '#a8a29e';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString('en-GB')}`, 48, 720);

    return canvas;
  };

  const handleSaveQR = async () => {
    try {
      setIsSaving(true);
      const canvas = await generateCanvasImage();
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mandi_Token_Pass_${activeToken.tokenNumber}.png`;
      link.href = imageUri;
      link.click();
    } catch (err) {
      console.error('Error saving QR image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareQR = async () => {
    try {
      const canvas = await generateCanvasImage();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `Mandi_Pass_${activeToken.tokenNumber}.png`, { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Mandi Token Pass #${activeToken.tokenNumber}`,
            text: `My AgriMinds Mandi Gate Pass for #${activeToken.tokenNumber} at ${activeToken.centerName} (${activeToken.slotTime})`,
            files: [file]
          });
        } else if (navigator.share) {
          await navigator.share({
            title: `Mandi Token Pass #${activeToken.tokenNumber}`,
            text: `AgriMinds Token #${activeToken.tokenNumber} at ${activeToken.centerName}. Slot: ${activeToken.date}, ${activeToken.slotTime}. Backup Code: ${activeToken.backupCode}`
          });
        } else {
          handleSaveQR();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Share error:', err);
      handleSaveQR();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <Header
        showBack={true}
        onBack={onBack}
        title={t('token.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="token"
      />

      <main className="p-4 space-y-3 flex-1 overflow-y-auto pb-6">
        {/* Appeal confirmation toast */}
        {appealSubmittedMsg && (
          <div className="p-3.5 bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{appealSubmittedMsg}</span>
          </div>
        )}

        {/* WEATHER RESCHEDULING ALERT BANNER */}
        <WeatherAlertBanner
          bookingDate={activeToken.date}
          forecastList={storeState.weatherForecast}
          onReschedule={() => onNavigate('centers')}
        />

        {/* QUALITY REJECTION NOTICE & 2 ACTION BUTTONS */}
        {liveBooking.status === 'rejected' && (
          <div className="bg-red-900 text-white p-4.5 rounded-3xl space-y-3 shadow-lg border border-red-500">
            <div className="flex items-center gap-2.5">
              <XCircle className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <h4 className="font-black text-sm">
                  {isHindi ? 'फसल गुणवत्ता अस्वीकृत' : 'Quality Check Rejected by Center'}
                </h4>
                <p className="text-xs text-red-200 mt-0.5">
                  <strong>{isHindi ? 'कारण: ' : 'Reason: '}</strong> {liveBooking.rejectionReason}
                  {liveBooking.rejectionNote && ` (${liveBooking.rejectionNote})`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleRequestRecheck}
                className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl font-black text-xs active:scale-95 shadow-sm"
              >
                {isHindi ? 'पुनः जांच का अनुरोध' : 'Request Re-check'}
              </button>
              <button
                type="button"
                onClick={handleFileComplaint}
                className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white border border-stone-700 rounded-xl font-bold text-xs active:scale-95"
              >
                {isHindi ? 'शिकायत दर्ज करें' : 'File Complaint'}
              </button>
            </div>
          </div>
        )}

        {/* COMPACT ALL-IN-ONE QR PASS CARD */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-stone-200 text-center space-y-3">
          {/* Header Banner inside card */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">
                {t('token.gatePass')}
              </span>
              <div className="text-2xl font-black text-amber-300 tracking-tight">
                #{activeToken.tokenNumber}
              </div>
            </div>
            <div className="text-right text-xs text-emerald-100 font-semibold">
              <div>{activeToken.date}</div>
              <div className="text-amber-300 font-bold">{activeToken.slotTime}</div>
            </div>
          </div>

          {/* QR Code Container */}
          <div ref={qrRef} className="inline-block p-3 bg-white rounded-2xl border-2 border-stone-200 shadow-inner">
            <QRCodeSVG
              value={qrPayload}
              size={150}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Backup Code */}
          <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold text-stone-500 block">{t('token.backupCode')}</span>
              <span className="font-mono text-base font-black text-stone-900 tracking-wider">
                {activeToken.backupCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 text-stone-600 hover:text-emerald-700 bg-white rounded-xl border border-stone-200 active:scale-95"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Center & Crop Details Strip */}
          <div className="text-left space-y-1 text-xs pt-1 border-t border-stone-100">
            <div className="font-bold text-stone-900 line-clamp-1">
              📍 {activeToken.centerName}
            </div>
            <div className="text-[11px] text-stone-500 truncate">
              {activeToken.centerAddress}
            </div>
            <div className="flex justify-between text-[11px] font-bold text-stone-700 pt-0.5">
              <span>🌾 {activeToken.cropName} ({activeToken.quantity} {t('common.quintal')})</span>
              <span className="text-emerald-700">✓ {t('token.qrValidUntil')}</span>
            </div>
          </div>
        </div>

        {/* SAVE QR & SHARE BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleSaveQR}
            disabled={isSaving}
            className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform"
          >
            <Download className="w-4 h-4" />
            <span>{isSaving ? t('common.loading') : t('token.saveQR')}</span>
          </button>

          <button
            type="button"
            onClick={handleShareQR}
            className="py-3 px-4 bg-stone-900 hover:bg-stone-800 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-transform"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{t('token.shareQR')}</span>
          </button>
        </div>

        {/* Next Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onNavigate('queue')}
            className="p-3 bg-white border border-stone-200 hover:border-emerald-600 text-stone-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{t('token.btnViewQueue')}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tracker')}
            className="p-3 bg-white border border-stone-200 hover:border-blue-600 text-stone-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Activity className="w-4 h-4 text-blue-700" />
            <span>{t('token.btnStageTracker')}</span>
          </button>
        </div>

        {/* Reschedule & Cancel Actions for Farmers */}
        <div className="flex items-center justify-between pt-2 px-1 text-xs">
          <button
            type="button"
            onClick={() => onNavigate('centers')}
            className="text-emerald-800 hover:underline font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isHindi ? 'स्लॉट री-शेड्यूल करें' : 'Reschedule Slot'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="text-red-600 hover:underline font-bold flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{isHindi ? 'बुकिंग रद्द करें' : 'Cancel Booking'}</span>
          </button>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-stone-300">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-stone-900">
                {isHindi ? 'बुकिंग रद्द करें?' : 'Cancel Slot Booking?'}
              </h3>
              <p className="text-xs text-stone-500">
                {isHindi 
                  ? 'कोई जुर्माना नहीं है। यह स्लॉट प्रतीक्षा सूची के किसान को दिया जाएगा।' 
                  : 'No penalty. The freed slot will be offered to the waitlist.'}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCancelConfirmed}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl active:scale-95 shadow-sm"
              >
                <span>{isHindi ? 'हाँ, बुकिंग रद्द करें' : 'Yes, Cancel Slot'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-full py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-200"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

