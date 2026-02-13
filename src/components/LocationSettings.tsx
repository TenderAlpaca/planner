
import React, { useState } from 'react';
import '../styles/LocationSettings.scss';
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
    <div className="location-settings-modal">
      <h2>{t('labels.locationSettings')}</h2>
      <label>{t('labels.yourLocation')}</label>
      <LocationAutocompleteInput
        language={language}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSelect={(loc) => {
          setInput(loc.address);
          handleSaveWithLocation(loc);
        }}
        placeholder={t('labels.locationPlaceholder')}
        className="location-input"
        disabled={loading}
      />
      <button onClick={handleSave} disabled={loading} className="settings-btn">{t('actions.save')}</button>
      <button onClick={onClose} className="settings-btn cancel">{t('actions.cancel')}</button>
      <div className="divider">{t('labels.or')}</div>
      <button onClick={handleUseMyLocation} disabled={loading} className="settings-btn full">{t('actions.useMyLocation')}</button>
      {(error || localError) && <div className="error">{error || localError}</div>}
      {loading && <div className="loading">{t('labels.loading')}</div>}
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
