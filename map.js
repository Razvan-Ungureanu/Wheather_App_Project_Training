let map;
let marker;

/* Pornesc harta din Bucuresti(default) si pun un marker initial */
export function initMap() {
  if (map) return map;

  map = L.map("map").setView([44.4323, 26.1063], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  marker = L.marker([44.4323, 26.1063]).addTo(map);
  return map;
}

export function updateMap({ lat, lon, popupHtml }) {
  initMap();
  map.setView([lat, lon], 11);
  marker.setLatLng([lat, lon]);

  if (popupHtml) marker.bindPopup(popupHtml).openPopup();

  /* Leaflet are nevoie de refresh */
  setTimeout(() => map.invalidateSize(), 0);
}
