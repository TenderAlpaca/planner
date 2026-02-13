import React, { useState, useMemo, useRef } from 'react';
import { getLocalizedData } from './data/localizedData';
import { PlaceCard } from './components/PlaceCard';
import { ComboCard } from './components/ComboCard';
import { FilterBar } from './components/FilterBar';
import './styles/App.scss';
import { useLocation } from './context/LocationContext';
import { useLanguage } from './context/LanguageContext';
import LocationSettings from './components/LocationSettings';
import { buildComboFilterSpecification, buildPlaceFilterSpecification } from './utils/filterSpecifications';
import type { Combo, FilterItem, Place } from './types/domain';

function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value.split(',').map(v => v.trim()).filter(Boolean);
}

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') === 'combos' ? 'combos' : 'places';
  const surpriseIdRaw = Number.parseInt(params.get('pick') || '', 10);
  return {
    vibes: parseListParam(params.get('v')),
    dists: parseListParam(params.get('d')),
    durs: parseListParam(params.get('u')),
    tripTypes: parseListParam(params.get('tt')),
    tab,
    showFavouritesOnly: params.get('fav') === '1',
    surpriseId: Number.isNaN(surpriseIdRaw) ? null : surpriseIdRaw,
  };
}

function sanitizeSelection(prev: string[], validSet: Set<string>): string[] {
  const next = prev.filter(key => validSet.has(key));
  if (next.length === prev.length && next.every((value, index) => value === prev[index])) {
    return prev;
  }
  return next;
}

