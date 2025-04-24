import fetch from "node-fetch";
import { config } from "dotenv";
config();

const postUrl = "https://api.postcodes.io/postcodes/nw51tl";

async function getLongLat() {
  const fetchLocation = await fetch(postUrl);
  const locationData = await fetchLocation.json();
  const longLat = [];
  await longLat.push(locationData.result.longitude);
  await longLat.push(locationData.result.latitude);
  return longLat;
}

const locationArray = await getLongLat();

const API_KEY = process.env.API_KEY;
const STOP_CODE = "490008660N";
const url = `https://api.tfl.gov.uk/StopPoint/?lat=${locationArray[1]}&lon=${locationArray[0]}%20&stopTypes=NaptanPublicBusCoachTram%20&radius=500&modes=bus`;
//let sortedBusArrivals = {}

async function getBusArrivals() {
  const fetchBus = await fetch(url);
  const busData = await fetchBus.json();
  const sortedBusArrivals = busData.sort((a, b) => a.distance - b.distance);
  console.log(sortedBusArrivals);
  return sortedBusArrivals;
}
const sortedBusArrivals = await getBusArrivals();

for (let i = 0; i < 5; i++) {
  console.log("Number " + sortedBusArrivals[i].lineName);
  console.log("Towards " + sortedBusArrivals[i].towards);
  console.log(
    Math.floor(sortedBusArrivals[i].timeToStation / 60) + " mins" + "\n"
  );
}
