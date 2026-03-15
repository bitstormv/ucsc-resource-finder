import placesData from './places.json';

export interface Place {
  id: string;
  name: string;
  building: string;
  floor: string;
  category: string;
  description: string;
  directions: string;
  imageUrl?: string;
  floorPlanUrl?: string;
  hours?: string;
  accessibility?: string;
  contact?: string;
}

export const DEFAULT_PLACES: Place[] = placesData as Place[];
