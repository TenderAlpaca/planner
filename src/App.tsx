import React, { useState, useMemo, useRef } from 'react';
import { fetchLocalizedData } from './data/localizedData';
import { PlaceCard } from './components/PlaceCard';
import { ComboCard } from './components/ComboCard';
import { FilterBar } from './components/FilterBar';
import { useLocation } from './context/LocationContext';
import { useLanguage } from './context/LanguageContext';
import SettingsModal from './components/SettingsModal';
import HeroLocationPrompt from './components/HeroLocationPrompt';
import { buildComboFilterSpecification, buildPlaceFilterSpecification } from './utils/filterSpecifications';
import { loadAccentPreference, loadThemePreference, saveAccentPreference, saveThemePreference } from './utils/storage';
import { accentOptions, accentPalettes } from './data/accentPalettes';
import type { Combo, FilterItem, LocalizedData, Place } from './types/domain';
import type { AccentPreference } from './data/accentPalettes';

type ThemePreference = 'light' | 'dark';


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
  const hasThemeInitialized = useRef(false);
  const initialUrlState = React.useMemo(() => readStateFromUrl(), []);
  const filtersShellRef = useRef<HTMLDivElement | null>(null);
  const activeFiltersRowRef = useRef<HTMLDivElement | null>(null);
  const isHoveringActiveFiltersRef = useRef(false);
  const hasAutoOpenedLocationPrompt = useRef(false);
  const { travelTimes, userLocation, isFirstVisit } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [showLocationSettings, setShowLocationSettings] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference | null>(() => loadThemePreference());
  const [accentPreference, setAccentPreference] = useState<AccentPreference>(() => loadAccentPreference() ?? 'blue');
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const emptyLocalizedData = useMemo<LocalizedData>(() => ({
    places: [],
    combos: [],
    categories: {},
    vibeFilters: [],
    distanceRanges: [],
    durationFilters: [],
    tripTypeFilters: [],
  }), []);
  const [localizedData, setLocalizedData] = useState<LocalizedData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const {
    places,
    combos,
    categories,
    vibeFilters,
    distanceRanges,
    durationFilters,
    tripTypeFilters,
  } = localizedData ?? emptyLocalizedData;

  React.useEffect(() => {
    let isActive = true;
    setIsDataLoading(true);
    setDataError(null);

    fetchLocalizedData(language)
      .then(data => {
        if (!isActive) return;
        setLocalizedData(data);
      })
      .catch(error => {
        if (!isActive) return;
        setLocalizedData(null);
        setDataError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => {
        if (!isActive) return;
        setIsDataLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [language]);

  React.useEffect(() => {
    document.title = t('meta.title');
    const description = t('meta.description');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t('meta.title'));
    }
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', language === 'hu' ? 'hu_HU' : 'en_US');
    }
  }, [t, language]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const effectiveTheme: ThemePreference = themePreference ?? (systemPrefersDark ? 'dark' : 'light');


  React.useEffect(() => {
    const root = document.documentElement;
    if (themePreference === null) {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', themePreference);
    }
    root.style.colorScheme = effectiveTheme;
    saveThemePreference(themePreference);
  }, [themePreference, effectiveTheme]);

  React.useEffect(() => {
    const root = document.documentElement;
    const palette = accentPalettes[accentPreference][effectiveTheme];

    root.style.setProperty('--app-bg-start', palette.bgStart);
    root.style.setProperty('--app-bg-end', palette.bgEnd);
    root.style.setProperty('--app-primary', palette.primary);
    root.style.setProperty('--app-primary-rgb', palette.primaryRgb);
    root.style.setProperty('--app-secondary', palette.secondary);
    root.style.setProperty('--app-secondary-rgb', palette.secondaryRgb);
    root.style.setProperty('--app-warning', palette.warning);
    root.style.setProperty('--app-warning-rgb', palette.warningRgb);
    root.style.setProperty('--app-danger', palette.danger);
    root.style.setProperty('--app-danger-rgb', palette.dangerRgb);
    root.style.setProperty('--app-favourite', palette.favourite);
    root.style.setProperty('--app-favourite-rgb', palette.favouriteRgb);
    root.style.setProperty('--app-sheet-bg', palette.sheetBg);
    root.style.setProperty('--app-sheet-border', palette.sheetBorder);
    root.style.setProperty('--app-sheet-text', palette.sheetText);
    root.style.setProperty('--app-sheet-text-strong', palette.sheetTextStrong);
    root.style.setProperty('--app-sheet-placeholder', palette.sheetPlaceholder);
    root.style.setProperty('--app-form-bg', palette.formBg);
    root.style.setProperty('--app-form-border', palette.formBorder);
    root.style.setProperty('--app-pac-item-border', palette.pacItemBorder);
    root.style.setProperty('--app-pac-hover-bg', palette.pacHoverBg);
    root.style.setProperty('--bs-primary-rgb', palette.primaryRgb);
    root.style.setProperty('--bs-secondary-rgb', palette.secondaryRgb);
    root.style.setProperty('--bs-warning-rgb', palette.warningRgb);
    root.style.setProperty('--bs-danger-rgb', palette.dangerRgb);
    root.style.setProperty('--bs-body-bg', palette.bodyBg);

    saveAccentPreference(accentPreference);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', palette.bodyBg);
    }

    if (!hasThemeInitialized.current) {
      hasThemeInitialized.current = true;
      window.requestAnimationFrame(() => {
        root.classList.add('theme-ready');
      });
    }
  }, [accentPreference, effectiveTheme]);

  React.useEffect(() => {
    if (isDataLoading || dataError) return;
    const vibeKeys = new Set(vibeFilters.map(item => item.key).filter(key => key !== 'all'));
    const distKeys = new Set(distanceRanges.map(item => item.key).filter(key => key !== 'all'));
    const durationKeys = new Set(durationFilters.map(item => item.key).filter(key => key !== 'all'));
    const tripTypeKeys = new Set(tripTypeFilters.map(item => item.key).filter(key => key !== 'all'));

    setVibes(prev => sanitizeSelection(prev, vibeKeys));
    setDists(prev => sanitizeSelection(prev, distKeys));
    setDurs(prev => sanitizeSelection(prev, durationKeys));
    setTripTypes(prev => sanitizeSelection(prev, tripTypeKeys));
    setTab(prev => (prev === 'places' || prev === 'combos' ? prev : 'places'));
  }, [vibeFilters, distanceRanges, durationFilters, tripTypeFilters, isDataLoading, dataError]);

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
    if (places.length === 0) return;
    const pool = filtered.length > 0 ? filtered : places;
    if (pool.length === 0) return;
    const rand = pool[Math.floor(Math.random() * pool.length)];
    setSurprise(rand);
    setShakeN(n => n + 1);
    setTimeout(() => document.getElementById('surprise-result')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const counts = { places: filtered.length, combos: filteredCombos.length };
  const isDataReady = !isDataLoading && !dataError && places.length > 0;
  const isInitialLoad = !hasLoadedOnce && isDataLoading;

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
    // Auto-opening of location settings removed - now using hero page for first visit
  }, [isFirstVisit, userLocation, dismissedLocationPrompt]);

  React.useEffect(() => {
    if (userLocation) {
      setDismissedLocationPrompt(false);
    }
  }, [userLocation]);

  React.useEffect(() => {
    if (!isDataLoading) {
      setHasLoadedOnce(true);
    }
  }, [isDataLoading]);

  const openLocationSettings = () => {
    setDismissedLocationPrompt(false);
    setShowLocationSettings(true);
  };

  const closeLocationSettings = () => {
    setDismissedLocationPrompt(true);
    setShowLocationSettings(false);
  };

  const handleSkipHero = () => {
    setDismissedLocationPrompt(true);
  };

  // Show hero page on first visit without location
  if (isFirstVisit && !userLocation && !dismissedLocationPrompt) {
    return <HeroLocationPrompt onSkip={handleSkipHero} />;
  }

  return (
    <div className="container py-4">
      <div className="mx-auto" style={{ maxWidth: 1140 }}>
        <div className={`text-center app-hero ${isInitialLoad ? 'is-loading' : 'is-ready'}`}>
          {!isInitialLoad && (
            <div className="d-flex justify-content-end align-items-center mb-2">
              <div className="header-controls" role="group" aria-label={t('labels.settings')}>
                <button
                  onClick={showLocationSettings ? closeLocationSettings : openLocationSettings}
                  className="btn btn-outline-primary btn-sm location-settings-trigger-btn"
                  title={t('labels.settings')}
                  aria-label={t('labels.settings')}
                >
                  ⚙️
                </button>
              </div>
            </div>
          )}
          <div className="app-hero-inner">
            <h1 className="display-6 fw-semibold app-hero-title">{t('app.title')}</h1>
            <p className="text-secondary mb-0 app-hero-subtitle">
              {isInitialLoad
                ? t('labels.loading')
                : t('app.subtitle', { places: places.length, combos: combos.length })}
            </p>
            {isInitialLoad && (
              <div className="app-hero-loader" aria-live="polite">
                <span className="app-hero-loader-dot" aria-hidden="true" />
                <span className="app-hero-loader-dot" aria-hidden="true" />
                <span className="app-hero-loader-dot" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        {showLocationSettings && (
          <SettingsModal
            onClose={closeLocationSettings}
            themePreference={themePreference}
            effectiveTheme={effectiveTheme}
            onThemeChange={setThemePreference}
            accentPreference={accentPreference}
            onAccentChange={setAccentPreference}
            accentOptions={accentOptions.map(option => ({
              ...option,
              swatch: accentPalettes[option.id][effectiveTheme].primary,
            }))}
          />
        )}

        {!isInitialLoad && (
          <div ref={filtersShellRef} className="card border-0 shadow-sm mb-3 filters-panel">
            <div className="card-body">
            {filtersCollapsed && (
              <div className="filters-summary-bar">
                <div className="filters-summary-left">
                  <span className="badge text-bg-secondary filters-summary-count">
                    {activeFiltersCount > 0
                      ? t('filters.activeSummary', { count: activeFiltersCount })
                      : t('filters.noneSummary')}
                  </span>
                  {activeFiltersCount > 0 && (
                    <button className="btn btn-sm btn-outline-secondary filters-summary-action" onClick={clearAllFilters}>
                      {t('filters.clearAll')}
                    </button>
                  )}
                </div>

                <div className="filters-summary-actions">
                  <button className="btn btn-sm btn-primary filters-summary-action" onClick={showFiltersFromAnywhere}>
                    {t('filters.edit')}
                  </button>
                </div>
              </div>
            )}

            {!filtersCollapsed && (
              <>
                <div className="filters-summary-bar">
                  <div className="filters-summary-left">
                    <span className="badge text-bg-secondary filters-summary-count">
                      {activeFiltersCount > 0
                        ? t('filters.activeSummary', { count: activeFiltersCount })
                        : t('filters.noneSummary')}
                    </span>
                    {activeFiltersCount > 0 && (
                      <button className="btn btn-sm btn-outline-secondary filters-summary-action" onClick={clearAllFilters}>
                        {t('filters.clearAll')}
                      </button>
                    )}
                  </div>

                  <div className="filters-summary-actions">
                    <button
                      className="btn btn-sm btn-outline-primary filters-summary-action"
                      onClick={() => setFiltersCollapsed(true)}
                      aria-expanded={!filtersCollapsed}
                    >
                      {t('filters.hide')}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div
                    ref={activeFiltersRowRef}
                    className="d-flex gap-2 overflow-auto pb-1 filters-chip-row"
                    aria-label={t('filters.selected')}
                    onWheel={handleActiveFiltersWheel}
                    onWheelCapture={handleActiveFiltersWheel}
                    onMouseEnter={() => { isHoveringActiveFiltersRef.current = true; }}
                    onMouseLeave={() => { isHoveringActiveFiltersRef.current = false; }}
                  >
                    {activeFilterChips.map(chip => (
                      <button key={chip.key} className="btn btn-sm btn-outline-secondary text-nowrap filters-chip" onClick={chip.remove}>
                        <span>{chip.icon ? `${chip.icon} ` : ''}{chip.label}</span>
                        <span aria-hidden="true">×</span>
                      </button>
                    ))}
                  </div>
                </div>

                {tab === 'places' ? (
                  <>
                    <div className="row g-2 mb-2">
                      <div className="col-12 col-lg-4"><FilterBar label={t('filters.mood')} items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} /></div>
                      <div className="col-12 col-lg-4"><FilterBar label={t('filters.distance')} items={distanceRanges} active={dists} onSelect={(k) => toggle(dists, setDists, k)} /></div>
                      <div className="col-12 col-lg-4"><FilterBar label={t('filters.duration')} items={durationFilters} active={durs} onSelect={(k) => toggle(durs, setDurs, k)} /></div>
                    </div>
                    <div className="form-check mb-2">
                      <label className="form-check-label d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
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
                    <div className="row g-2 mb-2">
                      <div className="col-12 col-lg-6"><FilterBar label={t('filters.mood')} items={vibeFilters} active={vibes} onSelect={(k) => toggle(vibes, setVibes, k)} /></div>
                      <div className="col-12 col-lg-6"><FilterBar label={t('filters.tripType')} items={tripTypeFilters} active={tripTypes} onSelect={(k) => toggle(tripTypes, setTripTypes, k)} /></div>
                    </div>
                    <div className="form-check mb-2">
                      <label className="form-check-label d-flex align-items-center gap-2">
                        <input
                          className="form-check-input"
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
          </div>
        )}

        {!isInitialLoad && showFloatingFilterButton && (
          <button className="btn btn-primary position-fixed bottom-0 end-0 m-3 rounded-pill shadow" onClick={showFiltersFromAnywhere}>
            {t('filters.edit')}
            {activeFiltersCount > 0 && <span className="badge text-bg-light ms-2">{activeFiltersCount}</span>}
          </button>
        )}

        {!isInitialLoad && (
          <button 
            onClick={(e) => { e.preventDefault(); doSurprise(); }}
            onTouchEnd={(e) => { e.preventDefault(); doSurprise(); }}
            className="btn btn-warning w-100 mb-3"
            disabled={!isDataReady}
          >
            <span key={shakeN} style={{ fontSize:22, pointerEvents:"none" }}>🎲</span>
            <span style={{ pointerEvents:"none" }} className="ms-2">{t('actions.surpriseMe')}</span>
          </button>
        )}

        {surprise && (
          <div id="surprise-result" className="card border-0 shadow-sm mb-3">
            <div className="card-body">
            <div className="text-uppercase text-secondary mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>{t('labels.todaysPick')}</div>
            <PlaceCard 
              place={surprise} 
              categories={categories}
              isFavourite={favouritePlaces.includes(surprise.id)}
              onToggleFavourite={() => toggleFavouritePlace(surprise.id)}
            />
            </div>
          </div>
        )}

        {!isInitialLoad && isDataLoading && (
          <div className="alert alert-secondary text-center mb-3">
            <span style={{ fontSize:30 }}>⏳</span>
            <p className="mb-0 mt-2">{t('labels.loading')}</p>
          </div>
        )}

        {!isDataLoading && dataError && (
          <div className="alert alert-danger text-center mb-3">
            <span style={{ fontSize:30 }}>⚠️</span>
            <p className="mb-0 mt-2">{t('errors.unknown')}</p>
          </div>
        )}

        {!isDataLoading && !dataError && (
          <>
            <ul className="nav nav-tabs mb-3">
              {[
                { key: 'places', label: `${t('labels.places')} (${counts.places})` },
                { key: 'combos', label: `${t('labels.plans')} (${counts.combos})` }
              ].map(t => (
                <li key={t.key} className="nav-item">
                  <button 
                    onClick={(e) => { e.preventDefault(); setTab(t.key); }}
                    onTouchEnd={(e) => { e.preventDefault(); setTab(t.key); }}
                    className={`nav-link ${tab === t.key ? 'active' : ''}`}
                  >
                    <span style={{ pointerEvents:"none" }}>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {tab === 'places' && (
              <div key={`places-filter-${vibes.join('-')}-${dists.join('-')}-${durs.join('-')}`} className="row g-3">
                {filtered.length === 0 ? (
                  <div className="col-12">
                    <div className="alert alert-secondary text-center mb-0">
                      <span style={{ fontSize:30 }}>🤷</span>
                      <p className="mb-0 mt-2">{t('labels.noPlacesMatch')}</p>
                    </div>
                  </div>
                ) : filtered.map((p, i) => (
                  <div key={p.id} className="col-12 col-md-6 col-xl-4">
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

            {tab === 'combos' && (
              <div key={`combos-filter-${vibes.join('-')}-${tripTypes.join('-')}`} className="row g-3">
                {filteredCombos.length === 0
                  ? (
                    <div className="col-12">
                      <div className="alert alert-secondary text-center mb-0">
                        <span style={{ fontSize:30 }}>🤷</span>
                        <p className="mb-0 mt-2">{t('labels.noPlansMatch')}</p>
                      </div>
                    </div>
                  )
                  : filteredCombos.map((c, i) => (
                    <div key={c.id} className="col-12 col-xl-6">
                      <ComboCard combo={c} />
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
