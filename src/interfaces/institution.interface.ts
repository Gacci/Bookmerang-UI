export interface Institution {
  institutionId: number;
  dapipId: number;
  opeId: string;
  ipedsUnitIds: string;
  locationName: string;
  parentDapipId: string;
  locationType: string;
  generalPhone: string;
  adminName: string;
  adminPhone: string;
  adminEmail: string;
  fax: string;
  website: string;
  alias: string;
  source: string;
  status: string;
  location: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  zipExt: string;
  lat: string;
  lon: string;
  updateDate: string | null;
}
