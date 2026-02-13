import React, { useState, useMemo } from 'react';
import { getLocalizedData } from './data/localizedData';
import { PlaceCard } from './components/PlaceCard';
import { ComboCard } from './components/ComboCard';
import { FilterBar } from './components/FilterBar';
import './styles/App.css';
import { useLocation } from './context/LocationContext';
import { useLanguage } from './context/LanguageContext';
import LocationSettings from './components/LocationSettings';

function App() {
  const { travelTimes, userLocation } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [vibes, setVibes] = useState([]);
  const [dists, setDists] = useState([]);
  const [durs, setDurs] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [tab, setTab] = useState('places');
  const [surprise, setSurprise] = useState(null);
  const [shakeN, setShakeN] = useState(0);
  const {
    places,
    combos,
    categories,
    vibeFilters,
    distanceRanges,
    durationFilters,
    tripTypeFilters,
  } = useMemo(() => getLocalizedData(language), [language]);

  React.useEffect(() => {
    document.title = t('meta.title');
  }, [t]);
  // Favourites state
  const [favouritePlaces, setFavouritePlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favouritePlaces')) || [];
    } catch {
      return [];
    }
  });
  const [favouriteCombos, setFavouriteCombos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favouriteCombos')) || [];
    } catch {
      return [];
    }
  });

  // Persist favourites
  React.useEffect(() => {
    localStorage.setItem('favouritePlaces', JSON.stringify(favouritePlaces));
  }, [favouritePlaces]);
  React.useEffect(() => {
    localStorage.setItem('favouriteCombos', JSON.stringify(favouriteCombos));
  }, [favouriteCombos]);

  // Handlers
  const toggleFavouritePlace = (id) => {
    setFavouritePlaces(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };
  const toggleFavouriteCombo = (id) => {
    setFavouriteCombos(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };

  const toggle = (arr, setArr, key) => {
    if (key === 'all') return setArr([]);
    setArr(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const filtered = useMemo(() => places.filter(p => {
    if (showFavouritesOnly && !favouritePlaces.includes(p.id)) return false;
    if (vibes.length > 0 && !vibes.some(v => p.vibes.includes(v))) return false;
    if (dists.length > 0) {
      const travelData = travelTimes[p.id];
      const km = travelData ? Math.round(travelData.distance / 1000) : null;
      const match = dists.some(dk => {
        const r = distanceRanges.find(d => d.key === dk);
        if (!r) return false;
        if (r.min !== undefined && (km === null || km < r.min)) return false;
        if (r.max !== undefined && (km === null || km > r.max)) return false;
        return true;
      });
      if (!match) return false;
    }
    if (durs.length > 0 && !durs.includes(p.duration)) return false;
    return true;
  }), [vibes, dists, durs, showFavouritesOnly, favouritePlaces, travelTimes]);

  const filteredCombos = useMemo(() => combos.filter(c => {
    if (showFavouritesOnly && !favouriteCombos.includes(c.id)) return false;
    if (vibes.length > 0 && !vibes.some(v => c.vibes.includes(v))) return false;
    if (tripTypes.length > 0 && !tripTypes.includes(c.type)) return false;
    return true;
  }), [vibes, tripTypes, showFavouritesOnly, favouriteCombos]);

  const doSurprise = () => {
    const pool = filtered.length > 0 ? filtered : places;
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setSurprise(rand);
    setShakeN(n => n + 1);
    setTimeout(() => document.getElementById('surprise-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const counts = { places: filtered.length, combos: filteredCombos.length };

  React.useEffect(() => {
    if (!userLocation) setShowLocationSettings(true);
  }, [userLocation]);
  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-actions">
            <button
              onClick={() => setLanguage(language === 'hu' ? 'en' : 'hu')}
              className="language-switch-btn"
              title={language === 'hu' ? 'Switch to English' : 'Váltás magyar nyelvre'}
            >
              <span className="lang-icon" aria-hidden="true">🌐</span>
              <span className="lang-code">{language === 'hu' ? 'HU' : 'EN'}</span>
            </button>
            <button onClick={() => setShowLocationSettings(true)} className="settings-trigger-btn" title={t('labels.locationSettings')}>📍</button>
          </div>
          <h1>{t('app.title')}</h1>
          <p className="subtitle">
            {t('app.subtitle', { places: places.length, combos: combos.length })}
          </p>
        </div>
        {showLocationSettings && <LocationSettings onClose={() => setShowLocationSettings(false)} />}

        {/* Filters */}
        <FilterBar label={t('filters.mood')} items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} />
        <FilterBar label={t('filters.distance')} items={distanceRanges} active={dists} onSelect={(k) => toggle(dists, setDists, k)} />
        <FilterBar label={t('filters.duration')} items={durationFilters} active={durs} onSelect={(k) => toggle(durs, setDurs, k)} />

        {/* Surprise Button */}
        <button 
          onClick={(e) => { e.preventDefault(); doSurprise(); }}
          onTouchEnd={(e) => { e.preventDefault(); doSurprise(); }}
          className="surprise-button"
        >
          <span key={shakeN} className={shakeN > 0 ? "shake" : ""} style={{ fontSize:22, pointerEvents:"none" }}>🎲</span>
          <span style={{ pointerEvents:"none" }}>{t('actions.surpriseMe')}</span>
        </button>

        {/* Surprise Result */}
        {surprise && (
          <div id="surprise-result" className="surprise-result fade-up">
            <div className="surprise-label">{t('labels.todaysPick')}</div>
            <PlaceCard 
              place={surprise} 
              categories={categories}
              isFavourite={favouritePlaces.includes(surprise.id)}
              onToggleFavourite={() => toggleFavouritePlace(surprise.id)}
            />
          </div>
        )}

        {/* Favourites Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 8px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 14, color: '#B5A693', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={showFavouritesOnly}
              onChange={e => setShowFavouritesOnly(e.target.checked)}
              style={{ accentColor: '#E91E63', marginRight: 6 }}
            />
            <span style={{ fontSize: 18, marginRight: 4 }}>{showFavouritesOnly ? '❤️' : '🤍'}</span>
            {t('labels.favouritesOnly')}
          </label>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[
            { key: 'places', label: `${t('labels.places')} (${counts.places})` },
            { key: 'combos', label: `${t('labels.plans')} (${counts.combos})` }
          ].map(t => (
            <button 
              key={t.key} 
              onClick={(e) => { e.preventDefault(); setTab(t.key); }}
              onTouchEnd={(e) => { e.preventDefault(); setTab(t.key); }}
              className={`tab-button ${tab === t.key ? 'active' : ''}`}
            >
              <span style={{ pointerEvents:"none" }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Places List */}
        {tab === 'places' && (
          <div key={`places-filter-${vibes.join('-')}-${dists.join('-')}-${durs.join('-')}`} className="list-container">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize:36 }}>🤷</span>
                <p>{t('labels.noPlacesMatch')}</p>
              </div>
            ) : filtered.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                <PlaceCard 
                  place={p}
                  categories={categories}
                  isFavourite={favouritePlaces.includes(p.id)}
                  onToggleFavourite={() => toggleFavouritePlace(p.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Combos List */}
        {tab === 'combos' && (
          <div key={`combos-filter-${vibes.join('-')}-${tripTypes.join('-')}`} className="list-container">
            {filteredCombos.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize:36 }}>🤷</span>
                <p>{t('labels.noPlansMatch')}</p>
              </div>
            ) : (
              <>
                <FilterBar label={t('filters.tripType')} items={tripTypeFilters} active={tripTypes} onSelect={(k) => toggle(tripTypes, setTripTypes, k)} />
                {filteredCombos.map((c, i) => (
                  <div key={c.id} className="fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                    <ComboCard combo={c} />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
