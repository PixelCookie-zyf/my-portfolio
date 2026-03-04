export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  current?: boolean;
}

export const visitedCities: City[] = [
  // Current
  { name: "Shanghai", country: "China", lat: 31.23, lng: 121.47, current: true },
  // China domestic
  { name: "Fuzhou", country: "China", lat: 26.07, lng: 119.30 },
  { name: "Beijing", country: "China", lat: 39.90, lng: 116.40 },
  { name: "Changsha", country: "China", lat: 28.23, lng: 112.94 },
  { name: "Wuhan", country: "China", lat: 30.59, lng: 114.31 },
  { name: "Nanjing", country: "China", lat: 32.06, lng: 118.80 },
  { name: "Changzhou", country: "China", lat: 31.81, lng: 119.97 },
  { name: "Suzhou", country: "China", lat: 31.30, lng: 120.62 },
  { name: "Chongqing", country: "China", lat: 29.56, lng: 106.55 },
  { name: "Shenzhen", country: "China", lat: 22.54, lng: 114.06 },
  { name: "Zhuhai", country: "China", lat: 22.27, lng: 113.58 },
  { name: "Guangzhou", country: "China", lat: 23.13, lng: 113.26 },
  // International
  { name: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69 },
  { name: "Sydney", country: "Australia", lat: -33.87, lng: 151.21 },
  { name: "Brisbane", country: "Australia", lat: -27.47, lng: 153.03 },
  { name: "New York", country: "USA", lat: 40.71, lng: -74.01 },
  { name: "Los Angeles", country: "USA", lat: 34.05, lng: -118.24 },
  { name: "Boston", country: "USA", lat: 42.36, lng: -71.06 },
  { name: "Bali", country: "Indonesia", lat: -8.34, lng: 115.09 },
] as const;
