import fetch from "node-fetch";
import { config } from "dotenv";
config();

const API_KEY = "d40a5d1e4ea34f13b25595a3ba3ee6d4";
let postcode = "nw5 1tl";

async function getCoordinates(postcode) {
  try { const fetchLocation = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
  const locationData = await fetchLocation.json();
  const longLat = {longitude:locationData.result.longitude, latitude:locationData.result.latitude};
  return longLat;}

  catch (error)
{ console.log("Please Use a valid London Postcode");
  process.exit(1);
}
}

  const coordinates = await getCoordinates(postcode);



async function getNearestBusStops() {
  const fetchBus = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${coordinates.latitude}&lon=${coordinates.longitude}%20&stopTypes=NaptanPublicBusCoachTram%20&radius=500&modes=bus`);
  const busData = await fetchBus.json();
  console.log("checking bus stops...");
    let nearestBusStops = {};
    const nearestTwoBusStops = Math.min(busData.stopPoints.length, 2)
      if (busData.stopPoints.length !== 0) {
        for (let i = 0; i < nearestTwoBusStops; i++) {
        nearestBusStops[busData.stopPoints[i].commonName] = busData.stopPoints[i].id;
        }
      }
      else {
        console.log("No bus stops nearby");
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
  
  const numberOfBuses = Math.min(sortedBusArrivals.length, 5)

  for (let i = 0; i < numberOfBuses; i++) {
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
 

async function directionsToNearestBusStop (postcode,values,keys) {
  //console.log(values[0]);
  const fetchDirection = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${postcode}/to/${values[0]}`);
  const Directions = await fetchDirection.json();
  const Duration = Directions.journeys[0].duration;
  const instructions = Directions.journeys[0].legs[0].instruction.steps;
  console.log(`Directions to ${keys[0]} bus stop`);
  for (let i=0; i<instructions.length; i++){
    console.log(i+1 + ". " + instructions[i].descriptionHeading + " " + instructions[i].description + "\n");
  }
}
 directionsToNearestBusStop(postcode,values,keys);
