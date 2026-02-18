export enum ServiceErrorCodes {
  EXISTS = 'EXISTS',
  NOTFOUND = 'NOT-FOUND',
  VALIDATION = 'VALIDATION',
}

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCodes,
    public readonly message: string,
  ) {
    super(code);
    this.name = 'ServiceError';
  }
}
