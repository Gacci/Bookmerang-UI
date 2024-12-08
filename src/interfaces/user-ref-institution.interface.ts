export interface UserRefInstitution {
  userId: number;
  institutionId: number;
  isPrimary?: boolean;
  deletedOn: Date;
}
