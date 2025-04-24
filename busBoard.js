import fetch from 'node-fetch';
import {config} from 'dotenv';
config();

const API_KEY = process.env.API_KEY;
const STOP_CODE = '490008660N';
const url = `https://api.tfl.gov.uk/StopPoint/${STOP_CODE}/Arrivals?app_key=${API_KEY}`;
//let sortedBusArrivals = {}

async function getBusArrivals() {

    const fetchBus = await fetch(url);
    const busData = await fetchBus.json();
    const sortedBusArrivals = busData.sort((a,b) => a.timeToStation - b.timeToStation);
    
    return sortedBusArrivals;
};
const sortedBusArrivals = await getBusArrivals();

console.log(sortedBusArrivals);
