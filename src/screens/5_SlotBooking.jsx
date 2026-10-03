import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Clock, 
  Wheat, 
  CheckCircle2, 
  ArrowRight, 
  MapPin,
  Lock,
  Check,
  Edit2,
  X,
  BellRing,
  Sparkles
} from 'lucide-react';
import Header from '../components/common/Header';
import { storage } from '../services/storage';
import { CROPS, TIME_SLOTS } from '../data/mockData';
import { sharedStore } from '../phase2/store';
import { weatherService, WEATHER_TYPES } from '../phase2/weather';

export default function SlotBookingScreen({ center, onBookingConfirmed, onNavigate, onBack, isRescheduling = false, oldToken = null }) {
  const { t, i18n } = useTranslation();
  const user = storage.getUser() || {};
  const isHindi = i18n.language.startsWith('hi');
  const storeState = sharedStore.getState();

  // Next 4 days date generation with weather integration
  const today = new Date();
  const next4Days = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayNameHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'][d.getDay()];
    const dayNameEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    const dateFormatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const weather = weatherService.getWeatherForDay(i, storeState.weatherForecast);
    
    return {
      index: i,
      rawDate: d.toISOString().split('T')[0],
      displayDay: isHindi ? dayNameHi : dayNameEn,
      displayDate: dateFormatted,
      isToday: i === 0,
      weather
    };
  });

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [cropId, setCropId] = useState(user.crop || (user.crops && user.crops[0]) || 'wheat');
  const [quantityQuintals, setQuantityQuintals] = useState(40);
  const [selectedSlotId, setSelectedSlotId] = useState('s1');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCropPickerModal, setShowCropPickerModal] = useState(false);
  const [joinedWaitlistMsg, setJoinedWaitlistMsg] = useState(null);

  const selectedDay = next4Days[selectedDayIdx];
  const selectedCrop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const selectedSlot = TIME_SLOTS.find(s => s.id === selectedSlotId) || TIME_SLOTS[0];

  const estimatedMins = Math.round(
    selectedCrop.baseMinutes + (quantityQuintals * selectedCrop.extraMinPerQuintal)
  );

  const speakerText = t('booking.speakerText');
  const centerName = isHindi ? center.nameHi : center.nameEn;

  const handleJoinWaitlist = (slot) => {
    const waitlistEntry = sharedStore.joinWaitlist({
      centerId: center.id,
      centerName,
      date: `${selectedDay.displayDay}, ${selectedDay.displayDate}`,
      slotId: slot.id,
      slotTime: slot.time,
      farmerName: user.fullName || 'Ram Kishan',
      mobile: user.mobile || '9812345678',
      kisanCardMasked: user.kisanCardNumber || '••••-••••-8921',
      cropId: selectedCrop.id,
      cropName: t(selectedCrop.nameKey),
      quantity: quantityQuintals,
      landSize: user.landSize || 4.5
    });

    setJoinedWaitlistMsg(
      isHindi 
        ? `आप ${slot.time} स्लॉट की प्रतीक्षा सूची में स्थान #${waitlistEntry.position} पर शामिल हो गए हैं। स्लॉट खुलते ही SMS मिलेगा!`
        : `You are #${waitlistEntry.position} on the waitlist for ${slot.time}. You'll be notified immediately via SMS when capacity opens!`
    );
  };

  const handleConfirm = () => {
    if (isRescheduling && oldToken) {
      sharedStore.rescheduleBooking(
        oldToken.tokenNumber,
        `${selectedDay.displayDay}, ${selectedDay.displayDate}`,
        selectedSlot.time,
        'weather'
      );
      const updatedToken = {
        ...oldToken,
        date: `${selectedDay.displayDay}, ${selectedDay.displayDate}`,
        slotTime: selectedSlot.time
      };
      storage.saveActiveToken(updatedToken);
      setShowConfirmModal(false);
      onBookingConfirmed(updatedToken);
      return;
    }

    const tokenNumber = Math.floor(145 + Math.random() * 20);
    const backupCode = 'AGRI-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const bookingPayload = {
      tokenNumber,
      backupCode,
      centerId: center.id,
      centerName,
      centerAddress: isHindi ? center.addressHi : center.addressEn,
      date: `${selectedDay.displayDay}, ${selectedDay.displayDate}`,
      slotTime: selectedSlot.time,
      slotId: selectedSlot.id,
      farmerName: user.fullName || 'Ram Kishan',
      mobile: user.mobile || '9812345678',
      kisanCardMasked: user.kisanCardNumber || '••••-••••-8921',
      cropId: selectedCrop.id,
      cropName: t(selectedCrop.nameKey),
      quantity: quantityQuintals,
      landSize: user.landSize || 4.5,
      status: 'booked',
      currentStageId: 1,
      estimatedMins,
      createdAt: new Date().toISOString()
    };

    // Save to local storage & sharedStore
    storage.saveActiveToken(bookingPayload);
    sharedStore.state.bookings.push(bookingPayload);
    sharedStore.addAuditLog(
      'Farmer (Self-Service)',
      'Slot Booked Online',
      `${bookingPayload.farmerName} (#${tokenNumber})`,
      `Booked ${bookingPayload.cropName} (${quantityQuintals} q) for ${bookingPayload.date} at ${bookingPayload.slotTime}.`
    );
    sharedStore.sendSMS(
      bookingPayload.mobile,
      `AgriMinds: Booking confirmed for ${bookingPayload.centerName}. Date: ${bookingPayload.date}, Time: ${bookingPayload.slotTime}. Token #${tokenNumber}, Code: ${backupCode}`,
      'booking'
    );
    sharedStore.saveState();

    setShowConfirmModal(false);
    onBookingConfirmed(bookingPayload);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <Header
        showBack={true}
        onBack={onBack}
        title={isRescheduling ? (isHindi ? 'स्लॉट री-शेड्यूल' : 'Reschedule Slot') : t('booking.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="booking"
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-10">
        {/* Joined Waitlist Toast */}
        {joinedWaitlistMsg && (
          <div className="p-4 bg-blue-900 text-white rounded-3xl text-xs font-bold flex items-start gap-3 shadow-md border border-blue-400 animate-fadeIn">
            <BellRing className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-extrabold block text-sm">{isHindi ? 'प्रतीक्षा सूची पुष्ट' : 'Waitlist Joined'}</span>
              <p className="font-normal text-blue-100">{joinedWaitlistMsg}</p>
            </div>
            <button onClick={() => setJoinedWaitlistMsg(null)} className="ml-auto text-blue-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Selected Center Pill */}
        <div className="bg-emerald-800 text-white p-3.5 rounded-3xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider block">
              {t('booking.selectedCenter')}
            </span>
            <h3 className="font-extrabold text-sm line-clamp-1">{centerName}</h3>
          </div>
          <div className="text-xs text-emerald-100 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('common.distanceKm', { count: center.distanceKm })}</span>
          </div>
        </div>

        {/* DAY TABS WITH WEATHER ICONS */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>{t('booking.step1Date')}</span>
          </label>

          <div className="grid grid-cols-4 gap-2">
            {next4Days.map((d) => {
              const isSelected = selectedDayIdx === d.index;
              const hasRain = !d.weather.safe;

              return (
                <button
                  key={d.index}
                  type="button"
                  onClick={() => setSelectedDayIdx(d.index)}
                  className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-between min-h-[76px] ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-700 text-white font-black shadow-md scale-[1.02]'
                      : 'border-stone-200 bg-white text-stone-700 font-bold hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px]">
                    <span>{d.weather.icon}</span>
                    <span className="opacity-90">{d.isToday ? t('booking.today') : d.displayDay}</span>
                  </div>
                  <span className="text-sm font-extrabold">{d.displayDate}</span>
                  {hasRain ? (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-amber-300 text-stone-950' : 'bg-red-100 text-red-700'
                    }`}>
                      {isHindi ? 'बारिश' : 'Rain'}
                    </span>
                  ) : (
                    <span className="text-[9px] opacity-70">{d.weather.temp}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Crop with Edit Icon */}
        <div className="card-farmer space-y-3">
          <div className="flex items-center justify-between">
            {/* Selected crop chip with edit icon */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <Wheat className="w-4 h-4 text-amber-600" />
                <span>{t(selectedCrop.nameKey)}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCropPickerModal(true)}
                className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-50 bg-stone-100 flex items-center gap-1 text-[11px] font-bold border border-emerald-200"
                title={t('cropSelect.changeCrop')}
              >
                <Edit2 className="w-3 h-3" />
                <span>{t('cropSelect.changeCrop')}</span>
              </button>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              ₹{selectedCrop.msp} / {t('common.quintal')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantityQuintals(Math.max(5, quantityQuintals - 5))}
              className="w-11 h-11 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-900 font-black text-xl flex items-center justify-center active:scale-95"
            >
              -
            </button>
            <div className="flex-1 py-2 bg-stone-50 border border-stone-300 rounded-2xl text-center">
              <span className="text-xl font-black text-stone-900">{quantityQuintals}</span>
              <span className="text-xs font-bold text-stone-500 ml-1">{t('common.quintal')}</span>
            </div>
            <button
              type="button"
              onClick={() => setQuantityQuintals(Math.min(300, quantityQuintals + 5))}
              className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xl flex items-center justify-center active:scale-95 shadow-xs"
            >
              +
            </button>
          </div>

          <div className="text-[11px] text-stone-500 font-medium text-center">
            {t('booking.estDuration', { mins: estimatedMins })}
          </div>
        </div>

        {/* TIME CHIPS WITH WAITLIST ACTION */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{t('booking.step3Slot')}</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const isFull = slot.status === 'full';
              const isWalkIn = slot.isWalkInOnly;

              return (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between min-h-[84px] ${
                    isWalkIn
                      ? 'bg-stone-100 border-stone-200 text-stone-400 opacity-60'
                      : isFull
                      ? 'bg-amber-50/50 border-amber-300 text-stone-900'
                      : isSelected
                      ? 'bg-emerald-50 border-emerald-700 text-emerald-950 font-black shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
                  }`}
                  onClick={() => !isFull && !isWalkIn && setSelectedSlotId(slot.id)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-xs">{slot.time}</span>
                    {isSelected && !isFull && !isWalkIn && (
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                    )}
                    {isWalkIn && <Lock className="w-3.5 h-3.5 text-stone-400" />}
                  </div>
                  
                  <div className="mt-1 flex items-center justify-between">
                    {isWalkIn ? (
                      <span className="text-[10px] text-stone-500 font-bold">{t('booking.slotWalkIn')}</span>
                    ) : isFull ? (
                      <div className="flex items-center justify-between w-full pt-1">
                        <span className="text-[10px] text-red-600 font-bold">{t('booking.slotBooked')}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinWaitlist(slot);
                          }}
                          className="px-2 py-0.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-[10px] font-bold active:scale-95 shadow-xs"
                        >
                          {isHindi ? 'वेटलिस्ट जुड़ें' : 'Join Waitlist'}
                        </button>
                      </div>
                    ) : isSelected ? (
                      <span className="text-[10px] font-bold text-emerald-700">{t('booking.selected')}</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600">{t('booking.slotAvailable')}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          className="w-full btn-primary text-base py-4 mt-2"
        >
          <span>{isRescheduling ? (isHindi ? 'री-शेड्यूल पक्का करें' : 'Confirm Reschedule') : t('booking.btnConfirm')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </main>

      {/* Change Crop Modal */}
      {showCropPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-extrabold text-base text-stone-900">{t('cropSelect.title')}</h3>
              <button
                type="button"
                onClick={() => setShowCropPickerModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto p-1">
              {CROPS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCropId(c.id);
                    setShowCropPickerModal(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    cropId === c.id
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-black ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <span className="text-xs font-bold block">{t(c.nameKey)}</span>
                    <span className="text-[10px] text-stone-500">₹{c.msp}/q</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border border-stone-300">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-stone-900">
                {t('booking.confirmModalTitle')}
              </h3>
              <p className="text-xs text-stone-500">
                {t('booking.confirmNotice')}
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs font-semibold text-stone-800">
              <div className="flex justify-between">
                <span className="text-stone-500">{t('booking.centerLabel')}:</span>
                <span className="font-bold text-right truncate max-w-[180px]">{centerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{t('booking.dateLabel')}:</span>
                <span className="font-bold">{selectedDay.displayDay}, {selectedDay.displayDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{t('booking.timeLabel')}:</span>
                <span className="font-bold text-emerald-800">{selectedSlot.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{t('booking.cropLabel')}:</span>
                <span className="font-bold">{t(selectedCrop.nameKey)} ({quantityQuintals} {t('common.quintal')})</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full btn-primary text-base"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('booking.btnConfirm')}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-2 text-stone-500 hover:text-stone-800 font-bold text-xs"
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
