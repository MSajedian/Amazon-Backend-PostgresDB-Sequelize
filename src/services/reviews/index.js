import express from "express";
import { Review, User, Product, Category } from "../../db/index.js";
import sequelize from "../../db/index.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Review.findAll({
        include: [{ model: User }, { model: Product, include: Category }]
      });
      res.send(data);
    } catch (e) {
      console.log(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await Review.create(req.body);
      res.send("ok");
    } catch (e) {
      console.log(e);
    }
  });

router.route("/:userId/user").get(async (req, res, next) => {
  try {
    const data = await Review.findAll({
      where: { userId: req.params.userId },
      include: { model: Product, include: Category },
      attributes: [
        "productId",
        "userId",
        [sequelize.fn("count", "id"), "unitary_qty"],
        [sequelize.fn("sum", sequelize.col("product.price")), "unitary_price"],
      ],
      group: ["productId", "userId", "product.id", "product.category.id"],
    });

    // select count(*) from carts where "userId"=1

    const totalQty = await Review.count({ where: { userId: req.params.userId } });

    // select  sum(p.price)
    // from carts as c
    // inner join products as p
    // on p.id=c."productId"

    // where "userId"=1

    const totalPrice = await Review.sum("product.price", {
      where: { userId: req.params.userId },
      include: { model: Product, attributes: [] },
    });

    res.send({ data, totalQty, totalPrice });
  } catch (e) {
    console.log(e);
  }
});

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Review.findByPk(req.params.id)
      if (data) {
        res.send(data)
      } else {
        res.status(404).send("Not found");
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .put(async (req, res, next) => {
    try {
      const data = await Review.update(req.body, { where: { id: req.params.id }, returning: true })
      res.send(data[1][0])
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const data = await Review.destroy({ where: { id: req.params.id } })
      if (data > 0) {
        res.send('ok')
      } else {
        res.status(404).send('Not found')
      }
    } catch (e) {
      console.log(e);
      next(e);
    }
  });

export default router;
