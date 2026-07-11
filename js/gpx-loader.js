// gpx-loader.js — loads a GPX track onto the shared map and
// returns the layer so calling code can zoom to it, remove it, etc.

const loadedTracks = {}; // routeId -> Leaflet GPX layer
const elevationCache = {} // routeId -> [[distanceKm, elevationM], ...]
let activeRouteId = null; // guards against out-of-order async GPX loads

function loadRoute(route, { fitBounds = false, hideOthers = false } = {}) {
  if (fitBounds) activeRouteId = route.id;
  
  // If the toggle is on, remove every other currently-visible track
  // from the map — but keep them in loadedTracks/elevationCache so
  // re-selecting one later doesn't mean re-fetching the GPX file.
  if (hideOthers) {
    Object.entries(loadedTracks).forEach(([id, layer]) => {
      if (id !== route.id && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
  }
  
  // Already loaded? just reuse it, including its elevation data.
  if (loadedTracks[route.id]) {
    if (!map.hasLayer(loadedTracks[route.id])) {
      loadedTracks[route.id].addTo(map);
    }
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
    const elevationData = e.target.get_elevation_data();
    elevationCache[route.id] = elevationData;

    // Only touch the map/chart if this is the most recently requested route -
    // an earlier click's fetch may resolve after a more recent one.
    if (route.id === activeRouteId) {
      if (fitBounds) map.fitBounds(e.target.getBounds());
      updateElevationChart(route, elevationData);
    }
  });


  track.addTo(map);
  loadedTracks[route.id] = track;
  return track;
}
