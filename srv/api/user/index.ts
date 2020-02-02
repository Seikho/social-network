import { Router } from 'express'
import { register } from './register'

export { router as default }

const router = Router()

router.post('/register', register)
