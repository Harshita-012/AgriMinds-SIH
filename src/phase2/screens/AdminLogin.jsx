import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Lock, User, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CENTERS } from '../../data/mockData';
import { STAFF_ACCOUNTS } from '../roles';
import { sharedStore } from '../store';

export default function AdminLoginScreen({ onLoginSuccess, onBack }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [selectedCenterId, setSelectedCenterId] = useState('center-1');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const matchStaff = STAFF_ACCOUNTS.find(
      s => s.employeeId.toUpperCase() === employeeId.trim().toUpperCase() && s.pin === pin.trim()
    );

    setTimeout(() => {
      setIsSubmitting(false);
      if (matchStaff) {
        const centerObj = CENTERS.find(c => c.id === selectedCenterId) || CENTERS[0];
        const adminSession = {
          role: 'center_staff',
          staffId: matchStaff.employeeId,
          staffName: matchStaff.name,
          centerId: selectedCenterId,
          centerNameEn: centerObj.nameEn,
          centerNameHi: centerObj.nameHi,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        };

        sharedStore.saveAdminSession(adminSession);
        sharedStore.addAuditLog(
          matchStaff.name,
          'Staff Portal Login',
          adminSession.centerNameEn,
          `Logged into ${adminSession.centerNameEn} terminal session.`
        );
        onLoginSuccess(adminSession);
      } else {
        setErrorMsg(
          isHindi
            ? 'अमान्य कर्मचारी आईडी या पिन। कृपया पुनः प्रयास करें।'
            : 'Invalid Employee ID or PIN. Please try again.'
        );
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-between p-4 md:p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-stone-400 hover:text-white flex items-center gap-1.5 text-xs font-bold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              {isHindi ? 'मंडी स्टाफ लॉगिन' : 'Center Staff Login'}
            </span>
            <h1 className="text-2xl font-black text-white">
              {isHindi ? 'खरीद केंद्र पोर्टल' : 'Procurement Portal'}
            </h1>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="my-6 space-y-4 bg-stone-800/80 p-5 rounded-3xl border border-stone-700 shadow-xl">
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-red-200 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Assigned Procurement Center */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHindi ? 'खरीद केंद्र चुनें' : 'Procurement Center'}</span>
          </label>
          <select
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
            className="w-full bg-stone-900 border-2 border-stone-700 focus:border-emerald-500 rounded-2xl p-3.5 text-xs font-bold text-white outline-hidden transition-all"
          >
            {CENTERS.map((c) => (
              <option key={c.id} value={c.id} className="bg-stone-900 text-white">
                {isHindi ? c.nameHi : c.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Employee ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'कर्मचारी आईडी' : 'Employee ID'}</span>
          </label>
          <input
            type="text"
            required
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="e.g. EMP-101"
            className="w-full bg-stone-900 border-2 border-stone-700 focus:border-amber-400 rounded-2xl p-3.5 text-sm font-bold text-white placeholder-stone-600 outline-hidden uppercase tracking-wider transition-all"
          />
        </div>

        {/* Security PIN */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isHindi ? 'सुरक्षा पिन' : 'Security PIN'}</span>
          </label>
          <input
            type="password"
            required
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full bg-stone-900 border-2 border-stone-700 focus:border-amber-400 rounded-2xl p-3.5 text-sm font-bold text-white placeholder-stone-600 outline-hidden tracking-widest transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] mt-4"
        >
          <span>{isSubmitting ? t('common.loading') : (isHindi ? 'पोर्टल में प्रवेश करें' : 'Sign In to Portal')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Footer */}
      <div className="pt-4 border-t border-stone-800 text-center">
        <p className="text-[11px] text-stone-500 font-medium">
          {isHindi ? 'अधिकृत सरकारी एवं मंडी कर्मचारियों के लिए सुरक्षित प्रवेश।' : 'Authorized access for Mandi center staff.'}
        </p>
      </div>
    </div>
  );
}
