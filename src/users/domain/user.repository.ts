import { User } from './user.model';

export abstract class UserRepository {
  abstract save(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
}
