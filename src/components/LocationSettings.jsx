
import React, { useState } from 'react';
import '../styles/LocationSettings.css';
import { useLocation } from '../context/LocationContext';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';

export default function LocationSettings({ onClose }) {
  const { userLocation, updateLocation, useCurrentLocation, loading, error } = useLocation();
  const [input, setInput] = useState(userLocation?.address || '');
  const [localError, setLocalError] = useState(null);

  const handleSave = async () => {
    if (!input.trim()) {
      setLocalError('Please enter a location.');
      return;
    }
    try {
      await updateLocation(input);
      if (onClose) onClose();
    } catch (e) {
      setLocalError('Location not found. Please try again.');
    }
  };

  const handleUseMyLocation = async () => {
    try {
      await useCurrentLocation();
      if (onClose) onClose();
    } catch (e) {
      setLocalError('Could not get your location.');
    }
  };

  return (
    <div className="location-settings-modal">
      <h2>📍 Location Settings</h2>
      <label>Your Location</label>
      <LocationAutocompleteInput
        value={input}
        onChange={e => setInput(e.target.value)}
        onSelect={loc => {
          setInput(loc.address);
          handleSaveWithLocation(loc);
        }}
        placeholder="Enter address, city, or place"
        className="location-input"
        disabled={loading}
      />
      <button onClick={handleSave} disabled={loading} className="settings-btn">Save</button>
      <button onClick={onClose} disabled={loading} className="settings-btn cancel">Cancel</button>
      <div className="divider">or</div>
      <button onClick={handleUseMyLocation} disabled={loading} className="settings-btn full">Use My Location</button>
      {(error || localError) && <div className="error">{error || localError}</div>}
      {loading && <div className="loading">Loading...</div>}
    </div>
  );

  async function handleSaveWithLocation(loc) {
    try {
      await updateLocation(loc.address);
      if (onClose) onClose();
    } catch (e) {
      setLocalError('Location not found. Please try again.');
    }
  }
}
