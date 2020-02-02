import './create-post.scss'
import * as React from 'react'
import { withState } from '/store'
import { Modal, Header, Body, Footer } from '../modal'

type Thumb = { file: File; content: any }

export const CreatePostModal = withState(
  ({ post }) => ({ open: post.modal.open }),
  ({ open, dispatch }) => {
    const [content, setContent] = React.useState('')
    const [files, setFiles] = React.useState<Thumb[]>([])

    React.useEffect(() => {
      if (!open) {
        setContent('')
        setFiles([])
      }
    }, [open])

    const onClose = () => dispatch({ type: 'POST_CLOSE_MODAL' })
    const onSubmit = () =>
      dispatch({ type: 'POST_REQUEST_CREATE', content, attachments: files.map(file => file.file) })

    const addFiles = async (filelist: FileList | null) => {
      if (!filelist) return
      const buffers = Array.from(filelist).map(getBuffer)
      const nextFiles = await Promise.all(buffers)
      setFiles(files.concat(nextFiles))
    }

    const thumbs = files.map((file, i) => (
      <div className="post-modal__thumb" key={i}>
        <img src={file.content} />
      </div>
    ))

    return (
      <div className="post-modal">
        <Modal open={open}>
          <Header>Create Post</Header>
          <Body>
            <textarea
              value={content}
              onChange={ev => setContent(ev.currentTarget.value)}
              onDrop={ev => {
                ev.preventDefault()
                addFiles(ev.dataTransfer.files)
              }}
            ></textarea>
            <div className="post-modal__thumbs">{thumbs}</div>
            <div className="post-modal__options">
              <label className="button light" htmlFor="post-attach">
                Attach
              </label>
              <input
                type="file"
                multiple
                accept="image/png,image/gif,image/jpeg"
                className="button light"
                id="post-attach"
                style={{ display: 'none' }}
                onChange={ev => addFiles(ev.target.files)}
              />
            </div>
          </Body>
          <Footer>
            <div className="post-modal__buttons">
              <button className="button" onClick={onClose}>
                Cancel
              </button>
              <button className="button light" onClick={onSubmit}>
                Create
              </button>
            </div>
          </Footer>
        </Modal>
      </div>
    )
  }
)

function getBuffer(file: File) {
  return new Promise<Thumb>(resolve => {
    let content: any
    const reader = new FileReader()
    reader.onload = ev => {
      content = ev.target?.result!
    }
    reader.onloadend = () => resolve({ file, content })
    reader.readAsDataURL(file)
  })
}
