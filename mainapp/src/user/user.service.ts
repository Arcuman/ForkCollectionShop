import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import User from "../user/user.entity";
import CreateUserDto from "./user.dto";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(userData: CreateUserDto) {
    const newUser = await this.userRepository.create({
      ...userData,
    });
    await this.userRepository.save(newUser);
    newUser.password = undefined;
    newUser.currentHashedRefreshToken = undefined;
    return newUser;
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new UserNotFoundException({ type: "id", value: id });
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new UserNotFoundException({ type: "email", value: email });
  }

  async isPasswordMatching(id: number, password: string) {
    const user = await this.userRepository.findOne(
      { id },
      {
        select: ["password"],
      }
    );
    return bcrypt.compare(user.password, password);
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.userRepository
      .createQueryBuilder()
      .where({ id: userId })
      .addSelect("User.currentHashedRefreshToken")
      .getOne();
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
    if (isRefreshTokenMatching) {
      user.currentHashedRefreshToken = undefined;
      return user;
    }
    return null;
  }
}

export default UserService;
