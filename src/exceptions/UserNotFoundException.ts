import HttpException from "./HttpException";

class UserNotFoundException extends HttpException {
  constructor({
    type,
    value,
  }: {
    type: "email" | "id";
    value: string | number;
  }) {
    super(404, `User with ${type} : ${value} not found`);
  }
}

export default UserNotFoundException;
