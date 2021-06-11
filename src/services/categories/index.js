import express from "express";
import { Category, Product } from "../../db/index.js";
const router = express.Router();

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      const data = await Category.findAll({ order: [['id', 'ASC']], include: Product });
      res.send(data);
    } catch (e) {
      console.log(e);
    }
  })
  .post(async (req, res, next) => {
    try {
      console.log(req.body);
      const data = await Category.create(req.body);
      res.send(data);
    } catch (e) {
      console.log(e);
    }
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Category.findByPk(req.params.id)
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
      const data = await Category.update(req.body, { where: { id: req.params.id }, returning: true })
      res.send(data[1][0])
    } catch (e) {
      console.log(e);
      next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const data = await Category.destroy({ where: { id: req.params.id } })
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
