import fetch from "node-fetch";
import { config } from "dotenv";
config();

const API_KEY = "d40a5d1e4ea34f13b25595a3ba3ee6d4";


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

const url = `https://api.tfl.gov.uk/StopPoint/?lat=${locationArray[1]}&lon=${locationArray[0]}%20&stopTypes=NaptanPublicBusCoachTram%20&radius=500&modes=bus`;
//let sortedBusArrivals = {}

async function getBusStops() {
  const fetchBus = await fetch(url);
  const busData = await fetchBus.json();
  return busData;
}
const sortedBusArrivals = await getBusStops();


function getCloseBusStops(busData){
  let nearestBusStops = {};
  //let busStopIDs = [];
  for (let i = 0; i < 2; i++) {
    nearestBusStops[busData.stopPoints[i].commonName] = busData.stopPoints[i].id;
  } 
  
  // for (let i =0; i<busStopIDs.length-1; i++) {
  //   getBusArrivals(busStopIDs[i],nearestBusStops[i]);
  // }
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


const nearestBusStops = getCloseBusStops(sortedBusArrivals);
getBusArrivals(nearestBusStops);

 const keys = Object.keys(nearestBusStops);
 const values = Object.values(nearestBusStops);

  getBusArrivals(keys,values);
 


 