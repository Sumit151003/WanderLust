let map = L.map('map').setView(coords, 13);
let tileUrl = `${process.env.MAP_URL}`;
L.tileLayer(tileUrl, {
            maxZoom: 10,
        }).addTo(map);
map.scrollWheelZoom.disable();
let marker = L.marker(coords).addTo(map);
marker.bindPopup(`<b>${coords}</b><br>Exact location will be provided after booking.`).openPopup();