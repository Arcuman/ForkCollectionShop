import * as express from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../user/user.dto";
import AuthenticationService from "./authentication.service";
import LogInDto from "./login.dto";
import { NextFunction } from "express";
import UserService from "../user/user.service";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import { Service } from "typedi";
import InvalidRefreshTokenException from "../exceptions/auth/InvalidRefreshTokenException";
import * as jwt from "jsonwebtoken";
import TokenPayload from "../interfaces/tokenPayload.interface";

@Service()
class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();

  constructor(
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
    this.router.get(`${this.path}/refresh`, this.refresh);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    try {
      const user = await this.authenticationService.register(userData);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    try {
      const user = await this.authenticationService.logIn(logInData);
      const accessTokenCookie =
        this.authenticationService.getCookieWithJwtAccessToken(user.id);
      const { cookie: refreshTokenCookie, token: refreshToken } =
        this.authenticationService.getCookieWithJwtRefreshToken(user.id);

      await this.userService.setCurrentRefreshToken(refreshToken, user.id);

      request.res.setHeader("Set-Cookie", [
        accessTokenCookie,
        refreshTokenCookie,
      ]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = async (
    request: RequestWithUser,
    response: express.Response
  ) => {
    await this.userService.removeRefreshToken(request.user.id);
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
  //TODO: move it to auth service
  private refresh = async (
    request: RequestWithUser,
    response: express.Response,
    next: NextFunction
  ) => {
    const cookies = request.cookies;
    if (!cookies || !cookies.Refresh) {
      next(new InvalidRefreshTokenException());
    }
    const secret = process.env.JWT_REFRESH_SECRET;
    try {
      const payload = jwt.verify(cookies.Refresh, secret) as TokenPayload;
      const user = await this.userService.getUserIfRefreshTokenMatches(
        cookies.Refresh,
        payload.userId
      );
      if (!user) {
        next(new InvalidRefreshTokenException());
      }
      const accessTokenCookie =
        this.authenticationService.getCookieWithJwtAccessToken(user.id);
      request.res.setHeader("Set-Cookie", accessTokenCookie);
      response.send(user);
    } catch (e) {
      console.error(e);
      next(new InvalidRefreshTokenException());
    }
  };
}

export default AuthenticationController;
