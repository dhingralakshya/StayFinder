class HttpErrors extends Error {
  constructor(message, errorCode) {
    super(message);
    this.message = message;
    this.statusCode = errorCode;
  }
}
module.exports = HttpErrors;