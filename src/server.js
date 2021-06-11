import express from "express";
import cors from "cors";
import sequelize from "./db/index.js";
import services from "./services/index.js";
import endpointsList from "express-list-endpoints";
import filesRoutes from "./files/index.js"

const server = express();

server.use(cors());
server.use(express.json());
server.use("/", services);
server.use("/products", filesRoutes)

const port = process.env.PORT || 5000;

sequelize.sync({ force: false, alter: false })
  .then(() => {
    server.listen(port, () => console.log("server is running: " + port));
    server.on("error", (error) => console.info(" ❌ Server is not running due to : ", error));
    console.table(endpointsList(server));
  })
  .catch((e) => console.log(e));
