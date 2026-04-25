export class User {
  constructor(
    public id: string,
    public email: string,
    public passwordHash: string,
    public fullName: string | null,
    public createdAt: Date,
    public maxAllowedBusinesses: number,
  ) {}
}
