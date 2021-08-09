import HttpException from "./HttpException";

class InternalServerErrorException extends HttpException {
    constructor() {
        super(500, `Something went wrong`);
    }
}

export default InternalServerErrorException;
