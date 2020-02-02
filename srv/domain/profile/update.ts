import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../provider'
import { Domain } from './types'
import { getUser } from '../../db'

export const update = createDomain<Domain.UpdateEvent, Domain.UpdateAgg, Domain.UpdateCmd>(
  {
    aggregate: () => ({ userId: '' }),
    fold: ev => ({ userId: ev.userId }),
    provider: getProvider<Domain.UpdateEvent>('profile_events'),
    stream: 'profile-update',
  },
  {
    async UpdateNickname(cmd) {
      await getUserCmd(cmd)
      return { type: 'NicknameUpdated', userId: cmd.userId, name: cmd.name }
    },
    async VerifyProfile(cmd) {
      await getUserCmd(cmd)
      return { type: 'ProfileVerified', userId: cmd.userId, verify: cmd.verify ?? true }
    },
    async UpdateRole(cmd) {
      await getUserCmd(cmd)
      return { type: 'RoleUpdated', userId: cmd.userId, role: cmd.role }
    },
    async UpdateDescription(cmd) {
      await getUserCmd(cmd)
      return { type: 'DescriptionUpdated', userId: cmd.userId, description: cmd.description }
    },
  }
)

async function getUserCmd(cmd: { userId: string }) {
  const user = await getUser(cmd.userId)
  if (!user) throw new CommandError('Invalid user', 'INVALID_USER')
  return user
}
