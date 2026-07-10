// gpx-loader.js — loads a GPX track onto the shared map and
// returns the layer so calling code can zoom to it, remove it, etc.

const loadedTracks = {}; // routeId -> Leaflet GPX layer
const elevationCache = {} // routeId -> [[distanceKm, elevationM], ...]

function loadRoute(route, { fitBounds = false } = {}) {
  // Already loaded? just reuse it, including its elevation data.
  if (loadedTracks[route.id]) {
    if (fitBounds) map.fitBounds(loadedTracks[route.id].getBounds());
    if (elevationCache[route.id]) updateElevationChart(route, elevationCache[route.id]);
    return loadedTracks[route.id];
  }

  const track = new L.GPX(route.gpx, {
    async: true,
    marker_options: {
      startIconUrl: null,
      endIconUrl: null,
      shadowUrl: null
    },
    polyline_options: {
      color: '#C1652F', // --trail
      weight: 4,
      opacity: 0.85
    }
  });

  track.on('loaded', (e) => {
    if (fitBounds) map.fitBounds(e.target.getBounds());

    // leaflet-gpx parses this straight out of the GPX <ele> tags for you.
    const elevationData = e.target.get_elevation_data();
    elevationCache[route.id] = elevationData;
    updateElevationChart(route, elevationData);
  });

  track.addTo(map);
  loadedTracks[route.id] = track;
  return track;
}
