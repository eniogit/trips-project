export class HttpError extends Error {
  constructor(
    public code: number,
    public message: string,
    public obj?: object,
  ) {
    super(message)
  }
}
