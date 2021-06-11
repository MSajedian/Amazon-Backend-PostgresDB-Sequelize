import express from "express";
const route = express.Router();

import cartsRoute from "./cart/index.js";
import categoriesRoute from "./categories/index.js";
import productsRoute from "./products/index.js";
import usersRoute from "./users/index.js";
import reviewsRoute from "./reviews/index.js";
route.use("/carts", cartsRoute);
route.use("/categories", categoriesRoute);
route.use("/products", productsRoute);
route.use("/users", usersRoute);
route.use("/reviews", reviewsRoute);

export default route;
