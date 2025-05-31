export interface ActivityData {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  location: string;
  lat: number;
  lng: number;
  minAge: number;
  maxAge: number;
  file?: any;
  type: string;
  duration: number;
  availability: Date;
}
