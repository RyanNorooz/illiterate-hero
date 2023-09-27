import { randomUUID } from 'crypto'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'
import { base64StringToBlob } from './base64Conversions'
import { getPlaiceholder } from 'plaiceholder'

export default async function saveFileToLocal(
  /** base64 string data url */
  file: string
) {
  const blob = await base64StringToBlob(file)
  const buffer = Buffer.from(await blob.arrayBuffer())
  const filename = randomUUID()
  await writeFile(join(cwd(), 'public/uploads/', filename), buffer)
  const url = join('/uploads/', filename).replaceAll('\\', '/')
  const { base64: placeholder } = await getPlaiceholder(buffer)

  return {
    /** a relative url for the file */
    url,
    /** small base64 version of image to use as placeholder */
    placeholder,
  }
}
