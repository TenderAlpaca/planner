import React, { useState, useMemo } from 'react';
import { places } from './data/places';
import { combos } from './data/combos';
import { vibeFilters, distanceRanges, durationFilters, tripTypeFilters } from './data/config';
import { PlaceCard } from './components/PlaceCard';
import { ComboCard } from './components/ComboCard';
import { FilterBar } from './components/FilterBar';
import './styles/App.css';
import { useLocation } from './context/LocationContext';
import LocationSettings from './components/LocationSettings';

function App() {
    const { travelTimes, isFirstVisit, setIsFirstVisit, userLocation } = useLocation();
    const [showLocationSettings, setShowLocationSettings] = useState(false);
    const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [vibes, setVibes] = useState([]);
  const [dists, setDists] = useState([]);
  const [durs, setDurs] = useState([]);
  const [tripTypes, setTripTypes] = useState([]);
  const [tab, setTab] = useState("places");
  const [surprise, setSurprise] = useState(null);
  const [shakeN, setShakeN] = useState(0);
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
    if (key === "all") return setArr([]);
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
    setTimeout(() => document.getElementById("surprise-result")?.scrollIntoView({ behavior:"smooth" }), 100);
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
          <h1>Date Planner</h1>
          <button onClick={() => setShowLocationSettings(true)} className="settings-trigger-btn" title="Location Settings">📍</button>
          <p className="subtitle">
            {places.length} places • {combos.length} ready-made plans • Day trips to weekend getaways
          </p>
        </div>
        {showLocationSettings && <LocationSettings onClose={() => setShowLocationSettings(false)} />}

        {/* Filters */}
        <FilterBar label="MOOD" items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} />
        <FilterBar label="DISTANCE" items={distanceRanges} active={dists} onSelect={(k) => toggle(dists, setDists, k)} />
        <FilterBar label="DURATION" items={durationFilters} active={durs} onSelect={(k) => toggle(durs, setDurs, k)} />

        {/* Surprise Button */}
        <button 
          onClick={(e) => { e.preventDefault(); doSurprise(); }}
          onTouchEnd={(e) => { e.preventDefault(); doSurprise(); }}
          className="surprise-button"
        >
          <span key={shakeN} className={shakeN > 0 ? "shake" : ""} style={{ fontSize:22, pointerEvents:"none" }}>🎲</span>
          <span style={{ pointerEvents:"none" }}>SURPRISE ME</span>
        </button>

        {/* Surprise Result */}
        {surprise && (
          <div id="surprise-result" className="surprise-result fade-up">
            <div className="surprise-label">TODAY'S PICK ✨</div>
            <PlaceCard 
              place={surprise} 
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
            Favourites only
          </label>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[
            {key:"places", label:`Places (${counts.places})`},
            {key:"combos", label:`Plans (${counts.combos})`}
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
        {tab === "places" && (
          <div key={`places-filter-${vibes.join('-')}-${dists.join('-')}-${durs.join('-')}`} className="list-container">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize:36 }}>🤷</span>
                <p>No places match. Try different filters.</p>
              </div>
            ) : filtered.map((p, i) => (
              <div key={p.id} className="fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                <PlaceCard 
                  place={p}
                  isFavourite={favouritePlaces.includes(p.id)}
                  onToggleFavourite={() => toggleFavouritePlace(p.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Combos List */}
        {tab === "combos" && (
          <div key={`combos-filter-${vibes.join('-')}-${tripTypes.join('-')}`} className="list-container">
            {filteredCombos.length === 0 ? (
              <div className="empty-state">
                <span style={{ fontSize:36 }}>🤷</span>
                <p>No plans match. Try different filters.</p>
              </div>
            ) : (
              <>
                <FilterBar label="TRIP TYPE" items={tripTypeFilters} active={tripTypes} onSelect={(k) => toggle(tripTypes, setTripTypes, k)} />
                {filteredCombos.map((c, i) => (
                  <div key={c.id} className="fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                    <ComboCard 
                      combo={c}
                      isFavourite={favouriteCombos.includes(c.id)}
                      onToggleFavourite={() => toggleFavouriteCombo(c.id)}
                    />
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
