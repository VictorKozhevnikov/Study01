export type Coordinates = {
  longitude: number,
  latitude: number
}

const degreesToRadians = (degrees: number) => {
  const radians = (degrees * Math.PI)/180;
  return radians;
}

export function calculateCoordinatesDistance (starting: Coordinates, destination: Coordinates): number {
  const startingLat = degreesToRadians(starting.latitude);
  const startingLong = degreesToRadians(starting.longitude);
  const destinationLat = degreesToRadians(destination.latitude);
  const destinationLong = degreesToRadians(destination.longitude);

  // Radius of the Earth in kilometers
  const radius: number = 6571;

  // Haversine equation
  const distanceInKilometers: number = Math.acos(Math.sin(startingLat) * Math.sin(destinationLat) +
  Math.cos(startingLat) * Math.cos(destinationLat) *
  Math.cos(startingLong - destinationLong)) * radius;

  return Math.floor(distanceInKilometers * 100) / 100;
}
