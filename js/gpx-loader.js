// gpx-loader.js — loads a GPX track onto the shared map and
// returns the layer so calling code can zoom to it, remove it, etc.

const loadedTracks = {}; // routeId -> Leaflet GPX layer

function loadRoute(route, { fitBounds = false } = {}) {
  // Already loaded? just reuse it.
  if (loadedTracks[route.id]) {
    if (fitBounds) map.fitBounds(loadedTracks[route.id].getBounds());
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
  });

  track.addTo(map);
  loadedTracks[route.id] = track;
  return track;
}
