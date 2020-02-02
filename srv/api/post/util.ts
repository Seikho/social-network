import { promisify } from 'util'
import { writeFile, createReadStream, mkdirSync, readdirSync } from 'fs'
import { resolve, extname } from 'path'

// TODO: Replace with cloud storage...

const writeAsync = promisify(writeFile)
const folder = resolve(__dirname, '..', '..', '..', 'assets')

export async function saveFile(filename: string, content: any) {
  await writeAsync(resolve(folder, filename), content, { encoding: 'utf8' })
}

export function getFile(filename: string) {
  const stream = createReadStream(resolve(folder, filename))
  const type = getType(filename)
  return { stream, type }
}

function createAssetFolder() {
  try {
    readdirSync(folder)
  } catch (ex) {
    mkdirSync(folder)
  }
}

function getType(filename: string) {
  const ext = extname(filename)

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'

    case '.png':
      return 'image/png'

    case '.webm':
      return 'video/webm'

    case '.gif':
      return 'image/gif'
  }

  return 'octet-stream'
}

createAssetFolder()
