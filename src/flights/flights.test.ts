import { AirportMap, FlightMap, findShortestPath } from "./flights";
import { Coordinates } from "./calculateCoordinatesDistance";

function euclideanDistance(
  starting: Coordinates,
  destination: Coordinates
): number {
  return Math.sqrt(
    Math.pow(destination.latitude - starting.latitude, 2) +
      Math.pow(destination.longitude - starting.longitude, 2)
  );
}

const airports: AirportMap = {
  A: { code: "A", coordinates: { longitude: 0, latitude: 0 } },
  B: { code: "B", coordinates: { longitude: 1, latitude: 1 } },
  C: { code: "C", coordinates: { longitude: 1, latitude: 2 } },
  D: { code: "D", coordinates: { longitude: 4, latitude: 3 } },
  E: { code: "E", coordinates: { longitude: 4, latitude: 1 } },
  F: { code: "F", coordinates: { longitude: 6, latitude: 2 } },
  G: { code: "G", coordinates: { longitude: 8, latitude: 0 } },
  H: { code: "H", coordinates: { longitude: 6, latitude: 4 } },
};

const flightMap: FlightMap = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F", "E"],
  D: ["G"],
  E: ["F"],
  F: ["G"],
  G: [],
};

describe("findShortestPath", () => {
  it("should find the shortest path", () => {
    const path = findShortestPath(
      { from: "A", to: "G", maxHops: 10 },
      {
        airports,
        flightMap,
        calculateDistance: euclideanDistance,
      }
    );

    expect(path?.sections).toEqual([
      { from: "A", to: "B" },
      { from: "B", to: "E" },
      { from: "E", to: "F" },
      { from: "F", to: "G" },
    ]);
  });

  it("should not exceed maximum hops", () => {
    const path = findShortestPath(
      { from: "A", to: "G", maxHops: 3 },
      {
        airports,
        flightMap,
        calculateDistance: euclideanDistance,
      }
    );

    expect(path?.sections).toEqual([
      { from: "A", to: "B" },
      { from: "B", to: "D" },
      { from: "D", to: "G" },
    ]);
  });

  it("should handle absence of path", () => {
    const path = findShortestPath(
      { from: "A", to: "H", maxHops: 3 },
      {
        airports,
        flightMap,
        calculateDistance: euclideanDistance,
      }
    );

    expect(path).toEqual(null);
  });
});
