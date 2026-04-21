import type { Feature, Polygon } from "geojson";

export type Status = "Validated" | "In Progress" | "Critical" | "Conditional";

export type Parcel = {
  id: string;
  code: string;
  owner: string;
  farmName: string;
  commodity: string;
  country: string;
  province: string;
  areaHa: number;
  status: Status;
  centroid: [number, number];
  polygon: Feature<Polygon>;
  documents: string[];
  riskNotes: string[];
};

export type Batch = {
  id: string;
  code: string;
  commodity: string;
  quantityKg: number;
  status: Status;
  harvestDate: string;
  sourceParcelIds: string[];
  currentHolder: string;
};

export type Movement = {
  id: string;
  batchId: string;
  from: string;
  to: string;
  type: string;
  quantityKg: number;
  movedAt: string;
  reference: string;
};

export type ExportRecord = {
  id: string;
  reportId: string;
  jurisdiction: string;
  status: Status;
  createdAt: string;
  parcelCount: number;
  commodity: string;
};
