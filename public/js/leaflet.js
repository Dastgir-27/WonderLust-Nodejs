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


