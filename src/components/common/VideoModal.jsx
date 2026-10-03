import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Play, Pause, Volume2, Video } from 'lucide-react';
import { TUTORIAL_VIDEOS } from '../../data/mockData';

export default function VideoModal({ videoId = 'vid-1', isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  const video = TUTORIAL_VIDEOS.find(v => v.id === videoId) || TUTORIAL_VIDEOS[0];
  const langKey = i18n.language.startsWith('hi') ? 'hi' : 'en';
  const isHindi = langKey === 'hi';
  const captionText = video.captions[langKey] || video.captions['en'] || video.captions['hi'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-stone-300 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base line-clamp-1">{t(video.titleKey)}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Area */}
        <div className="relative aspect-video bg-gradient-to-br from-emerald-950 to-stone-950 flex flex-col items-center justify-center p-6 text-center text-white overflow-hidden">
          <div className="absolute top-3 right-3 text-xs bg-black/60 px-2.5 py-1 rounded-full text-stone-300 font-mono">
            {video.duration}
          </div>

          <div 
            className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all mb-4"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </div>

          <p className="text-sm font-semibold text-emerald-200">
            {isPlaying ? (isHindi ? '▶ वीडियो चल रहा है' : '▶ Video playing') : (isHindi ? '⏸ वीडियो रुका हुआ है' : '⏸ Video paused')}
          </p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-700">
            <div className="h-full bg-emerald-400 w-2/3 transition-all duration-300"></div>
          </div>
        </div>

        {/* Closed Captions & Audio Transcript */}
        <div className="p-5 bg-stone-50 border-t border-stone-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>{isHindi ? 'विवरण' : 'Guide Details'}</span>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border border-stone-200 text-sm text-stone-800 font-medium leading-relaxed shadow-xs">
            {captionText}
          </div>

          <button
            onClick={onClose}
            className="w-full btn-primary text-base py-3"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
