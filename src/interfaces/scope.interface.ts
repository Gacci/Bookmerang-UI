import { UserRefInstitution } from './user-ref-institution.interface';

export interface Scope extends UserRefInstitution {
  locationName: string;
}
