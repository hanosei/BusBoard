import fetch from "node-fetch";
import { config } from "dotenv";
config();

const API_KEY = "d40a5d1e4ea34f13b25595a3ba3ee6d4";


async function getCoordinates() {
  const fetchLocation = await fetch("https://api.postcodes.io/postcodes/nw51tl");
  const locationData = await fetchLocation.json();
  const longLat = {longitude:locationData.result.longitude, latitude:locationData.result.latitude};
  return longLat;
}

const coordinates = await getCoordinates();

async function getNearestBusStops() {
  const fetchBus = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coordinates.latitude}&lon=${coordinates.longitude}%20&stopTypes=NaptanPublicBusCoachTram%20&radius=500&modes=bus`);
  const busData = await fetchBus.json();
  let nearestBusStops = {};
  for (let i = 0; i < 2; i++) {
    nearestBusStops[busData.stopPoints[i].commonName] = busData.stopPoints[i].id;
  } 
  
  return nearestBusStops;
}

async function getBusArrivals(keys,values) {
  for (let i=0; i<keys.length;i++) {
  const fetchBus = await fetch(`https://api.tfl.gov.uk/StopPoint/${values[i]}/Arrivals?app_key=${API_KEY}`);
  const busData = await fetchBus.json();
  const sortedBusArrivals = busData.sort(
    (a, b) => a.timeToStation - b.timeToStation
  );
  console.log("At bus stop: " + keys[i] + "\n");
  get5Buses(sortedBusArrivals);
  }
}

function get5Buses(sortedBusArrivals) {
  
  for (let i = 0; i < 5; i++) {
    console.log("Number " + sortedBusArrivals[i].lineName);
    console.log("Towards " + sortedBusArrivals[i].towards);
    console.log(
      Math.floor(sortedBusArrivals[i].timeToStation / 60) + "mins" + "\n"
    );
  }
}

const sortedBusArrivals = await getNearestBusStops();
getBusArrivals(sortedBusArrivals);

 const keys = Object.keys(sortedBusArrivals);
 const values = Object.values(sortedBusArrivals);

getBusArrivals(keys,values);
 


 