import { Router } from 'express'
import createPost, { get } from './create'
import { getPost, getUserPosts } from './get'
import { show, hide } from './visible'

export { router as default }

const router = Router()

router.post('/:id/show', show)
router.post('/:id/hide', hide)
router.post('/', createPost)
router.get('/asset/:file', get)
router.get('/:id', getPost)
router.get('/:id/posts', getUserPosts)
