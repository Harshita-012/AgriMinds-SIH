import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Search
} from 'lucide-react';
import Header from '../components/common/Header';
import SpeakerButton from '../components/common/SpeakerButton';
import CropTile from '../components/common/CropTile';
import { storage } from '../services/storage';
import { speech } from '../services/speech';
import { CROPS, CROP_CATEGORIES, getDistrictsByState } from '../data/mockData';

export default function RegistrationScreen({ onComplete, onBack }) {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [cardUploaded, setCardUploaded] = useState(false);
  const [cardStatus, setCardStatus] = useState('none'); // 'none' | 'pending' | 'verified'

  // Crop picker state
  const [selectedCropIds, setSelectedCropIds] = useState(['wheat']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cropSearchQuery, setCropSearchQuery] = useState('');

  const savedState = storage.getState() || 'Haryana';
  const availableDistricts = getDistrictsByState(savedState);
  const defaultDistrict = availableDistricts[0] || 'Karnal';

  // Form State
  const [formData, setFormData] = useState({
    mobile: '9812345678',
    fullName: '',
    state: savedState,
    district: defaultDistrict,
    village: 'Nilokheri',
    landSize: '4.5',
    kisanCardNumber: ''
  });

  useEffect(() => {
    if (savedState) {
      setFormData(prev => ({
        ...prev,
        state: savedState,
        district: availableDistricts[0] || prev.district
      }));
    }
  }, [savedState]);

  const speakerText = currentStep === 3
    ? t('cropSelect.speakerText')
    : t('registration.speakerText');

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpValue('1234'); // Auto fill demo OTP
  };

  const handleVerifyOtp = () => {
    if (otpValue === '1234' || otpValue.length === 4) {
      setIsOtpVerified(true);
    }
  };

  const handleSimulateKisanCardUpload = () => {
    setCardStatus('pending');
    setTimeout(() => {
      setCardStatus('verified');
      setCardUploaded(true);
      setFormData(prev => ({
        ...prev,
        fullName: 'Rameshwar Dayal',
        village: 'Nilokheri',
        kisanCardNumber: 'XXXX-XXXX-8921'
      }));
    }, 1000);
  };

  const handleQuickDemoFill = () => {
    setOtpSent(true);
    setOtpValue('1234');
    setIsOtpVerified(true);
    setCardUploaded(true);
    setCardStatus('verified');
    setFormData({
      mobile: '9876543210',
      fullName: 'Baldev Singh',
      state: savedState,
      district: availableDistricts[0] || 'Karnal',
      village: 'Taraori',
      landSize: '5.0',
      kisanCardNumber: 'XXXX-XXXX-7341'
    });
    setSelectedCropIds(['wheat', 'mustard']);
  };

  const handleToggleCrop = (crop) => {
    const cropName = t(crop.nameKey);
    // Read crop name aloud in selected language
    speech.speak(cropName, i18n.language);

    setSelectedCropIds(prev => {
      if (prev.includes(crop.id)) {
        return prev.filter(id => id !== crop.id);
      } else {
        return [...prev, crop.id];
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!isOtpVerified) {
        setIsOtpVerified(true);
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.fullName) {
        setFormData(prev => ({ ...prev, fullName: 'Farmer' }));
      }
      setCurrentStep(3);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (selectedCropIds.length === 0) return;

    const userProfile = {
      ...formData,
      crops: selectedCropIds,
      crop: selectedCropIds[0], // Primary crop
      registeredAt: new Date().toISOString(),
      cardStatus: cardStatus === 'verified' ? 'verified' : 'unverified'
    };
    storage.saveUser(userProfile);
    onComplete(userProfile);
  };

  const handleBackClick = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  // Filter crops by category & search
  const filteredCrops = CROPS.filter(crop => {
    const matchesCategory = activeCategory === 'all' || crop.category === activeCategory;
    const cropName = t(crop.nameKey).toLowerCase();
    const query = cropSearchQuery.toLowerCase().trim();
    const matchesSearch = !query || cropName.includes(query) || crop.id.includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <Header
        showBack={true}
        onBack={handleBackClick}
        title={t('registration.title')}
        screenSpeakerText={speakerText}
      />

      <main className="p-4 space-y-3.5 flex-1 overflow-y-auto pb-8">
        {/* Step Progress Indicator */}
        <div className="bg-white p-3.5 rounded-3xl border border-stone-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">
              {t('common.step', { current: currentStep, total: 3 })}
            </span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl hover:bg-emerald-100 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('registration.quickFillDemo')}</span>
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'w-8 bg-emerald-700'
                    : step < currentStep
                    ? 'w-4 bg-emerald-500'
                    : 'w-4 bg-stone-200'
                }`}
              />
            ))}
          </div>

          <h2 className="text-base font-extrabold text-stone-900">
            {currentStep === 1 && t('registration.step1Title')}
            {currentStep === 2 && t('registration.step2Title')}
            {currentStep === 3 && t('registration.step3Title')}
          </h2>
        </div>

        {/* STEP 1: Mobile & OTP */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="card-farmer space-y-3">
              <label className="block text-sm font-bold text-stone-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>{t('registration.mobileLabel')}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder={t('registration.mobilePlaceholder')}
                  className="flex-1 px-4 py-3 bg-stone-50 border-2 border-stone-300 rounded-2xl font-bold text-lg text-stone-900 focus:border-emerald-600 focus:bg-white outline-none"
                  required
                />
                {!isOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-4 py-3 bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm hover:bg-emerald-800 shrink-0 active:scale-95"
                  >
                    {t('registration.sendOtp')}
                  </button>
                )}
              </div>

              {/* OTP Box */}
              {otpSent && !isOtpVerified && (
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                      {t('registration.otpLabel')}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold">
                      {t('registration.otpHint')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      className="w-32 px-3 py-2 bg-white border-2 border-amber-400 rounded-xl font-black text-center text-lg tracking-widest outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs active:scale-95"
                    >
                      {t('registration.verifyOtp')}
                    </button>
                  </div>
                </div>
              )}

              {isOtpVerified && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('registration.otpVerified')}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full btn-primary text-lg py-4"
            >
              <span>{t('common.next')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Name, Location, Land Size & Card */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="card-farmer space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>{t('registration.fullName')}</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t('registration.fullNamePlaceholder')}
                  className="w-full px-4 py-2.5 bg-stone-50 border-2 border-stone-300 rounded-2xl font-bold text-stone-900 focus:border-emerald-600 focus:bg-white outline-none"
                  required
                />
              </div>

              {/* State & District */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('registration.state')}</span>
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.state}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-xl font-bold text-xs text-stone-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('registration.district')}</label>
                  {availableDistricts.length > 0 ? (
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border-2 border-stone-300 rounded-xl font-bold text-xs text-stone-900 outline-none"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder={t('registration.districtPlaceholder')}
                      className="w-full px-3 py-2 bg-stone-50 border-2 border-stone-300 rounded-xl font-bold text-xs text-stone-900 outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Village & Land Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('registration.village')}</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder={t('registration.villagePlaceholder')}
                    className="w-full px-3 py-2 bg-stone-50 border-2 border-stone-300 rounded-xl font-bold text-xs text-stone-900 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">{t('registration.landSize')}</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="100"
                      value={formData.landSize}
                      onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border-2 border-stone-300 rounded-xl font-bold text-xs text-stone-900 outline-none"
                      required
                    />
                    <span className="text-xs font-bold text-stone-500 shrink-0">{t('common.acres')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Kisan Card Upload */}
            <div className="card-farmer space-y-2.5 bg-emerald-50/30 border-emerald-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>{t('registration.kisanCardSection')}</span>
                </label>
                {cardStatus === 'verified' && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    {t('common.verified')}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSimulateKisanCardUpload}
                className="w-full py-2.5 px-3 border border-dashed border-emerald-600 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <Upload className="w-4 h-4" />
                <span>{t('registration.uploadCardBtn')}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 btn-secondary text-sm py-3.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 btn-primary text-base py-3.5"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Dedicated Crop Selection with <CropTile> Picker */}
        {currentStep === 3 && (
          <div className="space-y-3.5">
            {/* Minimal Header & Speaker */}
            <div className="bg-emerald-800 text-white rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-lg font-extrabold">{t('cropSelect.title')}</h3>
                <p className="text-xs text-emerald-200 font-medium">{t('cropSelect.subtitle')}</p>
              </div>
              <SpeakerButton textToRead={t('cropSelect.speakerText')} size="sm" />
            </div>

            {/* Category Tabs on Top */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {t(cat.nameKey)}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                value={cropSearchQuery}
                onChange={(e) => setCropSearchQuery(e.target.value)}
                placeholder={t('cropSelect.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-2xl text-xs font-semibold text-stone-900 outline-none focus:border-emerald-600 shadow-inner"
              />
            </div>

            {/* Grid of Large Crop Picture Tiles */}
            <div className="grid grid-cols-3 gap-2.5 max-h-[38vh] overflow-y-auto pr-0.5 py-1">
              {filteredCrops.map((crop) => {
                const isSelected = selectedCropIds.includes(crop.id);
                return (
                  <CropTile
                    key={crop.id}
                    crop={crop}
                    isSelected={isSelected}
                    onToggle={handleToggleCrop}
                  />
                );
              })}
            </div>

            {filteredCrops.length === 0 && (
              <p className="text-xs text-stone-500 text-center py-6">
                {t('cropSelect.noResults')}
              </p>
            )}

            {/* Navigation & Submit Button (Disabled until at least 1 crop selected) */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 btn-secondary text-sm py-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('common.back')}</span>
              </button>

              <button
                type="button"
                disabled={selectedCropIds.length === 0}
                onClick={handleSubmit}
                className={`flex-1 text-base py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-sm transition-all ${
                  selectedCropIds.length > 0
                    ? 'btn-primary'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('cropSelect.continueBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
