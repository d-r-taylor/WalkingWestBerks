// elevation-chart.js — draws/updates a Chart.js line chart from a GPX
// track's elevation data.

let elevationChart = null;

function updateElevationChart(route, elevationData) {
    const canvas = document.getElementById('elevation-chart');
    if (!canvas || !elevationData || elevationData.length === 0) return;

    // elevationData is an array of [distanceKm, elevationM] pairs.
    const labels = elevationData.map(point => point[0].toFixed(1));
    const elevations = elevationData.map(point => point[1]);

    const titleEl = document.getElementById('elevation-title');
    if (titleEl) titleEl.textContent = `Elevation - ${route.name}`;

    if (elevationChart) {
        elevationChart.data.labels = labels;
        elevationChart.data.datasets[0].data = elevations;
        elevationChart.update();
        return;
    }

    elevationChart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: elevations,
                borderColor: '#C1652F',
                backgroundColor: 'rgba(193, 101, 47, 0.15)',
                borderWidth: 2,
                borderRadius: 0,
                fill: true,
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            scales: {
                x: { title: { display: true, text: 'Distance (km)' }, ticks: { maxTicksLimit: 8 } },
                y: { title: { display: true, text: 'Elevation (m)' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => `${items[0].label} km`,
                        label: (item) => `${item.formattedValue} m`
                    }
                }
            }
        }
    });
}