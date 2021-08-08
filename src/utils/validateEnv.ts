import { cleanEnv, num, port, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    JWT_ACCESS_SECRET: str(),
    JWT_ACCESS_SECRET_EXPIRES: num(),
    JWT_REFRESH_SECRET: str(),
    JWT_REFRESH_SECRET_EXPIRES: num(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    PORT: port(),
  });
}

export default validateEnv;
