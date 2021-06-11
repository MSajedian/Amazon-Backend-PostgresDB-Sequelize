import express from "express"
import { writeProductsPictures } from "../lib/fs-tools.js"
import multer from "multer"

const filesRouter = express.Router()

filesRouter.post("/upload", multer().single("productPic"), async (req, res, next) => {
  try {
    console.log(req.file)
    await writeProductsPictures(req.file.originalname, req.file.buffer)
    res.send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default filesRouter
