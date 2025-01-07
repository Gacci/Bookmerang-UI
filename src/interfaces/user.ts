export interface User {
  userId: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  mobile?: string;
  verified?: boolean;
  majorId?: number;
  minorId?: number;
  institutionId?: number;
  profilePictureUrl?: string;
  status?: string;
  roles?: string;
  alternativeEmail?: string;
  joinedOn: string | Date;
  updatedOn: string | Date;
}
