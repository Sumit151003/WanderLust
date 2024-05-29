let map = L.map('map').setView(coords, 13);
let tileUrl = `https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=${process.env.Map_API_KEY}`;
L.tileLayer(tileUrl, {
            maxZoom: 10,
        }).addTo(map);
map.scrollWheelZoom.disable();
let marker = L.marker(coords).addTo(map);
marker.bindPopup(`<b>${coords}</b><br>Exact location will be provided after booking.`).openPopup();