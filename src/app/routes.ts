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

export const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Helllo World" });
});

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

routes.get("/route", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  const maxHops = 4;

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

  if (typeof from === "string" && typeof to === "string") {
    console.log(
      findShortestPath(
        { from, to, maxHops },
        { airports, flightMap, calculateDistance: calculateCoordinatesDistance }
      )
    );
    return res.json({ from, to });
  }

  return res.status(400).send();
});
