import { handle, StatusError } from 'svcready'
import { Domain, profiles } from '../../domain/profile'

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

  if (body.nickname) updates.push({ type: 'UpdateNickname', name: body.nickname })

  if (body.description) {
    updates.push({ type: 'UpdateDescription', description: body.description })
  }

  if (updates.length === 0) throw new StatusError('No changes specified', 400)

  for (const update of updates) {
    switch (update.type) {
      case 'UpdateDescription':
        await profiles.cmd.UpdateDescription(userId, update)
        break

      case 'UpdateNickname':
        await profiles.cmd.UpdateNickname(userId, update)
        break

      case 'VerifyProfile':
        break

      default:
        throwNever(update)
    }
  }

  res.json({ message: 'ok' })
})

function throwNever(_: never) {
  throw new Error('Unexpected update type')
}