function App() {
  const initialUrlState = React.useMemo(() => readStateFromUrl(), []);
  const filtersShellRef = useRef<HTMLDivElement | null>(null);
  const activeFiltersRowRef = useRef<HTMLDivElement | null>(null);
  const isHoveringActiveFiltersRef = useRef(false);
  const hasAutoOpenedLocationPrompt = useRef(false);
  const { travelTimes, userLocation, isFirstVisit } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [dismissedLocationPrompt, setDismissedLocationPrompt] = useState(false);
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(initialUrlState.showFavouritesOnly);
  const [vibes, setVibes] = useState(initialUrlState.vibes);
  const [dists, setDists] = useState(initialUrlState.dists);
  const [durs, setDurs] = useState(initialUrlState.durs);
  const [tripTypes, setTripTypes] = useState(initialUrlState.tripTypes);
  const [tab, setTab] = useState(initialUrlState.tab);
  const [filtersCollapsed, setFiltersCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('filtersCollapsed');
      return saved === null ? true : saved === '1';
    } catch {
      return true;
    }
  });
  const [activePillsUi, setActivePillsUi] = useState({ hasOverflow: false, showLeftFade: false, showRightFade: false });
  const [showFloatingFilterButton, setShowFloatingFilterButton] = useState(false);
  const [surprise, setSurprise] = useState<Place | null>(null);
  const [surpriseIdFromUrl, setSurpriseIdFromUrl] = useState(initialUrlState.surpriseId);
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

  React.useEffect(() => {
    const vibeKeys = new Set(vibeFilters.map(item => item.key).filter(key => key !== 'all'));
    const distKeys = new Set(distanceRanges.map(item => item.key).filter(key => key !== 'all'));
    const durationKeys = new Set(durationFilters.map(item => item.key).filter(key => key !== 'all'));
    const tripTypeKeys = new Set(tripTypeFilters.map(item => item.key).filter(key => key !== 'all'));

    setVibes(prev => sanitizeSelection(prev, vibeKeys));
    setDists(prev => sanitizeSelection(prev, distKeys));
    setDurs(prev => sanitizeSelection(prev, durationKeys));
    setTripTypes(prev => sanitizeSelection(prev, tripTypeKeys));
    setTab(prev => (prev === 'places' || prev === 'combos' ? prev : 'places'));
  }, [vibeFilters, distanceRanges, durationFilters, tripTypeFilters]);

  React.useEffect(() => {
    if (!surpriseIdFromUrl) {
      setSurprise(null);
      return;
    }
    const surprisePlace = places.find(place => place.id === surpriseIdFromUrl);
    setSurprise(surprisePlace || null);
  }, [surpriseIdFromUrl, places]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    if (vibes.length > 0) params.set('v', vibes.join(','));
    if (dists.length > 0) params.set('d', dists.join(','));
    if (durs.length > 0) params.set('u', durs.join(','));
    if (tripTypes.length > 0) params.set('tt', tripTypes.join(','));
    if (tab !== 'places') params.set('tab', tab);
    if (showFavouritesOnly) params.set('fav', '1');
    if (surprise?.id) params.set('pick', String(surprise.id));

    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [vibes, dists, durs, tripTypes, tab, showFavouritesOnly, surprise]);

  React.useEffect(() => {
    localStorage.setItem('filtersCollapsed', filtersCollapsed ? '1' : '0');
  }, [filtersCollapsed]);

  React.useEffect(() => {
    const onScroll = () => {
      const node = filtersShellRef.current;
      if (!node) {
        setShowFloatingFilterButton(false);
        return;
      }
      const rect = node.getBoundingClientRect();
      setShowFloatingFilterButton(rect.bottom < 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  React.useEffect(() => {
    const handlePopState = () => {
      const urlState = readStateFromUrl();
      setVibes(urlState.vibes);
      setDists(urlState.dists);
      setDurs(urlState.durs);
      setTripTypes(urlState.tripTypes);
      setTab(urlState.tab);
      setShowFavouritesOnly(urlState.showFavouritesOnly);
      setSurpriseIdFromUrl(urlState.surpriseId);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const clearAllFilters = () => {
    setVibes([]);
    setDists([]);
    setDurs([]);
    setTripTypes([]);
    setShowFavouritesOnly(false);
  };

  const showFiltersFromAnywhere = () => {
    setFiltersCollapsed(false);
    window.requestAnimationFrame(() => {
      filtersShellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleActiveFiltersWheel = (event) => {
    const node = event.currentTarget;
    const hasHorizontalOverflow = node.scrollWidth > node.clientWidth + 1;
    if (!hasHorizontalOverflow) return;

    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX;

    if (delta !== 0) {
      node.scrollLeft += delta;
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const filtered = useMemo(() => {
    const specification = buildPlaceFilterSpecification({
      showFavouritesOnly,
      favourites: favouritePlaces,
      vibes,
      dists,
      durs,
      travelTimes,
      distanceRanges,
    });
    return places.filter(specification);
  }, [places, showFavouritesOnly, favouritePlaces, vibes, dists, durs, travelTimes, distanceRanges]);

  const filteredCombos = useMemo(() => {
    const specification = buildComboFilterSpecification({
      showFavouritesOnly,
      favourites: favouriteCombos,
      vibes,
      tripTypes,
    });
    return combos.filter(specification);
  }, [combos, showFavouritesOnly, favouriteCombos, vibes, tripTypes]);

  const doSurprise = () => {
    const pool = filtered.length > 0 ? filtered : places;
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setSurprise(rand);
    setShakeN(n => n + 1);
    setTimeout(() => document.getElementById('surprise-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const counts = { places: filtered.length, combos: filteredCombos.length };

  const filterLookup = useMemo(() => ({
    vibes: Object.fromEntries(vibeFilters.map(item => [item.key, item])),
    dists: Object.fromEntries(distanceRanges.map(item => [item.key, item])),
    durs: Object.fromEntries(durationFilters.map(item => [item.key, item])),
    tripTypes: Object.fromEntries(tripTypeFilters.map(item => [item.key, item])),
  }) as Record<string, Record<string, FilterItem>>, [vibeFilters, distanceRanges, durationFilters, tripTypeFilters]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    vibes.forEach(key => {
      const item = filterLookup.vibes[key];
      if (item) chips.push({ key: `v-${key}`, label: item.label, icon: item.icon, remove: () => toggle(vibes, setVibes, key) });
    });

    dists.forEach(key => {
      const item = filterLookup.dists[key];
      if (item) chips.push({ key: `d-${key}`, label: item.label, icon: item.icon, remove: () => toggle(dists, setDists, key) });
    });

    durs.forEach(key => {
      const item = filterLookup.durs[key];
      if (item) chips.push({ key: `u-${key}`, label: item.label, icon: item.icon, remove: () => toggle(durs, setDurs, key) });
    });

    tripTypes.forEach(key => {
      const item = filterLookup.tripTypes[key];
      if (item) chips.push({ key: `tt-${key}`, label: item.label, icon: item.icon, remove: () => toggle(tripTypes, setTripTypes, key) });
    });

    if (showFavouritesOnly) {
      chips.push({ key: 'fav-only', label: t('labels.favouritesOnly'), icon: '❤️', remove: () => setShowFavouritesOnly(false) });
    }

    return chips;
  }, [vibes, dists, durs, tripTypes, showFavouritesOnly, filterLookup, t]);

  const activeFiltersCount = activeFilterChips.length;

  React.useEffect(() => {
    const node = activeFiltersRowRef.current;
    if (!node) {
      setActivePillsUi({ hasOverflow: false, showLeftFade: false, showRightFade: false });
      return undefined;
    }

    const updatePillEdges = () => {
      const hasOverflow = node.scrollWidth > node.clientWidth + 1;
      const showLeftFade = hasOverflow && node.scrollLeft > 1;
      const showRightFade = hasOverflow && node.scrollLeft + node.clientWidth < node.scrollWidth - 1;
      setActivePillsUi({ hasOverflow, showLeftFade, showRightFade });
    };

    updatePillEdges();
    node.addEventListener('scroll', updatePillEdges, { passive: true });
    window.addEventListener('resize', updatePillEdges);

    return () => {
      node.removeEventListener('scroll', updatePillEdges);
      window.removeEventListener('resize', updatePillEdges);
    };
  }, [activeFiltersCount, filtersCollapsed, tab]);

  React.useEffect(() => {
    const onWindowWheel = (event) => {
      if (!isHoveringActiveFiltersRef.current) return;

      const node = activeFiltersRowRef.current;
      if (!node) return;

      const hasHorizontalOverflow = node.scrollWidth > node.clientWidth + 1;
      if (!hasHorizontalOverflow) return;

      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

      if (delta === 0) return;

      node.scrollLeft += delta;
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener('wheel', onWindowWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWindowWheel, { capture: true });
  }, [filtersCollapsed, activeFiltersCount, tab]);

  React.useEffect(() => {
    if (!hasAutoOpenedLocationPrompt.current && isFirstVisit && !userLocation && !dismissedLocationPrompt) {
      hasAutoOpenedLocationPrompt.current = true;
      setShowLocationSettings(true);
    }
  }, [isFirstVisit, userLocation, dismissedLocationPrompt]);

  React.useEffect(() => {
    if (userLocation) {
      setDismissedLocationPrompt(false);
    }
  }, [userLocation]);

  const openLocationSettings = () => {
    setDismissedLocationPrompt(false);
    setShowLocationSettings(true);
  };

  const closeLocationSettings = () => {
    setDismissedLocationPrompt(true);
    setShowLocationSettings(false);
  };

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
            <button
              onClick={showLocationSettings ? closeLocationSettings : openLocationSettings}
              className="settings-trigger-btn"
              title={t('labels.locationSettings')}
            >
              📍
            </button>
          </div>
          <h1>{t('app.title')}</h1>
          <p className="subtitle">
            {t('app.subtitle', { places: places.length, combos: combos.length })}
          </p>
        </div>
        {showLocationSettings && <LocationSettings onClose={closeLocationSettings} />}

        {/* Filters */}
        <div ref={filtersShellRef} className="filters-shell">
          {filtersCollapsed && (
            <div className="filter-summary-bar">
              <div className="filter-summary-left">
                <span className="filter-summary-count">
                  {activeFiltersCount > 0
                    ? t('filters.activeSummary', { count: activeFiltersCount })
                    : t('filters.noneSummary')}
                </span>
                {activeFiltersCount > 0 && (
                  <button className="filter-summary-clear" onClick={clearAllFilters}>
                    {t('filters.clearAll')}
                  </button>
                )}
              </div>

              <button className="filter-summary-toggle" onClick={showFiltersFromAnywhere}>
                {t('filters.edit')}
              </button>
            </div>
          )}

          {!filtersCollapsed && (
            <>
              <div className="filter-summary-bar">
                <div className="filter-summary-left">
                  <span className="filter-summary-count">
                    {activeFiltersCount > 0
                      ? t('filters.activeSummary', { count: activeFiltersCount })
                      : t('filters.noneSummary')}
                  </span>
                  {activeFiltersCount > 0 && (
                    <button className="filter-summary-clear" onClick={clearAllFilters}>
                      {t('filters.clearAll')}
                    </button>
                  )}
                </div>

                <button
                  className="filter-summary-toggle"
                  onClick={() => setFiltersCollapsed(true)}
                  aria-expanded={!filtersCollapsed}
                >
                  {t('filters.hide')}
                </button>
              </div>

              <div
                className={`active-filters-row-shell ${activePillsUi.hasOverflow ? 'has-overflow' : ''} ${activePillsUi.showLeftFade ? 'show-left-fade' : ''} ${activePillsUi.showRightFade ? 'show-right-fade' : ''}`}
              >
                <div
                  ref={activeFiltersRowRef}
                  className="active-filters-row"
                  aria-label={t('filters.selected')}
                  onWheel={handleActiveFiltersWheel}
                  onWheelCapture={handleActiveFiltersWheel}
                  onMouseEnter={() => { isHoveringActiveFiltersRef.current = true; }}
                  onMouseLeave={() => { isHoveringActiveFiltersRef.current = false; }}
                >
                  {activeFilterChips.map(chip => (
                    <button key={chip.key} className="active-filter-pill" onClick={chip.remove}>
                      <span>{chip.icon ? `${chip.icon} ` : ''}{chip.label}</span>
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>
              </div>

              {tab === 'places' ? (
                <>
                  <div className="primary-filters-grid">
                    <FilterBar label={t('filters.mood')} items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} />
                    <FilterBar label={t('filters.distance')} items={distanceRanges} active={dists} onSelect={(k) => toggle(dists, setDists, k)} />
                    <FilterBar label={t('filters.duration')} items={durationFilters} active={durs} onSelect={(k) => toggle(durs, setDurs, k)} />
                  </div>
                  <div className="filter-utility-row">
                    <label className="favourites-filter-label">
                      <input
                        type="checkbox"
                        checked={showFavouritesOnly}
                        onChange={e => setShowFavouritesOnly(e.target.checked)}
                      />
                      <span>{showFavouritesOnly ? '❤️' : '🤍'}</span>
                      {t('labels.favouritesOnly')}
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="primary-filters-grid combo-filters-grid">
                    <FilterBar label={t('filters.mood')} items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} />
                    <FilterBar label={t('filters.tripType')} items={tripTypeFilters} active={tripTypes} onSelect={(k) => toggle(tripTypes, setTripTypes, k)} />
                  </div>
                  <div className="filter-utility-row">
                    <label className="favourites-filter-label">
                      <input
                        type="checkbox"
                        checked={showFavouritesOnly}
                        onChange={e => setShowFavouritesOnly(e.target.checked)}
                      />
                      <span>{showFavouritesOnly ? '❤️' : '🤍'}</span>
                      {t('labels.favouritesOnly')}
                    </label>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {showFloatingFilterButton && (
          <button className="sticky-show-filters" onClick={showFiltersFromAnywhere}>
            {t('filters.edit')}
            {activeFiltersCount > 0 && <span className="sticky-show-filters-count">{activeFiltersCount}</span>}
          </button>
        )}

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
          <div key={`places-filter-${vibes.join('-')}-${dists.join('-')}-${durs.join('-')}`} className="list-container places-list">
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
          <div key={`combos-filter-${vibes.join('-')}-${tripTypes.join('-')}`} className="list-container combos-list">
            {filteredCombos.length === 0
              ? (
                <div className="empty-state">
                  <span style={{ fontSize:36 }}>🤷</span>
                  <p>{t('labels.noPlansMatch')}</p>
                </div>
              )
              : filteredCombos.map((c, i) => (
                <div key={c.id} className="fade-up" style={{ animationDelay:`${i*0.03}s` }}>
                  <ComboCard combo={c} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
