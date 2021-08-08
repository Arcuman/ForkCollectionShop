import HttpException from "../HttpException";

class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super(400, "Invalid Refresh Token");
  }
}

export default InvalidRefreshTokenException;
