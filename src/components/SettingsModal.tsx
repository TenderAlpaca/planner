import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import type { AccentPreference } from '../data/accentPalettes';
import type { ThemePreference } from '../utils/storage';
import type { UserLocation } from '../types/domain';

interface SettingsModalProps {
  onClose?: () => void;
  themePreference: ThemePreference | null;
  effectiveTheme: ThemePreference;
  onThemeChange: (theme: ThemePreference | null) => void;
  accentPreference: AccentPreference;
  onAccentChange: (accent: AccentPreference) => void;
  accentOptions: { id: AccentPreference; labelKey: string; swatch: string }[];
}

export default function SettingsModal({
  onClose,
  themePreference,
  effectiveTheme,
  onThemeChange,
  accentPreference,
  onAccentChange,
  accentOptions,
}: SettingsModalProps) {
  const { userLocation, updateLocation, useCurrentLocation, loading, error } = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [input, setInput] = useState(userLocation?.address || '');
  const [localError, setLocalError] = useState<string | null>(null);
  const systemThemeLabel = t('theme.system');
  const locationInputId = React.useId();
  const errorId = React.useId();

  const handleSave = async () => {
    if (!input.trim()) {
      setLocalError(t('errors.locationRequired'));
      return;
    }
    try {
      await updateLocation(input);
      if (onClose) onClose();
    } catch (e) {
      setLocalError(t('errors.locationNotFound'));
    }
  };

  const handleUseMyLocation = async () => {
    try {
      await useCurrentLocation();
      if (onClose) onClose();
    } catch (e) {
      setLocalError(t('errors.locationFailed'));
    }
  };

  return (
    <div className="location-settings-overlay" onClick={onClose} role="presentation">
      <div
        className="location-settings-panel card shadow border-0"
        role="dialog"
        aria-modal="true"
        aria-label={t('labels.settings')}
        aria-busy={loading}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-body p-4 p-sm-4">
          <h2 className="h4 mb-3 text-center text-sm-start">{t('labels.settings')}</h2>
          <div className="settings-section">
            <h3 className="h5 mb-2">{t('labels.locationSettings')}</h3>
            {!userLocation && (
              <div className="alert alert-warning location-missing mb-3">
                {t('labels.locationMissing')}
              </div>
            )}
            <label className="form-label fw-semibold mb-2" htmlFor={locationInputId}>{t('labels.yourLocation')}</label>
            <LocationAutocompleteInput
              language={language}
              id={locationInputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSelect={(loc) => {
                setInput(loc.address);
                handleSaveWithLocation(loc);
              }}
              placeholder={t('labels.locationPlaceholder')}
              className="form-control mb-3"
              disabled={loading}
              describedBy={(error || localError) ? errorId : undefined}
              autoFocus
              hasError={Boolean(error || localError)}
            />
            <div className="d-grid gap-2 d-sm-flex mb-3">
              <button onClick={handleSave} disabled={loading} className="btn btn-primary flex-fill">{t('actions.save')}</button>
            </div>
            <div className="text-center text-secondary small mb-3">{t('labels.or')}</div>
            <button onClick={handleUseMyLocation} disabled={loading} className="btn btn-warning w-100 w-lg-auto">{t('actions.useMyLocation')}</button>
          </div>
          <div className="settings-section">
            <div className="form-label fw-semibold mb-2">{t('theme.title')}</div>
            <div className="settings-toggle-row" role="group" aria-label={t('theme.title')}>
              <button
                type="button"
                className={`settings-toggle ${themePreference === null ? 'is-active' : ''}`}
                onClick={() => onThemeChange(null)}
                aria-pressed={themePreference === null}
              >
                {systemThemeLabel}
              </button>
              <button
                type="button"
                className={`settings-toggle ${themePreference === 'dark' ? 'is-active' : ''}`}
                onClick={() => onThemeChange('dark')}
                aria-pressed={themePreference === 'dark'}
              >
                {t('theme.dark')}
              </button>
              <button
                type="button"
                className={`settings-toggle ${themePreference === 'light' ? 'is-active' : ''}`}
                onClick={() => onThemeChange('light')}
                aria-pressed={themePreference === 'light'}
              >
                {t('theme.light')}
              </button>
            </div>
          </div>
          <div className="settings-section">
            <div className="form-label fw-semibold mb-2">{t('labels.language')}</div>
            <div className="settings-toggle-row" role="group" aria-label={t('labels.language')}>
              <button
                type="button"
                className={`settings-toggle ${language === 'hu' ? 'is-active' : ''}`}
                onClick={() => setLanguage('hu')}
                aria-pressed={language === 'hu'}
              >
                HU
              </button>
              <button
                type="button"
                className={`settings-toggle ${language === 'en' ? 'is-active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
            </div>
          </div>
          <div className="color-selector mt-4">
            <div className="form-label fw-semibold mb-2">{t('labels.accentColor')}</div>
            <div className="color-selector-swatches" role="group" aria-label={t('labels.accentColor')}>
              {accentOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`color-swatch ${accentPreference === option.id ? 'is-active' : ''}`}
                  onClick={() => onAccentChange(option.id)}
                  aria-pressed={accentPreference === option.id}
                  title={t(option.labelKey)}
                  style={{ '--swatch-color': option.swatch } as React.CSSProperties}
                >
                  <span className="color-swatch-dot" style={{ backgroundColor: option.swatch }} aria-hidden="true" />
                  <span className="color-swatch-label">{t(option.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
          {(error || localError) && (
            <div id={errorId} className="alert alert-danger mt-3 mb-0 py-2" role="alert">
              {error || localError}
            </div>
          )}
          {loading && <div className="text-secondary small mt-3" aria-live="polite">{t('labels.loading')}</div>}
        </div>
      </div>
    </div>
  );

  async function handleSaveWithLocation(loc: UserLocation) {
    try {
      await updateLocation(loc.address);
      if (onClose) onClose();
    } catch (e) {
      setLocalError(t('errors.locationNotFound'));
    }
  }
}
