import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ArrowUpDown, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { GOVT_CENTERS, DISTRICTS_LIST } from '../../mockGovtData';
import { CROPS } from '../../../data/mockData';

export default function GovtCenterTableView({ centers = GOVT_CENTERS }) {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language.startsWith('hi');

  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('grainProcuredToday');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredCenters = useMemo(() => {
    return centers
      .filter((c) => {
        const matchDist = selectedDistrict === 'All Districts' || c.district === selectedDistrict;
        const matchCrop = selectedCrop === 'all' || (c.cropDistribution && c.cropDistribution[selectedCrop]);
        const matchSearch = 
          c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.nameHi.includes(searchQuery) ||
          c.district.toLowerCase().includes(searchQuery.toLowerCase());
        return matchDist && matchCrop && matchSearch;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [centers, selectedDistrict, selectedCrop, searchQuery, sortField, sortAsc]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-stone-900 border border-stone-800 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'केंद्र या जिला खोजें...' : 'Search center or district...'}
            className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-500 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 outline-hidden"
          />
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
        </div>

        {/* District & Crop Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-2xl px-3 py-2 outline-hidden focus:border-emerald-500"
          >
            {DISTRICTS_LIST.map((d) => (
              <option key={d} value={d}>
                {d === 'All Districts' ? (isHindi ? 'सभी जिले' : 'All Districts') : d}
              </option>
            ))}
          </select>

          {/* Crop Selector */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-2xl px-3 py-2 outline-hidden focus:border-emerald-500"
          >
            <option value="all">{isHindi ? 'सभी फसलें' : 'All Crops'}</option>
            <option value="wheat">🌾 {isHindi ? 'गेहूं (Wheat)' : 'Wheat'}</option>
            <option value="paddy">🌾 {isHindi ? 'धान (Paddy)' : 'Paddy'}</option>
            <option value="mustard">🌻 {isHindi ? 'सरसों (Mustard)' : 'Mustard'}</option>
            <option value="gram">🌱 {isHindi ? 'चना (Gram)' : 'Gram'}</option>
          </select>
        </div>
      </div>

      {/* Centers Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 font-bold border-b border-stone-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('nameEn')}>
                  <div className="flex items-center gap-1.5">
                    <span>{isHindi ? 'खरीद केंद्र' : 'Procurement Center'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('district')}>
                  <div className="flex items-center gap-1.5">
                    <span>{isHindi ? 'जिला' : 'District'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('grainProcuredToday')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isHindi ? 'खरीद (Qtl)' : 'Grain (Qtl)'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('farmersServedToday')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isHindi ? 'किसान' : 'Farmers'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white text-center" onClick={() => handleSort('queueLength')}>
                  <div className="flex items-center justify-center gap-1.5">
                    <span>{isHindi ? 'कतार' : 'Queue'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('utilizationPercent')}>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>{isHindi ? 'उपयोगिता %' : 'Capacity %'}</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-center">{isHindi ? 'स्थिति' : 'Status'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-800 text-stone-200 font-medium">
              {filteredCenters.map((c) => (
                <tr key={c.id} className="hover:bg-stone-800/60 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">
                      {isHindi ? c.nameHi : c.nameEn}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      {c.staffActive} {isHindi ? 'स्टाफ सक्रिय' : 'staff on duty'} • {c.gunnyBagsStock.toLocaleString('en-IN')} {isHindi ? 'बोरी स्टॉक' : 'bags'}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-stone-800 rounded-md text-stone-300 font-bold text-[11px]">
                      {c.district}
                    </span>
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-emerald-400">
                    {c.grainProcuredToday.toLocaleString('en-IN')}
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-stone-200">
                    {c.farmersServedToday}
                  </td>

                  <td className="p-4 text-center font-mono font-black text-amber-400">
                    {c.queueLength}
                  </td>

                  <td className="p-4 text-right font-mono">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-bold">{c.utilizationPercent}%</span>
                      <div className="w-12 bg-stone-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.utilizationPercent > 85 ? 'bg-red-500' : c.utilizationPercent > 65 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${c.utilizationPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'normal'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : c.status === 'crowded'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {c.status === 'normal' ? (isHindi ? 'सामान्य' : 'Normal') : c.status === 'crowded' ? (isHindi ? 'भीड़भाड़' : 'Crowded') : (isHindi ? 'विलंबित' : 'Delayed')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
