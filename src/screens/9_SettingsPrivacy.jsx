import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  ShieldCheck, 
  Trash2, 
  LogOut, 
  User, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Building2,
  Landmark,
  FileText
} from 'lucide-react';
import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import { storage } from '../services/storage';
import { sharedStore } from '../phase2/store';
import { SUPPORTED_LANGUAGES, getLanguageConfig } from '../i18n/languages';

export default function SettingsPrivacyScreen({ onNavigate, onLogout, onBack, userRole = 'farmer' }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(0); // 0 = closed, 1 = warning dialog, 2 = final confirmation
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Check current session context if not explicitly passed
  const adminSession = sharedStore.getAdminSession();
  const isStaff = userRole === 'center_staff' || (adminSession?.role === 'center_staff');
  const isGovt = userRole === 'govt_official' || (adminSession?.role === 'govt_official');
  const isAdmin = isStaff || isGovt;

  const user = storage.getUser() || {
    fullName: 'Farmer',
    mobile: '9812345678',
    district: 'Karnal',
    state: 'Haryana',
    village: 'Nilokheri',
    crop: 'wheat',
    landSize: '4.5',
    kisanCardNumber: 'XXXX-XXXX-8921'
  };

  const consentRecord = storage.getConsent() || {
    formattedDate: new Date().toLocaleString('en-IN'),
    version: '1.0'
  };

  // Mask Kisan Card strictly to last 4 digits
  const getMaskedCard = (cardStr) => {
    if (!cardStr) return '••••-••••-8921';
    const digits = cardStr.replace(/\D/g, '');
    const last4 = digits.length >= 4 ? digits.slice(-4) : (cardStr.slice(-4) || '8921');
    return `••••-••••-${last4}`;
  };

  const speakerText = t('settings.speakerText');

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    storage.setLang(code);
    const langObj = getLanguageConfig(code);
    document.documentElement.dir = langObj.dir || 'ltr';
    document.documentElement.lang = code;
  };

  const handleWithdrawConsent = () => {
    storage.withdrawConsent();
    setShowWithdrawModal(false);
    if (onLogout) onLogout();
    else if (onNavigate) onNavigate('portal_choice');
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (isAdmin) {
      sharedStore.clearAdminSession();
    } else {
      storage.setFarmerSessionActive(false);
    }
    if (onLogout) onLogout();
    else if (onNavigate) onNavigate('portal_choice');
  };

  const handleFinalDelete = () => {
    // 1. Erase from shared store & real-time sync with Mandi Center terminals
    sharedStore.deleteFarmerData(user.mobile, user.kisanCardNumber);

    // 2. Erase all local farmer storage and cache
    storage.deleteAllData();

    setDeleteStep(0);

    // 3. Reset app to Language screen as fresh install
    if (onNavigate) {
      onNavigate('language');
    } else if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto relative font-sans">
      <Header
        showBack={true}
        onBack={onBack}
        title={isAdmin ? (isGovt ? t('settings.govtTitle') : t('settings.staffTitle')) : t('settings.title')}
        screenSpeakerText={speakerText}
        onNavigate={onNavigate}
        currentScreen="settings"
      />

      <main className="p-4 space-y-4 flex-1 overflow-y-auto pb-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900">
            {isAdmin ? (isGovt ? t('settings.govtTitle') : t('settings.staffTitle')) : t('settings.farmerTitle')}
          </h2>
          {isAdmin && (
            <span className="text-[10px] font-bold px-2.5 py-1 bg-stone-900 text-amber-400 rounded-full flex items-center gap-1">
              {isGovt ? <Landmark className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
              <span>{isGovt ? 'Govt Official' : 'Center Staff'}</span>
            </span>
          )}
        </div>

        {/* SECTION 1: LANGUAGE SELECTION (Instant App-wide) */}
        <div className="card-farmer space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span>{t('settings.langSection')}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => handleLanguageChange(l.code)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  i18n.language === l.code
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{l.nativeName}</span>
                  <span className="text-[10px] text-stone-500">{l.englishName}</span>
                </div>
                {i18n.language === l.code && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ADMIN SPECIFIC ACTIONS (Switch Portal & Sign Out) */}
        {isAdmin ? (
          <div className="space-y-3">
            {/* Switch Portal Button */}
            <div className="card-farmer p-4 space-y-2 bg-stone-900 text-white border-stone-800">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                <RefreshCw className="w-4 h-4" />
                <span>{t('settings.switchPortal')}</span>
              </div>
              <p className="text-xs text-stone-300">
                {t('settings.switchPortalDesc')}
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('portal_choice')}
                className="w-full mt-2 py-3 px-4 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-2xl font-bold text-xs flex items-center justify-between border border-stone-700 active:scale-98 transition-all"
              >
                <span>{t('settings.switchPortal')}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Admin Log Out Button */}
            <div className="card-farmer p-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="w-full py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl font-bold text-sm flex items-center justify-between border border-stone-300 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-200 flex items-center justify-center text-stone-800">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm">{t('settings.logout')}</div>
                    <div className="text-[11px] text-stone-500">{t('settings.logoutDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </button>
            </div>
          </div>
        ) : (
          /* FARMER SPECIFIC SECTIONS */
          <>
            {/* SECTION 2: DPDP PRIVACY & MY DATA */}
            <div className="card-farmer space-y-3.5">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t('settings.privacySection')}</span>
              </div>

              {/* Consent Metadata Badge */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('settings.consentDateLabel')}:</span>
                  <span className="font-bold text-stone-900">{consentRecord.formattedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">{t('settings.version')}:</span>
                  <span className="font-bold text-emerald-800">v{consentRecord.version}</span>
                </div>
              </div>

              {/* Read Full Privacy Notice */}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('privacy')}
                className="w-full py-3 px-4 bg-white hover:bg-emerald-50 text-emerald-900 rounded-2xl font-bold text-xs flex items-center justify-between border border-emerald-300 transition-all active:scale-98 shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>{t('settings.viewNotice')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>

              {/* My Data Summary */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 pb-2 border-b border-stone-100">
                  <User className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t('settings.myData')}</span>
                </div>

                <div className="space-y-2 pt-2 text-xs font-semibold text-stone-700 divide-y divide-stone-100">
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.nameLabel')}</span>
                    <span className="font-bold text-stone-900">{user.fullName || 'Farmer'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.mobileLabel')}</span>
                    <span className="font-bold text-stone-900">{user.mobile || '9812345678'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.locationLabel')}</span>
                    <span className="font-bold text-stone-900">
                      {user.village ? `${user.village}, ` : ''}{user.district || 'Karnal'} ({user.state || 'Haryana'})
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.cardLabel')}</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {getMaskedCard(user.kisanCardNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.landLabel')}</span>
                    <span className="font-bold text-stone-900">{user.landSize || '4.5'} {t('common.acres')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{t('settings.cropLabel')}</span>
                    <span className="font-bold text-stone-900">
                      {user.crops && user.crops.length > 0 
                        ? user.crops.map(c => t(`crops.${c}`, { defaultValue: c })).join(', ') 
                        : t(`crops.${user.crop || 'wheat'}`, { defaultValue: 'Wheat' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Withdraw Consent Button */}
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-between border border-amber-200 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{t('settings.withdrawConsent')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </button>
            </div>

            {/* SECTION 3: LOG OUT (Keep Saved Data, Return to Portal Choice) */}
            <div className="card-farmer p-4">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="w-full py-3.5 px-4 bg-stone-50 hover:bg-stone-100 text-stone-900 rounded-2xl font-bold text-sm flex items-center justify-between border border-stone-200 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-stone-200 text-stone-800 flex items-center justify-center">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm text-stone-900">{t('settings.logout')}</div>
                    <div className="text-[11px] text-stone-500">{t('settings.logoutDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            {/* SECTION 4: DELETE ALL MY DATA (Danger action in Red at bottom) */}
            <div className="card-farmer border-red-200 bg-red-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-black text-red-900">
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>{t('settings.dataRights')}</span>
              </div>
              <p className="text-xs text-red-800/80 leading-relaxed">
                {t('settings.deleteDataDesc')}
              </p>

              <button
                type="button"
                onClick={() => setDeleteStep(1)}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm shadow-red-600/20 active:scale-98 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('settings.deleteData')}</span>
              </button>
            </div>
          </>
        )}
      </main>

      {!isAdmin && <BottomNav currentScreen="settings" onNavigate={onNavigate} />}

      {/* MODAL 1: LOG OUT CONFIRMATION (Simple confirmation with two big buttons) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 border border-stone-200 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-stone-900">
                {t('settings.logoutConfirmTitle')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('settings.logoutConfirmDesc')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all active:scale-95"
              >
                {t('common.cancel')}
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-3 px-4 rounded-2xl bg-stone-900 hover:bg-black text-white font-bold text-sm shadow-md active:scale-95 transition-all"
              >
                {t('settings.btnLogoutConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TWO-STEP DELETE CONFIRMATION */}
      {/* STEP 1: WARNING DIALOG */}
      {deleteStep === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 border border-red-200 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-red-900">
                {t('settings.deleteStep1Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('settings.deleteStep1Desc')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-all active:scale-95"
              >
                {t('common.cancel')}
              </button>

              <button
                type="button"
                onClick={() => setDeleteStep(2)}
                className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/30 active:scale-95 transition-all"
              >
                {t('settings.btnContinueDelete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: FINAL CONFIRMATION TAP */}
      {deleteStep === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 border-2 border-red-500 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-stone-900">
                {t('settings.deleteStep2Title')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('settings.deleteStep2Desc')}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleFinalDelete}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-lg shadow-red-600/40 active:scale-95 transition-all"
              >
                {t('settings.btnDeleteFinal')}
              </button>

              <button
                type="button"
                onClick={() => setDeleteStep(0)}
                className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: WITHDRAW CONSENT */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 border border-amber-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-stone-900">
                {t('settings.withdrawConsent')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('settings.withdrawConsentDesc')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm"
              >
                {t('common.cancel')}
              </button>

              <button
                type="button"
                onClick={handleWithdrawConsent}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-md active:scale-95"
              >
                {t('settings.withdrawConsent')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
