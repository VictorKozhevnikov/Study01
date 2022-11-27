import { Router } from "express";
import {
  findShortestPath,
  IATACode,
  AirportMap,
  FlightMap,
} from "../flights/flights";
import { calculateCoordinatesDistance } from "../flights/calculateCoordinatesDistance";
import rawFlights from "../../datasets-raw/flights.json";
import rawAirports from "../../datasets-raw/airports.json";

interface RawAirport {
  iata_code: IATACode;
  _geoloc: {
    lng: number;
    lat: number;
  };
}

interface RawFlight {
  "source airport": IATACode;
  "destination apirport": IATACode;
}

const airports: AirportMap = {};
rawAirports.forEach((item: RawAirport) => {
  airports[item.iata_code] = {
    code: item.iata_code,
    coordinates: {
      latitude: item._geoloc.lat,
      longitude: item._geoloc.lng,
    },
  };
});

const flightMap: FlightMap = {};
rawFlights.forEach((item: RawFlight) => {
  const source = item["source airport"];
  const destination = item["destination apirport"];

  let connections = flightMap[source];
  if (!connections) {
    connections = new Array<IATACode>();
    flightMap[source] = connections;
  }

  if (!connections.includes(destination)) {
    connections.push(destination);
  }
});

export const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Helllo World" });
});

routes.get("/route", (req, res) => {
  const defaultMaxFlights = 4;

  const from = req.query.from;
  const to = req.query.to;
  const maxFlightsQuery = req.query.maxFlights;
  let maxFlights = defaultMaxFlights;
  if (typeof maxFlightsQuery === "string") {
    maxFlights = parseInt(maxFlightsQuery, 10);
  }

  if (typeof from === "string" && typeof to === "string") {
    try {
      return res.json({
        path: findShortestPath(
          { from, to, maxHops: maxFlights },
          {
            airports,
            flightMap,
            calculateDistance: calculateCoordinatesDistance,
          }
        ),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  return res.status(400).send();
});
