import * as mp from 'multiparty'
import { handle, StatusError } from 'svcready'
import { v4 } from 'uuid'
import { posts, Attachment } from '../../domain/post'
import { saveFile, getFile } from './util'
import { profiles } from '../../domain/profile'

export default handle(async (req, res) => {
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)

  const form = new mp.Form()

  const postId = v4().slice(0, 7)
  const { attachments, content } = await handleForm(form, req)

  const post = await posts.cmd.CreatePost(postId, { userId, attachments, content })
  const profile = await profiles.store.getProfile(userId)
  const model = posts.toModel(post, profile)
  return res.json(model)
})

export const get = handle(async (req, res) => {
  const filename = req.params.file
  const { stream, type } = getFile(filename)

  res.set('content-type', type)
  stream.on('error', err => res.status(404).send(err.message || err))
  stream.on('data', data => res.write(data))
  stream.on('close', () => res.send())
})

function handleForm(form: mp.Form, req: any) {
  let content = ''
  const attachments: Attachment[] = []
  const jobs: Promise<any>[] = []

  return new Promise<{ content: string; attachments: Attachment[] }>((resolve, reject) => {
    form.on('part', part => {
      const chunks: Buffer[] = []
      part.on('data', chunk => {
        chunks.push(chunk)
      })

      part.on('end', async () => {
        if (part.name !== 'file') {
          const data = Buffer.concat(chunks).toString()
          content = data
          part.resume()
          return
        }

        const type = part.headers['content-type']
        if (!isAllowedType(type)) {
          part.resume()
          return
        }

        const ext = type.split('/').slice(-1)[0]
        const filename = part.filename
        const data = Buffer.concat(chunks)
        const id = `${new Date().toISOString()}_${v4().slice(0, 7)}.${ext}`.split(':').join('-')

        attachments.push({ filename: id, type, original: filename })
        jobs.push(saveFile(id, data))
        part.resume()
      })
    })

    form.on('close', async () => {
      try {
        await Promise.all(jobs)
        resolve({ content, attachments })
      } catch (ex) {
        reject(ex)
      }
    })

    form.on('error', err => reject(err))

    form.parse(req)
  })
}

function isAllowedType(contentType: string) {
  switch (contentType) {
    case 'image/jpeg':
    case 'image/jpg':
    case 'image/png':
      return true
  }

  return false
}
