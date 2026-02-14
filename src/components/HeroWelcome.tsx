import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import type { UserLocation } from '../types/domain';

interface HeroWelcomeProps {
  onComplete: () => void;
}

export function HeroWelcome({ onComplete }: HeroWelcomeProps) {
  const { updateLocation, useCurrentLocation, loading, error } = useLocation();
  const { language, t } = useLanguage();
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!input.trim()) {
      setLocalError(t('errors.locationRequired'));
      return;
    }
    try {
      await updateLocation(input);
      onComplete();
    } catch (e) {
      setLocalError(t('errors.locationNotFound'));
    }
  };

  const handleUseMyLocation = async () => {
    try {
      await useCurrentLocation();
      onComplete();
    } catch (e) {
      setLocalError(t('errors.locationFailed'));
    }
  };

  const handleSaveWithLocation = async (loc: UserLocation) => {
    try {
      await updateLocation(loc.address);
      onComplete();
    } catch (e) {
      setLocalError(t('errors.locationNotFound'));
    }
  };

  return (
    <div className="hero-welcome-container">
      <div className="hero-welcome-content">
        <h1 className="display-5 fw-bold text-center mb-3">{t('app.title')}</h1>
        <p className="text-center text-secondary mb-4 fs-5">
          {t('labels.locationMissing')}
        </p>
        
        <div className="hero-welcome-form">
          <label className="form-label fw-semibold mb-2">{t('labels.yourLocation')}</label>
          <LocationAutocompleteInput
            language={language}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSelect={(loc) => {
              setInput(loc.address);
              handleSaveWithLocation(loc);
            }}
            placeholder={t('labels.locationPlaceholder')}
            className="form-control mb-3"
            disabled={loading}
          />
          <div className="d-grid gap-2 mb-3">
            <button 
              onClick={handleSave} 
              disabled={loading} 
              className="btn btn-primary btn-lg"
            >
              {t('actions.save')}
            </button>
          </div>
          <div className="text-center text-secondary small mb-3">{t('labels.or')}</div>
          <button 
            onClick={handleUseMyLocation} 
            disabled={loading} 
            className="btn btn-outline-secondary btn-lg w-100"
          >
            {t('actions.useMyLocation')}
          </button>
          
          {(error || localError) && (
            <div className="alert alert-danger mt-3 mb-0 py-2">
              {error || localError}
            </div>
          )}
          {loading && (
            <div className="text-secondary small mt-3 text-center">
              {t('labels.loading')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
