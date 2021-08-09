import "dotenv/config";
import "reflect-metadata";
import App from "./app";
import validateEnv from "./utils/validateEnv";

validateEnv();

(async () => {
  const app = new App();
  await app.initializeApp();
})();
