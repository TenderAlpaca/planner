export const messages = {
  en: {
    meta: {
      title: 'Weekend Escape - 95+ Places in Southern Hungary',
    },
    app: {
      title: 'Weekend Escape',
      subtitle: '{{places}} places • {{combos}} ready-made plans • Day trips to weekend getaways',
    },
    filters: {
      mood: 'MOOD',
      distance: 'DISTANCE',
      duration: 'DURATION',
      tripType: 'TRIP TYPE',
      clear: 'clear',
      clearAll: 'Clear all',
      edit: 'Edit filters',
      hide: 'Hide filters',
      activeSummary: '{{count}} active',
      noneSummary: 'No filters active',
      selected: 'Selected filters',
    },
    actions: {
      surpriseMe: 'SURPRISE ME',
      viewOnMaps: '📍 View on Maps',
      save: 'Save',
      cancel: 'Cancel',
      useMyLocation: 'Use My Location',
    },
    labels: {
      todaysPick: "TODAY'S PICK ✨",
      favouritesOnly: 'Favourites only',
      places: 'Places',
      plans: 'Plans',
      noPlacesMatch: 'No places match. Try different filters.',
      noPlansMatch: 'No plans match. Try different filters.',
      loading: 'Loading...',
      calculating: '⏳ Calculating...',
      distanceUnavailable: 'Distance unavailable',
      locationSettings: '📍 Location Settings',
      yourLocation: 'Your Location',
      locationPlaceholder: 'Enter address, city, or place',
      or: 'or',
    },
    tripType: {
      weekend: '🌙 Weekend',
      day: '☀️ Day Trip',
    },
    favourites: {
      add: 'Add to favourites',
      remove: 'Remove from favourites',
      favourite: 'Favourite',
      unfavourite: 'Unfavourite',
    },
    errors: {
      mapsNotLoaded: 'Google Maps not loaded yet',
      locationRequired: 'Please enter a location.',
      locationNotFound: 'Location not found. Please try again.',
      locationFailed: 'Could not get your location.',
      geolocationNotSupported: 'Geolocation not supported',
      mapsApiMissing: 'Google Maps API key not configured',
      mapsLoadFailed: 'Failed to load Google Maps',
      invalidUserLocation: 'User location is not set or invalid. Please set your location.',
      invalidDestination: 'One or more places have invalid coordinates.',
      unknown: 'Something went wrong. Please try again.',
    },
    location: {
      currentLocation: 'Current Location',
      settingsTitle: 'Location Settings',
    },
  },
  hu: {
    meta: {
      title: 'Weekend Escape - 95+ hely Dél-Magyarországon',
    },
    app: {
      title: 'Weekend Escape',
      subtitle: '{{places}} hely • {{combos}} kész programterv • Egynapos kirándulásoktól a hétvégi kikapcsolódásig',
    },
    filters: {
      mood: 'HANGULAT',
      distance: 'TÁVOLSÁG',
      duration: 'IDŐTARTAM',
      tripType: 'KIRÁNDULÁS TÍPUSA',
      clear: 'törlés',
      clearAll: 'Összes törlése',
      edit: 'Szűrők szerkesztése',
      hide: 'Szűrők elrejtése',
      activeSummary: '{{count}} aktív',
      noneSummary: 'Nincs aktív szűrő',
      selected: 'Aktív szűrők',
    },
    actions: {
      surpriseMe: 'LEPJ MEG',
      viewOnMaps: '📍 Megnyitás a térképen',
      save: 'Mentés',
      cancel: 'Mégse',
      useMyLocation: 'Saját helyzet használata',
    },
    labels: {
      todaysPick: 'MAI AJÁNLAT ✨',
      favouritesOnly: 'Csak kedvencek',
      places: 'Helyek',
      plans: 'Tervek',
      noPlacesMatch: 'Nincs találat. Próbálj más szűrőket.',
      noPlansMatch: 'Nincs találat. Próbálj más szűrőket.',
      loading: 'Betöltés...',
      calculating: '⏳ Számítás...',
      distanceUnavailable: 'Távolság nem elérhető',
      locationSettings: '📍 Helybeállítások',
      yourLocation: 'Tartózkodási helyed',
      locationPlaceholder: 'Adj meg címet, várost vagy helyet',
      or: 'vagy',
    },
    tripType: {
      weekend: '🌙 Hétvége',
      day: '☀️ Egynapos',
    },
    favourites: {
      add: 'Hozzáadás a kedvencekhez',
      remove: 'Eltávolítás a kedvencek közül',
      favourite: 'Kedvenc',
      unfavourite: 'Nem kedvenc',
    },
    errors: {
      mapsNotLoaded: 'A Google Térkép még nem töltött be',
      locationRequired: 'Adj meg egy helyet.',
      locationNotFound: 'A hely nem található. Próbáld újra.',
      locationFailed: 'Nem sikerült lekérni a helyzetedet.',
      geolocationNotSupported: 'A geolokáció nem támogatott',
      mapsApiMissing: 'A Google Maps API kulcs nincs beállítva',
      mapsLoadFailed: 'A Google Térkép betöltése sikertelen',
      invalidUserLocation: 'A felhasználói helyzet hiányzik vagy hibás. Állítsd be a helyzetedet.',
      invalidDestination: 'Egy vagy több hely koordinátája érvénytelen.',
      unknown: 'Hiba történt. Próbáld újra.',
    },
    location: {
      currentLocation: 'Jelenlegi helyzet',
      settingsTitle: 'Helybeállítások',
    },
  },
};

export function translateMessage(language, key, params = {}) {
  const activeLanguage = messages[language] ? language : 'en';
  const fallback = messages.en;
  const segments = key.split('.');

  const value = segments.reduce((acc, segment) => acc?.[segment], messages[activeLanguage])
    ?? segments.reduce((acc, segment) => acc?.[segment], fallback)
    ?? key;

  if (typeof value !== 'string') {
    return key;
  }

  return value.replace(/{{(\w+)}}/g, (_, paramKey) => {
    const paramValue = params[paramKey];
    return paramValue === undefined || paramValue === null ? '' : String(paramValue);
  });
}
