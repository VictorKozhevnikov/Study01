import { Coordinates } from "./calculateCoordinatesDistance";

export interface ShortestPathRequest {
  from: string;
  to: string;
  maxHops: number;
}

export type IATACode = string;

export interface Airport {
  code: IATACode;
  coordinates: Coordinates;
}

export interface AirportMap {
  [key: IATACode]: Airport;
}

export interface FlightMap {
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

interface Section {
  from: IATACode;
  to: IATACode;
}
interface Path {
  sections: Section[];
}

function tracePath(node: Node): Path {
  const length = node.hops;
  const sections = new Array<Section>(length);
  for (let i = length - 1; i >= 0 && node.prev !== null; --i) {
    sections[i] = {
      from: node.prev.code,
      to: node.code,
    };
    node = node.prev;
  }
  return { sections };
}

export type DistanceFunction = (
  starting: Coordinates,
  destination: Coordinates
) => number;
interface ShortestPathContext {
  airports: AirportMap;
  flightMap: FlightMap;
  calculateDistance: DistanceFunction;
}

export function findShortestPath(
  { from, to, maxHops }: ShortestPathRequest,
  context: ShortestPathContext
): Path | null {
  const { airports, flightMap, calculateDistance } = context;

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

    if (node.hops < maxHops) {
      // explore connections
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
            distance: calculateDistance(
              node.airport.coordinates,
              nextAirport.coordinates
            ),
            hops: node.hops + 1,
          };

          discoveredNodes[nextCode] = nextNode;
          queue.unshift(nextNode);
        } else {
          const distance = calculateDistance(
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
    }

    visitedNodes[node.code] = node;
    if (node.code === to) {
      return tracePath(node);
    }
  }
  
  return null;
}
