
import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import type { UserLocation } from '../types/domain';

interface LocationSettingsProps {
  onClose?: () => void;
}

export default function LocationSettings({ onClose }: LocationSettingsProps) {
  const { userLocation, updateLocation, useCurrentLocation, loading, error } = useLocation();
  const { language, t } = useLanguage();
  const [input, setInput] = useState(userLocation?.address || '');
  const [localError, setLocalError] = useState<string | null>(null);

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
        aria-label={t('labels.locationSettings')}
        onClick={(e) => e.stopPropagation()}
      >
      <div className="card-body p-4 p-sm-4">
      <h2 className="h4 mb-3 text-center text-sm-start">{t('labels.locationSettings')}</h2>
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
      <div className="d-grid gap-2 d-sm-flex mb-3">
        <button onClick={handleSave} disabled={loading} className="btn btn-primary flex-fill">{t('actions.save')}</button>
        <button onClick={onClose} className="btn btn-outline-secondary flex-fill">{t('actions.cancel')}</button>
      </div>
      <div className="text-center text-secondary small mb-3">{t('labels.or')}</div>
      <button onClick={handleUseMyLocation} disabled={loading} className="btn btn-warning w-100">{t('actions.useMyLocation')}</button>
      {(error || localError) && <div className="alert alert-danger mt-3 mb-0 py-2">{error || localError}</div>}
      {loading && <div className="text-secondary small mt-3">{t('labels.loading')}</div>}
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
