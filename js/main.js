// main.js — ties the route data to the route-card UI and the map.

async function init() {
  const res = await fetch('data/routes.json');
  const routes = await res.json();

  const list = document.getElementById('route-list');

  routes.forEach((route, index) => {
    const card = document.createElement('article');
    card.className = 'route-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Show ${route.name} on the map`);

    card.innerHTML = `
      <h3>${route.name}</h3>
      <p class="terrain">${route.terrain} &middot; ${route.gridRef}</p>
      <div class="route-stats">
        <span><strong>${route.distanceKm} km</strong>distance</span>
        <span><strong>${route.ascentM} m</strong>ascent</span>
      </div>
    `;

    const showOnMap = () => {
      const hideOthers = document.getElementById('hide-others-toggle').checked;
      loadRoute(route, { fitBounds: true, hideOthers });
      document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    card.addEventListener('click', showOnMap);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showOnMap();
      }
    });

    list.appendChild(card);

    // Load the first route onto the map automatically so it's not empty on arrival
    if (index === 0) loadRoute(route, { fitBounds: true });
  });
}

init();
