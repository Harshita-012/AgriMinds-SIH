import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  Clock, 
  FileText,
  ScanLine,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { sharedStore } from '../../store';

export default function AuditLogView({ adminSession }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const state = sharedStore.getState();
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const logs = state.auditLog || [];

  const filteredLogs = logs.filter(log => {
    if (filterType !== 'ALL' && !log.action.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.staffName.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.targetFarmer.toLowerCase().includes(term) ||
        log.details.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <History className="w-4 h-4" />
              <span>{isHindi ? 'अपरिवर्तनीय ऑडिट ट्रेल' : 'DPDP Immutable Audit Trail'}</span>
            </div>
            <h2 className="text-xl font-black">
              {isHindi ? 'मंडी क्रियाकलाप ऑडिट लॉग' : 'Procurement Center Audit Log'}
            </h2>
          </div>
          <span className="text-xs px-3 py-1 bg-stone-800 text-stone-300 rounded-xl border border-stone-700">
            {isHindi ? `${filteredLogs.length} घटनाएं दर्ज` : `${filteredLogs.length} Logged Events`}
          </span>
        </div>

        {/* Filter Bar & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? 'स्टाफ, किसान या विवरण खोजें...' : 'Search staff, farmer, details...'}
              className="w-full bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-600 outline-hidden"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-stone-950 border border-stone-800 focus:border-emerald-500 rounded-2xl p-2 text-xs font-bold text-white outline-hidden"
          >
            <option value="ALL">{isHindi ? 'सभी क्रियाएं (All Actions)' : 'All Actions'}</option>
            <option value="Scan">{isHindi ? 'क्यूआर स्कैन (QR Scans)' : 'QR Scans'}</option>
            <option value="Stage">{isHindi ? 'चरण बदलाव (Stages)' : 'Stage Changes'}</option>
            <option value="Reveal">{isHindi ? 'कार्ड अनमास्क (Card Reveals)' : 'Card Unmask Reveals'}</option>
            <option value="No-Show">{isHindi ? 'नो-शो (No-Shows)' : 'No-Shows'}</option>
            <option value="Verified">{isHindi ? 'सत्यापन (Verifications)' : 'Verifications'}</option>
            <option value="Rejected">{isHindi ? 'अस्वीकृति (Rejections)' : 'Rejections'}</option>
            <option value="Walk-In">{isHindi ? 'वॉक-इन (Walk-Ins)' : 'Walk-In Bookings'}</option>
          </select>
        </div>
      </div>

      {/* Logs Table / Card List */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-stone-900 rounded-3xl border border-stone-800 text-stone-500 text-xs font-semibold">
            {isHindi ? 'कोई ऑडिट लॉग नहीं मिला।' : 'No audit log entries matching criteria.'}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                    {log.timestamp}
                  </span>
                  <span className="font-extrabold text-white text-sm">
                    {log.action}
                  </span>
                  {log.action.includes('Reveal') && (
                    <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-bold flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      <span>{isHindi ? 'गोपनीयता लॉग' : 'Privacy Audit'}</span>
                    </span>
                  )}
                </div>

                <p className="text-stone-300 font-medium leading-relaxed">
                  {log.details}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-0.5">
                  <span><strong>{isHindi ? 'किसान:' : 'Farmer:'}</strong> {log.targetFarmer}</span>
                  <span>•</span>
                  <span><strong>{isHindi ? 'स्टाफ:' : 'Staff:'}</strong> {log.staffName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
