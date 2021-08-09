import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import { useContainer } from "typeorm";
import validateEnv from "./utils/validateEnv";
import { createConnection } from "typeorm";
import config from "./ormconfig";
import { Container } from "typedi";

validateEnv();

(async () => {
  try {
    useContainer(Container);
    await createConnection(config);
  } catch (error) {
    console.log(error);
    return error;
  }
  const app = new App();
  await app.initializeApp();
  app.listen();
})();
