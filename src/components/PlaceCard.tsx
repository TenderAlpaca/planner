
import React from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { getDistColor, getDistDot } from '../data/config';
import type { Place } from '../types/domain';

interface PlaceCardProps {
  place: Place;
  categories: Record<string, { label: string; color: string }>;
  isFavourite: boolean;
  onToggleFavourite?: () => void;
}

export function PlaceCard({ place, categories, isFavourite, onToggleFavourite }: PlaceCardProps) {
  const { travelTimes, loading, error } = useLocation();
  const { t } = useLanguage();
  const cat = categories[place.cat];
  const categoryIcon = cat?.label?.split(' ')[0] || '🏷️';
  // Get travel time for this place
  const travelData = travelTimes[place.id];
  const distance = travelData ? Math.round(travelData.distance / 1000) : null;
  const time = travelData ? travelData.durationText : null;
  return (
    <div className="card shadow-sm h-100 border-0 place-card">
      <div className="card-body p-3 d-flex flex-column place-card-body">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-1 gap-2">
          <div className="d-flex align-items-center gap-2 mb-0">
            <span style={{ fontSize: 22 }}>{place.emoji}</span>
            <h3 className="h5 mb-0">
              {place.name}
            </h3>
          </div>
          <div className="d-flex align-items-center gap-2 ms-1">
            {cat && (
              <div
                className="badge rounded-pill border place-category-icon"
                style={{ background: `${cat.color}22`, borderColor: `${cat.color}55`, color: cat.color }}
                title={cat.label}
                aria-label={cat.label}
              >
                {categoryIcon}
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 text-secondary pt-1 flex-nowrap mb-3" style={{ fontSize: 12 }}>
          <span>{place.loc}</span>
          <span>•</span>
          {loading && !travelData ? (
            <span className="text-nowrap">{t('labels.calculating')}</span>
          ) : error ? (
            <span className="text-danger text-nowrap">⚠️ {error}</span>
          ) : travelData ? (
            <span className="text-nowrap" style={{ color:getDistColor(distance) }}>
              {getDistDot(distance)} {distance}km • {time} ✓
            </span>
          ) : (
            <span className="text-nowrap">{t('labels.distanceUnavailable')}</span>
          )}
        </div>
        <p className="card-text text-secondary mb-3" style={{ fontSize: 13, lineHeight: 1.7 }}>
          {place.desc}
        </p>
      </div>
      <div className="mt-auto d-flex flex-column gap-3">
        <div className="alert py-2 px-3 mb-0 w-100" style={{ background: 'rgba(200,154,98,0.1)', border: '1px solid rgba(200,154,98,0.26)', color: 'var(--app-text-muted)', fontSize: 12 }}>
          💡 {place.tip}
        </div>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <a
            href={place.maps} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary place-maps-btn"
          >
            {t('actions.viewOnMaps')}
          </a>
          <button
            aria-label={isFavourite ? t('favourites.remove') : t('favourites.add')}
            onClick={e => { e.stopPropagation(); onToggleFavourite && onToggleFavourite(); }}
            className="btn btn-link p-0 text-decoration-none place-favourite-btn"
            style={{ fontSize: 20, color: isFavourite ? 'var(--app-favourite)' : 'var(--app-text-soft)' }}
            title={isFavourite ? t('favourites.unfavourite') : t('favourites.favourite')}
          >
            {isFavourite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
