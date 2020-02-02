import * as uuid from 'uuid'
import { handle, StatusError } from 'svcready'
import { Domain, Schema, profiles } from '../../domain/profile'

type Body = {
  nickname?: string
  role?: string
  description?: string
}

export default handle(async (req, res) => {
  const userId = req.session.userId
  if (!userId) throw new StatusError('Unauthorized', 401)

  const body: Body = req.body
  const updates: Domain.SingleUpdate[] = []

  if (body.nickname) updates.push({ type: 'UpdateNickname', userId, name: body.nickname })
  if (body.role) {
    isValidRole(body.role)
    updates.push({ type: 'UpdateRole', userId, role: body.role })
  }
  if (body.description) {
    updates.push({ type: 'UpdateDescription', userId, description: body.description })
  }

  if (updates.length === 0) throw new StatusError('No changes specified', 400)

  const cmd = profiles.update.command

  for (const update of updates) {
    switch (update.type) {
      case 'UpdateDescription':
        await cmd.UpdateDescription(uuid.v4(), update)
        break

      case 'UpdateNickname':
        await cmd.UpdateNickname(uuid.v4(), update)
        break

      case 'UpdateRole':
        await cmd.UpdateRole(uuid.v4(), update)
        break

      case 'VerifyProfile':
        break

      default:
        throwNever(update)
    }
  }

  res.json({ message: 'ok' })
})

const roles = Object.entries(Schema.Role).map(pair => pair[1])

function isValidRole(role: any): asserts role is Schema.Role {
  const isRole = roles.includes(role)
  if (!isRole) throw new StatusError('Invalid "role" specified', 400)
}

function throwNever(_: never) {
  throw new Error('Unexpected update type')
}
