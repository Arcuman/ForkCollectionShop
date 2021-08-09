import HttpException from "./HttpException";

class ForkNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `Fork with id ${id} not found`);
  }
}

export default ForkNotFoundException;
