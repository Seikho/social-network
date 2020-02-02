import { Router } from 'express'
import search from './search'

export { router as default }

const router = Router()

router.get('/:search', search)
