// 1. upload single file
// 2. upload multiple files
// 3. download files

import express from "express"
import { writeProductsPictures, readProductsPictures } from "../lib/fs-tools.js"
import multer from "multer"
import { pipeline } from "stream"
import zlib from "zlib"

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
