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

filesRouter.post("/uploadMultiple", multer().array("multipleProfilePic", 2), async (req, res, next) => {
  try {
    const arrayOfPromises = req.files.map(file => writeProductsPictures(file.originalname, file.buffer))

    await Promise.all(arrayOfPromises)
    res.send()
  } catch (error) {
    console.log(error)
    next(error)
  }
})

filesRouter.get("/:fileName/download", async (req, res, next) => {
  try {
    // source (fileOnDisk, req, ...) --> destination (fileOnDisk, res, ...)
    // source --> readable stream, destination --> writable stream

    // source (fileOnDisk, req, ...) --> transform chunk by chunk (zip, csv) --> destination (fileOnDisk, res, ...)
    // source --> readable stream, transform --> transform stream, destination --> writable stream

    res.setHeader("Content-Disposition", `attachment; filename=${req.params.fileName}.gz`) // header needed to tell the browser to open the "save file as " window

    const source = readProductsPictures(req.params.fileName) // creates a readable stream on that file on disk
    const destination = res // response object is a writable stream used as the destination

    pipeline(source, zlib.createGzip(), destination, err => next(err)) // with pipeline we connect together a source and a destination
  } catch (error) {
    next(error)
  }
})

export default filesRouter
