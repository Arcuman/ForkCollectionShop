import HttpException from "./HttpException";

class CategoryNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `Category with id ${id} not found`);
  }
}

export default CategoryNotFoundException;
