import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserPlus, 
  Printer, 
  CheckCircle2, 
  Wheat, 
  MapPin, 
  Phone, 
  CreditCard,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { CROPS } from '../../../data/mockData';
import { sharedStore } from '../../store';
import PrintableTokenSlip from '../../components/PrintableTokenSlip';

export default function WalkInBookingView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const centerId = adminSession?.centerId || 'center-1';
  const centerName = isHindi 
    ? adminSession?.centerNameHi || adminSession?.centerNameEn 
    : adminSession?.centerNameEn;
  const staffName = adminSession?.staffName || 'Center Staff';

  const [formData, setFormData] = useState({
    farmerName: '',
    mobile: '',
    cropId: 'wheat',
    quantity: 35,
    landSize: 2.0,
    cardNumber: '9821'
  });

  const [createdSlip, setCreatedSlip] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.mobile) return;

    const cropObj = CROPS.find(c => c.id === formData.cropId) || CROPS[0];
    const newBooking = sharedStore.createWalkInBooking({
      centerId,
      centerName,
      date: 'Today, 24 Sep',
      slotTime: '04:30 PM - 06:00 PM (Walk-in)',
      farmerName: formData.farmerName,
      mobile: formData.mobile,
      cropId: cropObj.id,
      cropName: t(cropObj.nameKey),
      quantity: formData.quantity,
      landSize: formData.landSize,
      cardNumber: formData.cardNumber
    }, staffName);

    setCreatedSlip(newBooking);
    setShowSlipModal(true);

    // Reset form
    setFormData({
      farmerName: '',
      mobile: '',
      cropId: 'wheat',
      quantity: 35,
      landSize: 2.0,
      cardNumber: '9821'
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-1">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
          <UserPlus className="w-4 h-4" />
          <span>{isHindi ? 'सहायता प्राप्त वॉक-इन डेस्क' : 'Assisted Walk-In Desk'}</span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'वॉक-इन किसान स्लॉट बुकिंग' : 'Assisted Walk-in Booking'}
        </h2>
        <p className="text-xs text-stone-400">
          {isHindi 
            ? 'बिना स्मार्टफोन वाले किसानों के लिए 15% आरक्षित कोटे से तत्काल पर्ची और क्यूआर पास जारी करें।' 
            : 'Issue instant gate token slips for walk-in farmers without smartphones from reserved quota.'}
        </p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Farmer Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              {isHindi ? 'किसान का पूरा नाम' : 'Farmer Full Name'} *
            </label>
            <input
              type="text"
              required
              value={formData.farmerName}
              onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
              placeholder={isHindi ? 'उदा. जसपाल सिंह' : 'e.g. Jaspal Singh'}
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-bold text-white placeholder-stone-600 outline-hidden"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              {isHindi ? 'मोबाइल नंबर (SMS सूचना हेतु)' : 'Mobile Number'} *
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="98XXXXXXXX"
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-bold text-white placeholder-stone-600 outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Crop Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              {isHindi ? 'फसल' : 'Crop'}
            </label>
            <select
              value={formData.cropId}
              onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-bold text-white outline-hidden"
            >
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {t(c.nameKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              {isHindi ? 'मात्रा (क्विंटल)' : 'Quantity (Quintals)'}
            </label>
            <input
              type="number"
              min={5}
              max={300}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-bold text-white outline-hidden"
            />
          </div>

          {/* Land Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300">
              {isHindi ? 'भूमि रकबा (एकड़)' : 'Land Size (Acres)'}
            </label>
            <input
              type="number"
              step="0.5"
              min={0.5}
              value={formData.landSize}
              onChange={(e) => setFormData({ ...formData, landSize: Number(e.target.value) })}
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-bold text-white outline-hidden"
            />
          </div>
        </div>

        {/* Kisan Card Last 4 Digits */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300">
            {isHindi ? 'पहचान पत्र / किसान कार्ड अंतिम 4 अंक' : 'Kisan Card / ID Last 4 Digits'}
          </label>
          <input
            type="text"
            maxLength={4}
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            placeholder="8921"
            className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl p-3 text-xs font-mono font-bold text-white outline-hidden"
          />
        </div>

        {/* Assigned Walk-in Slot Info */}
        <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs flex items-center justify-between text-stone-300">
          <div>
            <span className="text-[10px] text-stone-500 block uppercase font-bold">
              {isHindi ? 'आवंटित स्लॉट' : 'Assigned Quota Window'}
            </span>
            <span className="font-bold text-white">04:30 PM - 06:00 PM (Reserved Walk-in)</span>
          </div>
          <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 font-bold rounded-xl text-[10px]">
            {isHindi ? 'तत्काल गेट पास' : 'Instant Pass'}
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Printer className="w-5 h-5" />
          <span>{isHindi ? 'टोकन जारी करें एवं पर्ची प्रिंट करें' : 'Generate Token & Print Slip'}</span>
        </button>
      </form>

      {/* Printable Slip Modal */}
      <PrintableTokenSlip
        booking={createdSlip}
        isOpen={showSlipModal}
        onClose={() => setShowSlipModal(false)}
      />
    </div>
  );
}
