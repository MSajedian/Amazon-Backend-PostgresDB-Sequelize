import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { writeFile, createReadStream } = fs

const productsFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/products")

export const writeProductsPictures = async (fileName, content) => await writeFile(join(productsFolderPath, fileName), content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

