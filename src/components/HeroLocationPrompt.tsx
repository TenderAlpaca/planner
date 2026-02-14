import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import type { UserLocation } from '../types/domain';

interface HeroLocationPromptProps {
  onSkip?: () => void;
}

export default function HeroLocationPrompt({ onSkip }: HeroLocationPromptProps) {
  const { updateLocation, useCurrentLocation, loading, error } = useLocation();
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!input.trim()) {
      setLocalError(t('errors.locationRequired'));
      return;
    }
    try {
      await updateLocation(input);
    } catch (e) {
      setLocalError(t('errors.locationNotFound'));
    }
  };

  const handleUseMyLocation = async () => {
    try {
      await useCurrentLocation();
    } catch (e) {
      setLocalError(t('errors.locationFailed'));
    }
  };

  return (
    <div className="hero-location-prompt">
      <div className="hero-content">
        <div className="hero-icon">📍</div>
        <h1 className="hero-title">{t('hero.welcome')}</h1>
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <p className="hero-instruction">{t('hero.getStarted')}</p>
        
        <div className="hero-actions">
          <LocationAutocompleteInput
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setLocalError(null);
            }}
            onSelect={(location) => {
              updateLocation(location.address).catch(() => {
                setLocalError(t('errors.locationNotFound'));
              });
            }}
            placeholder={t('labels.locationPlaceholder')}
            className="hero-location-input"
          />

          {(localError || error) && (
            <div className="alert alert-danger mt-2 mb-0" role="alert">
              {localError || error}
            </div>
          )}

          <div className="hero-buttons">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleSave}
              disabled={loading || !input.trim()}
            >
              {loading ? t('labels.loading') : t('actions.save')}
            </button>

            <div className="hero-divider">
              <span>{t('labels.or')}</span>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary btn-lg"
              onClick={handleUseMyLocation}
              disabled={loading}
            >
              📍 {t('actions.useMyLocation')}
            </button>
          </div>

          {onSkip && (
            <button
              type="button"
              className="btn btn-link text-muted mt-3"
              onClick={onSkip}
            >
              {t('actions.skipForNow')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
