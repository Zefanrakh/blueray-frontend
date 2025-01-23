export type RequestShippingDto = {
  shipper_contact_name: string;
  shipper_contact_phone: string;
  shipper_contact_email: string;
  shipper_organization: string;
  origin_contact_name: string;
  origin_contact_phone: string;
  origin_address: string;
  origin_note: string;
  origin_postal_code: number;
  origin_coordinate: RequestShippingCoordinateDto;
  destination_contact_name: string;
  destination_contact_phone: string;
  destination_contact_email: string;
  destination_address: string;
  destination_postal_code: number;
  destination_note: string;
  destination_coordinate: RequestShippingCoordinateDto;
  courier_company: string;
  courier_type: string;
  delivery_type: string;
  order_note: string;
  items: RequestShippingDtoItem[];
};

export type RequestShippingCoordinateDto = {
  latitude: number;
  longitude: number;
};

export type RequestShippingDtoItem = {
  name: string;
  description: string;
  category: string;
  value: number;
  quantity: number;
  height: number;
  length: number;
  weight: number;
  width: number;
};
