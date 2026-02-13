// src/services/distanceService.js


const BATCH_SIZE = 25;

export async function calculateDistances(origin, destinations, language = 'en') {
  if (!window.google?.maps) {
    throw new Error('Google Maps not loaded');
  }
  const results = [];
  // Validate origin
  if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
    throw new Error('User location is not set or invalid. Please set your location.');
  }
  // Validate destinations
  const validDestinations = destinations.filter(d => typeof d.lat === 'number' && typeof d.lng === 'number');
  if (validDestinations.length !== destinations.length) {
    throw new Error('One or more places have invalid coordinates.');
  }
  for (let i = 0; i < validDestinations.length; i += BATCH_SIZE) {
    const batch = validDestinations.slice(i, i + BATCH_SIZE);
    const batchResults = await calculateBatch(origin, batch, language);
    results.push(...batchResults);
  }
  return results;
}

async function calculateBatch(origin, destinations, language) {
  return new Promise((resolve, reject) => {
    const service = new google.maps.DistanceMatrixService();
    // Validate again for safety
    if (!origin || typeof origin.lat !== 'number' || typeof origin.lng !== 'number') {
      throw new Error('User location is not set or invalid.');
    }
    const destLatLngs = destinations.map(d => {
      if (typeof d.lat !== 'number' || typeof d.lng !== 'number') {
        throw new Error('Invalid destination coordinates.');
      }
      return new google.maps.LatLng(d.lat, d.lng);
    });
    const originLatLng = new google.maps.LatLng(origin.lat, origin.lng);
    service.getDistanceMatrix(
      {
        origins: [originLatLng],
        destinations: destLatLngs,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        language,
      },
      (response, status) => {
        if (status === 'OK') {
          const results = response.rows[0].elements.map((element, index) => ({
            placeId: destinations[index].id,
            distance: element.distance?.value || 0,
            duration: element.duration?.value || 0,
            distanceText: element.distance?.text || 'N/A',
            durationText: element.duration?.text || 'N/A',
            status: element.status
          }));
          resolve(results);
        } else {
          reject(new Error(`Distance Matrix error: ${status}`));
        }
      }
    );
  });
}


