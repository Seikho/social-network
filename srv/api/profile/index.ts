import { Router } from 'express'
import getProfile from './get'
import updateProfile from './update'
import { follow, unfollow } from './follow'
import * as relation from './relation'

export { router as default }

const router = Router()

router.get('/:id?', getProfile)
router.post('/:id/follow', follow)
router.post('/:id/unfollow', unfollow)
router.post('/', updateProfile)
router.post('/:id/relate', relation.request)
router.post('/:id/accept', relation.accept)
router.post('/:id/reject', relation.reject)
router.post('/:id/remove', relation.remove)
