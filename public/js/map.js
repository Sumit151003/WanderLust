let map = L.map('map').setView(coords, 13);
let tileUrl = 'https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=f3483ef0d22048598b900d3bd60996c2';
L.tileLayer(tileUrl, {
            maxZoom: 10,
        }).addTo(map);
map.scrollWheelZoom.disable();
let marker = L.marker(coords).addTo(map);
marker.bindPopup(`<b>${coords}</b><br>Exact location will be provided after booking.`).openPopup();