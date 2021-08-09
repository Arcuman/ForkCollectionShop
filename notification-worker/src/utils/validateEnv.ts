import { cleanEnv, port, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    RABBITMQ: str(),
  });
}

export default validateEnv;
