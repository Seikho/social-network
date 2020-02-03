import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../provider'
import { Domain } from './types'
import { getUser } from '../../db/auth'

export const profile = createDomain<Domain.Event, Domain.Aggregate, Domain.Command>(
  {
    stream: 'profile',
    provider: getProvider<Domain.Event>('profile_events'),
    aggregate: () => ({
      following: false,
      userId: '',
      nickname: '',
      verified: true,
      description: '',
    }),
    fold: ev => {
      switch (ev.type) {
        case 'ProfileCreated':
          return { userId: ev.userId }

        case 'DescriptionUpdated':
          return { description: ev.description }

        case 'NicknameUpdated':
          return { nickname: ev.name }

        case 'ProfileVerified':
          return { verified: ev.verify }
      }
    },
  },
  {
    async Create(cmd, agg) {
      if (agg.version !== 0) {
        throw new CommandError('Profile already exists', 'PROFILE_EXISTS')
      }

      return {
        type: 'ProfileCreated',
        userId: cmd.aggregateId,
      }
    },
    async UpdateNickname(cmd) {
      await getUserCmd(cmd)
      return { type: 'NicknameUpdated', name: cmd.name }
    },
    async VerifyProfile(cmd) {
      await getUserCmd(cmd)
      return { type: 'ProfileVerified', verify: cmd.verify ?? true }
    },
    async UpdateDescription(cmd) {
      await getUserCmd(cmd)
      return { type: 'DescriptionUpdated', description: cmd.description }
    },
  }
)

async function getUserCmd(cmd: { aggregateId: string }) {
  const user = await getUser(cmd.aggregateId)
  if (!user) throw new CommandError('Invalid user', 'INVALID_USER')
  return user
}
