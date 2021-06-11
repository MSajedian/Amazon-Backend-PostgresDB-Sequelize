import express from "express";
import { Product, Category, Review } from "../../db/index.js";
import sequelize from "../../db/index.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      if (req.query.category) {
        const data = await Product.findAll({ include: Category });
        console.log('req.query.category:', req.query.category)
        console.log('category.name:', data[0].category.name)
        const filteredData = data.filter(data => data.category.name === req.query.category)
        res.send(filteredData);
      } else {
        const data = await Product.findAll({ include: Category });
        res.send(data);
      }
    } catch (e) {
      console.log(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      const data = await Product.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
    }
  });


router.route("/:id/reviews").get(async (req, res, next) => {
  try {
    const data = await Review.findAll({ where: { productId: req.params.id } });
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

router.route("/sortByCategory").get(async (req, res, next) => {
  try {
    const data = await Product.findAll({
      include: Category,
      attributes: ["categoryId", [sequelize.fn("count", "id"), "total_products"],],
      group: ["categoryId", "category.id"],
      // order: ["total_products", "DESC"],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Product.findByPk(req.params.id)
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
      const data = await Product.update(req.body, { where: { id: req.params.id }, returning: true })
      res.send(data[1][0])
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const data = await Product.destroy({ where: { id: req.params.id } })
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
