export interface EquipmentImage {
  url: string;
  publicId: string;
  cover?: boolean;
}

export interface Equipment {
  _id: string;
  title: string;
  referenceNumber: string;
  manufacturer: string;
  year: string;
  hours: string;
  location: string;
  price: string;
  status: string;
  images: EquipmentImage[];
  description?: string;
}