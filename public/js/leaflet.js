var map = L.map('map');

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let lat1 = Number(lat); 
let lon1 = Number(lon); 

var marker ;
async function forwardGeocoding() {
  let lat1 = Number(lat); 
  let lon1 = Number(lon); 
  marker = L.marker([lat1, lon1]).addTo(map).bindPopup(placeName).openPopup();
  map.setView([lat1, lon1], 13);
};
forwardGeocoding();

// Run once when the page loads
// async function forwardGeocoding() {
//   if (!placeName) return;

//   const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json`;
//   try {
//     const res = await fetch(url);
//     const data = await res.json();

//     if (data.length > 0) {
//       const lat = data[0].lat;
//       const lon = data[0].lon;

      // marker = L.marker([lat, lon]).addTo(map).bindPopup(placeName).openPopup();
      // map.setView([lat, lon], 13);
//     } else {
//       console.error("Location not found.");
//     }
//   } catch (err) {
//     console.error("Geocoding failed:", err);
//   }
// };

