import React from 'react';
import { useTranslation } from 'react-i18next';
import { Printer, Download, FileText, CheckCircle2, Building2 } from 'lucide-react';
import { GOVT_CENTERS } from '../../mockGovtData';

export default function GovtReportView({ centers = GOVT_CENTERS }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const totalGrain = centers.reduce((sum, c) => sum + c.grainProcuredToday, 0);
  const totalFarmers = centers.reduce((sum, c) => sum + c.farmersServedToday, 0);

  const handleDownloadCSV = () => {
    const headers = 'Center Name,District,Grain Procured (Qtl),Farmers Served,Queue Length,Utilization %,Status\n';
    const rows = centers.map(c => 
      `"${c.nameEn}","${c.district}",${c.grainProcuredToday},${c.farmersServedToday},${c.queueLength},${c.utilizationPercent}%,"${c.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AgriMinds_Daily_Procurement_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Report Action Bar */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-white">
            {isHindi ? 'दैनिक खरीद सारांश एवं आधिकारिक रिपोर्ट' : 'Daily Procurement Summary & Official Report'}
          </h3>
          <p className="text-xs text-stone-400">
            {isHindi ? 'मुद्रण योग्य आधिकारिक प्रपत्र (सभी कार्ड नंबर संरक्षित)' : 'Printable government format with privacy-preserved data'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'CSV डाउनलोड' : 'Download CSV'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'प्रिंट रिपोर्ट' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
              Government of Haryana • Department of Food, Civil Supplies & Consumer Affairs
            </span>
            <h2 className="text-xl font-black text-stone-950">
              AgriMinds Daily Mandi Procurement & Queue Audit Report
            </h2>
            <p className="text-xs text-stone-600 font-mono">
              Division: Karnal, Kurukshetra, Kaithal | Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-stone-100 p-2 border border-stone-300 flex items-center justify-center font-bold text-center text-[10px]">
            AgriMinds
          </div>
        </div>

        {/* Summary Highlights */}
        <div className="grid grid-cols-4 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Total Centers</span>
            <span className="text-lg font-black text-stone-900">{centers.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Total Grain (Qtl)</span>
            <span className="text-lg font-black text-emerald-800 font-mono">{totalGrain.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Farmers Served</span>
            <span className="text-lg font-black text-stone-900">{totalFarmers}</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 font-bold uppercase block">Avg Mandi Wait</span>
            <span className="text-lg font-black text-stone-900">28 Mins</span>
          </div>
        </div>

        {/* Centers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-stone-300">
            <thead className="bg-stone-100 text-stone-700 font-black border-b border-stone-300 text-[10px] uppercase">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Center Name</th>
                <th className="p-3">District</th>
                <th className="p-3 text-right">Grain (Qtl)</th>
                <th className="p-3 text-right">Farmers</th>
                <th className="p-3 text-right">Capacity %</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {centers.map((c, idx) => (
                <tr key={c.id}>
                  <td className="p-3 font-mono font-bold">{idx + 1}</td>
                  <td className="p-3 font-bold">{c.nameEn}</td>
                  <td className="p-3">{c.district}</td>
                  <td className="p-3 text-right font-mono font-bold">{c.grainProcuredToday.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono">{c.farmersServedToday}</td>
                  <td className="p-3 text-right font-mono">{c.utilizationPercent}%</td>
                  <td className="p-3 text-center font-bold uppercase text-[10px]">
                    {c.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Privacy Assurance Sign-off */}
        <div className="border-t border-stone-200 pt-4 flex items-center justify-between text-[11px] text-stone-500">
          <span>* Kisan card numbers and sensitive farmer identifiers are masked per digital privacy guidelines.</span>
          <span className="font-mono font-bold">Authorized Signatory: Dr. Rajesh Sharma (IAS)</span>
        </div>
      </div>
    </div>
  );
}
