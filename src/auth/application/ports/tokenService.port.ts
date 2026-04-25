export interface SignTokenPayload {
  sub: string;
  email: string;
}

export abstract class TokenServicePort {
  abstract signToken(payload: SignTokenPayload): string;
  abstract verifyToken(token: string): any;
}
