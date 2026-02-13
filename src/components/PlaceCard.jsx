
import React from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { getDistColor, getDistDot } from '../data/config';

export function PlaceCard({ place, categories, isFavourite, onToggleFavourite }) {
  const { travelTimes, loading, error } = useLocation();
  const { t } = useLanguage();
  const cat = categories[place.cat];
  // Get travel time for this place
  const travelData = travelTimes[place.id];
  const distance = travelData ? Math.round(travelData.distance / 1000) : null;
  const time = travelData ? travelData.durationText : null;
  return (
    <div style={{
      background:"rgba(255,255,255,0.03)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:14, padding:"18px 20px",
      transition:"all 0.25s ease",
      position: 'relative',
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <span style={{ fontSize:22 }}>{place.emoji}</span>
            <h3 style={{ 
              fontFamily:"'Cormorant Garamond', Georgia, serif", 
              fontSize:21, 
              fontWeight:600, 
              color:"#F5F1EC", 
              margin:0 
            }}>
              {place.name}
            </h3>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#9A8B7A" }}>
            <span>{place.loc}</span>
            <span>•</span>
            {loading && !travelData ? (
              <span style={{ color:'#8B7355' }}>{t('labels.calculating')}</span>
            ) : error ? (
              <span style={{ color:'#E57373' }}>⚠️ {error}</span>
            ) : travelData ? (
              <span style={{ color:getDistColor(distance) }}>
                {getDistDot(distance)} {distance}km • {time} ✓
              </span>
            ) : (
              <span style={{ color:'#B5A693' }}>{t('labels.distanceUnavailable')}</span>
            )}
          </div>
        </div>
        {cat && (
          <div style={{
            background:`${cat.color}15`,
            border:`1px solid ${cat.color}40`,
            color:cat.color,
            padding:"4px 10px",
            borderRadius:12,
            fontSize:10,
            fontWeight:600,
            whiteSpace:"nowrap",
          }}>
            {cat.label}
          </div>
        )}
        {/* Favourite button */}
        <button
          aria-label={isFavourite ? t('favourites.remove') : t('favourites.add')}
          onClick={e => { e.stopPropagation(); onToggleFavourite && onToggleFavourite(); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: 10,
            fontSize: 20,
            color: isFavourite ? '#E91E63' : '#B5A693',
            transition: 'color 0.2s',
            outline: 'none',
          }}
          title={isFavourite ? t('favourites.unfavourite') : t('favourites.favourite')}
        >
          {isFavourite ? '❤️' : '🤍'}
        </button>
      </div>
      <p style={{ fontSize:13, lineHeight:"1.6", color:"#B5A693", margin:"0 0 10px 0" }}>
        {place.desc}
      </p>
      <div style={{
        background:"rgba(218,165,105,0.06)",
        border:"1px solid rgba(218,165,105,0.15)",
        borderRadius:8, padding:"8px 12px",
        fontSize:12, color:"#DAA569", lineHeight:"1.5",
        marginBottom:10,
      }}>
        💡 {place.tip}
      </div>
      <a 
        href={place.maps} 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display:"inline-block",
          color:"#DAA569",
          fontSize:12,
          textDecoration:"none",
          borderBottom:"1px solid rgba(218,165,105,0.3)",
          transition:"all 0.2s ease",
        }}
      >
        {t('actions.viewOnMaps')}
      </a>
    </div>
  );
}
