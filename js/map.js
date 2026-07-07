// map.js — sets up the shared Leaflet map instance.
// Centred roughly on West Berkshire; adjust to taste.

const map = L.map('map', {
  center: [51.42, -1.32],
  zoom: 11,
  scrollWheelZoom: false // avoids hijacking the page scroll — click the map to enable
});

// Re-enable scroll zoom once the user actually interacts with the map
map.on('focus', () => map.scrollWheelZoom.enable());
map.on('blur', () => map.scrollWheelZoom.disable());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
