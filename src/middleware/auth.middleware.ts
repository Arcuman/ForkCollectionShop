import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import AuthenticationTokenMissingException from "../exceptions/auth/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/auth/WrongAuthenticationTokenException";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import User from "../user/user.entity";
import TokenPayload from "../interfaces/tokenPayload.interface";
import { Container } from "typeorm-typedi-extensions";
import UserService from "../user/user.service";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies;
  if (!cookies || !cookies.Authentication) {
    next(new AuthenticationTokenMissingException());
    return;
  }
  const secret = process.env.JWT_ACCESS_SECRET;
  try {
    const payload = jwt.verify(cookies.Authentication, secret) as TokenPayload;
    const id = payload.userId;
    console.log(id);
    const userService = Container.get(UserService);
    const user = await userService.getById(id);
    console.log(1);
    if (!user) {
      next(new WrongAuthenticationTokenException());
    }
    request.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;
