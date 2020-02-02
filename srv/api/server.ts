import * as cors from 'cors'
import { Router } from 'express'
import user from './user'
import profile from './profile'
import post from './post'
import search from './search'
import { create } from 'svcready'
import { auth } from '../db'

const { app, start, sockets, stop } = create({
  port: 3000,
  auth,
})

app.use(cors())

const router = Router()

router.use('/user', user)
router.use('/profile', profile)
router.use('/post', post)
router.use('/search', search)
app.use('/api', router)

export { app, start, sockets, stop }
