import { handle, StatusError, encrypt, logger } from 'svcready'
import { table } from '../../db/client'
import { profiles } from '../../domain/profile'
import { getUser } from '../../db'

export const register = handle(async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) throw new StatusError('username or password not provided', 400)

  if (password.length < 4) {
    throw new StatusError('Password too short: Must be at least 4 characters', 400)
  }

  await createUser(username, password)

  req.session.userId = username
  res.json({ success: true })
})

async function createUser(username: string, password: string) {
  await profiles.cmd.Create(username, {})
  const hash = await encrypt(password)
  await table.users().insert({ user_id: username, hash })
}

// TODO: Remove

const users = ['foo', 'bar', 'baz', 'aaa', 'bbb', 'aaabbb', 'bbbccc', 'cccfoo']
export async function createUsers() {
  for (const user of users) {
    const existing = await getUser(user)
    if (existing) continue

    await createUser(user, 'test')
    logger.info(`Created ${user}`)
  }
}
