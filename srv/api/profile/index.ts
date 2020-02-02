import { Router } from 'express'
import getProfile from './get'
import updateProfile from './update'
import { follow, unfollow } from './follow'

export { router as default }

const router = Router()

router.get('/:id?', getProfile)
router.post('/:id/follow', follow)
router.post('/:id/unfollow', unfollow)
router.post('/', updateProfile)
