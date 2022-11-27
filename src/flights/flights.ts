import rawFlights from "../../datasets-raw/flights.json";
import rawAirports from "../../datasets-raw/airports.json";
import {
  Coordinates,
  calculateCoordinatesDistance,
} from "./calculateCoordinatesDistance";

interface ShortestPathRequest {
  from: string;
  to: string;
  maxHops: number;
}

type IATACode = string;

interface RawAirport {
  iata_code: IATACode;
  _geoloc: {
    lng: number;
    lat: number;
  };
}

interface Airport {
  code: IATACode;
  coordinates: Coordinates;
}

interface AirportMap {
  [key: IATACode]: Airport;
}

interface RawFlight {
  "source airport": IATACode;
  "destination apirport": IATACode;
}

interface FlightMap {
  [key: IATACode]: IATACode[];
}

interface Node {
  code: IATACode;
  airport: Airport;
  prev: Node | null;
  distance: number;
  hops: number;
}

interface NodeMap {
  [key: IATACode]: Node;
}

function tracePath(node: Node) {
  const length = node.hops + 1;
  const path = new Array(length);
  for (let i = length - 1; i >= 0 && node.prev !== null; ++i) {
    path[i] = node;
    node = node.prev;
  }
  return path;
}

export function findShortestPath({ from, to }: ShortestPathRequest) {
  const airports: AirportMap = {};
  rawAirports.forEach((item) => {
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

  const queue = new Array<Node>();
  const visitedNodes: NodeMap = {};
  const discoveredNodes: NodeMap = {};

  const firstNode: Node = {
    code: from,
    airport: airports[from],
    prev: null,
    distance: 0,
    hops: 0,
  };

  queue.unshift(firstNode);

  while (queue.length > 0) {
    const node = queue[queue.length - 1];
    queue.pop();

    const connections = flightMap[node.code];
    connections.forEach((nextCode) => {
      if (visitedNodes[nextCode]) {
        return;
      }

      let nextNode = discoveredNodes[nextCode];
      if (!nextNode) {
        const nextAirport = airports[nextCode];
        nextNode = {
          code: nextCode,
          airport: nextAirport,
          prev: node,
          distance: calculateCoordinatesDistance(
            node.airport.coordinates,
            nextAirport.coordinates
          ),
          hops: node.hops + 1,
        };

        discoveredNodes[nextCode] = nextNode;
      } else {
        const distance = calculateCoordinatesDistance(
          node.airport.coordinates,
          nextNode.airport.coordinates
        );

        if (distance < nextNode.distance) {
          nextNode.distance = distance;
          nextNode.prev = node;
          nextNode.hops = node.hops + 1;
        }
      }
    });

    visitedNodes[node.code] = node;
    if (node.code === to) {
      return tracePath(node);
    }
  }
  return [];
}
