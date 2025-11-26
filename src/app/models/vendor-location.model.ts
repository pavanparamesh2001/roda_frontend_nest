// src/app/models/vendor-location.model.ts

// GeoJSON Point for branch location
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: number[]; // [lng, lat]
  address?: string;
  description?: string;
  branchState?: string;
  branchDistrict?: string;
  branchLocation?: string;
}

// Live tracking location
export interface LiveLocationPoint {
  type: 'Point';
  coordinates: number[]; // [lng, lat]
}

// DTO for create vendor location API
export class CreateVendorLocationDto {
  vendor!: string;
  branchName!: string;
  contactNo!: string;
  alternateNo?: string;
  workHours?: string;

  services!: {
    service: string;
    GST: number;
    baseFee: number;
    baseKm: number;
    extraCostPerKm: number;
    active: boolean;
  }[];

  // Main branch location (GeoJSON)
  location!: GeoJsonPoint;

  // Current live coordinates (GeoJSON)
  currentLocation!: LiveLocationPoint;
}
