import fetch from "node-fetch";
import { config } from "dotenv";
config();

const API_KEY = process.env.API_KEY;
const STOP_CODE = "490008660N";
const url = `https://api.tfl.gov.uk/StopPoint/${STOP_CODE}/Arrivals?app_key=${API_KEY}`;
//let sortedBusArrivals = {}

async function getBusArrivals() {
  const fetchBus = await fetch(url);
  const busData = await fetchBus.json();
  const sortedBusArrivals = busData.sort(
    (a, b) => a.timeToStation - b.timeToStation
  );

  return sortedBusArrivals;
}
const sortedBusArrivals = await getBusArrivals();

for (let i = 0; i < 5; i++) {
  console.log("Number " + sortedBusArrivals[i].lineName);
  console.log("Towards " + sortedBusArrivals[i].towards);
  console.log(
    Math.floor(sortedBusArrivals[i].timeToStation / 60) + "mins" + "\n"
  );
}

//console.log(sortedBusArrivals);
