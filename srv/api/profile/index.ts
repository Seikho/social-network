import { Router } from 'express'
import getProfile from './get'
import updateProfile from './update'
export { router as default }

const router = Router()

router.get('/:id?', getProfile)
router.post('/', updateProfile)
