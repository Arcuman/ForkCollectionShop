import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import UserWithThatEmailAlreadyExistsException from "../exceptions/auth/UserWithThatEmailAlreadyExistsException";
import CreateUserDto from "../user/user.dto";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/auth/WrongCredentialsException";
import UserService from "../user/user.service";
import PostgresErrorCode from "../exceptions/database/postgresErrorCode.enum";
import InternalServerErrorException from "../exceptions/InternalServerErrorException";
import { Service } from "typedi";

@Service()
class AuthenticationService {
  constructor(private readonly userService: UserService) {}
  public async register(userData: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      return await this.userService.create({
        ...userData,
        password: hashedPassword,
      });
    } catch (e) {
      console.error(e);
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserWithThatEmailAlreadyExistsException(userData.email);
      }
      throw new InternalServerErrorException();
    }
  }

  public async logIn(logInData: LogInDto) {
    try {
      const user = await this.userService.getByEmail(logInData.email);
      if (!user) {
        console.error(`User with this email not found ${logInData.email}`);
        throw new WrongCredentialsException();
      }
      const isPasswordMatching = this.userService.isPasswordMatching(
        user.id,
        logInData.password
      );
      if (isPasswordMatching) {
        return user;
      } else {
        throw new WrongCredentialsException();
      }
    } catch (e) {
      throw new WrongCredentialsException();
    }
  }

  public getCookieWithJwtAccessToken(userId: number) {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: `${process.env.JWT_ACCESS_SECRET_EXPIRES}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_ACCESS_SECRET_EXPIRES}`;
  }

  public getCookieWithJwtRefreshToken(userId: number) {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: `${process.env.JWT_REFRESH_SECRET_EXPIRES}s`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_SECRET_EXPIRES}`;
    return {
      cookie,
      token,
    };
  }
}

export default AuthenticationService;
