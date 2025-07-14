const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let { data } = require("./data.js");

const coordinatesMap = {
  "Malibu, United States": [-118.7798, 34.0259],
  "New York City, United States": [-74.006, 40.7128],
  "Aspen, United States": [-106.837, 39.1911],
  "Florence, Italy": [11.2558, 43.7696],
  "Portland, United States": [-122.6765, 45.5231],
  "Cancun, Mexico": [-86.8515, 21.1619],
  "Lake Tahoe, United States": [-120.0436, 39.0968],
  "Los Angeles, United States": [-118.2437, 34.0522],
  "Verbier, Switzerland": [7.2266, 46.0964],
  "Serengeti National Park, Tanzania": [34.8233, -2.3333],
  "Amsterdam, Netherlands": [4.9041, 52.3676],
  "Fiji, Fiji": [178.065, -17.7134],
  "Cotswolds, United Kingdom": [-1.8433, 51.833],
  "Boston, United States": [-71.0589, 42.3601],
  "Bali, Indonesia": [115.1889, -8.4095],
  "Banff, Canada": [-115.5708, 51.1784],
  "Miami, United States": [-80.1918, 25.7617],
  "Phuket, Thailand": [98.3981, 7.8804],
  "Scottish Highlands, United Kingdom": [-4.2026, 57.12],
  "Dubai, United Arab Emirates": [55.2708, 25.2048],
  "Montana, United States": [-110.3626, 46.8797],
  "Mykonos, Greece": [25.3295, 37.4467],
  "Costa Rica, Costa Rica": [-84.0739, 9.7489],
  "Charleston, United States": [-79.9311, 32.7765],
  "Tokyo, Japan": [139.6917, 35.6895],
  "New Hampshire, United States": [-71.5724, 43.1939],
  "Maldives, Maldives": [73.2207, 3.2028]
};

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const initDB = async () => {
  await Listing.deleteMany({});

  data = data.map((obj) => {
    const key = `${obj.location}, ${obj.country}`;
    const coords = coordinatesMap[key] || [0, 0]; // fallback
    return {
      ...obj,
      categories: "Trending",
      geometry: { type: "Point", coordinates: coords },
      owner: "6859328660ea18f934af70a6"
    };
  });

  await Listing.insertMany(data);
  console.log("Data saved!");
};
initDB();

//    const updates = [
//     { title: "Ski Chalet in Aspen", category: "Boats" },
//     { title: "Secluded Beach House in Costa Rica", category: "Castles" },//
//     { title: "Cozy Beachfront Cottage", category: "Boats" },
//     { title: "Modern Loft in Downtown", category: "Boats" },
//     { title: "Juhu Beach", category: "Trending" },
//     { title: "Mountain Retreat" , category: "Iconic Cities"},
//     { title: "Historic Villa in Tuscany" , category: "Rooms"},
//     { title: "Secluded Treehouse Getaway" , category: "Amazing Pools"},
//     { title: "Beachfront Paradise" , category: "Amazing Pools"},
//     { title: "Rustic Cabin by the Lake" , category: "Mountians"},
//     { title: "Luxury Penthouse with City Views" , category: "Iconic Cities"},
//     { title: "Ski-In/Ski-Out Chalet" , category: "Boats"},
//     { title: "Safari Lodge in the Serengeti" , category: "Arctic"},
//     { title: "Historic Canal House" , category: "Camping"},
//     { title: "Private Island Retreat" , category: "Castles"},
//     { title: "Charming Cottage in the Cotswolds" , category: "Iconic Cities"},
//     { title: "Historic Brownstone in Boston", category: "Trending" },
//     { title: "Beachfront Bungalow in Bali", category: "Camping" },
//     { title: "Mountain View Cabin in Banff", category: "Domes" },
//     { title: "Art Deco Apartment in Miami", category: "Arctic" },
//     { title: "Tropical Villa in Phuket", category: "Rooms" },
//     { title: "Historic Castle in Scotland", category: "Trending" },
//     { title: "Desert Oasis in Dubai", category: "Iconic Cities" },
//     { title: "Rustic Log Cabin in Montana", category: "Farms" },
//     { title: "Beachfront Villa in Greece", category: "Castles" },
//     { title: "Eco-Friendly Treehouse Retreat", category: "Iconic Cities" },
//     { title: "Historic Cottage in Charleston", category: "Rooms" },
//     { title: "Modern Apartment in Tokyo", category: "Iconic Cities" },
//     { title: "Lakefront Cabin in New Hampshire", category: "Camping" },
//     { title: "Luxury Villa in the Maldives", category: "Trending" },
//   ];


// const UpdateCategories = async () => {
//   for (const update of updates) {
//     await Listing.updateOne(
//       { title: update.title },
//       { $set: { categories: update.category } }
//     );
//     console.log(`Updated ${update.title} with category ${update.category}`);
//   }
// };
// UpdateCategories();
