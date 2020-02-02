import { createDomain, CommandError } from 'evtstore'
import { getProvider } from '../provider'
import { Domain } from './types'

export const profile = createDomain<Domain.ProfileEvent, Domain.ProfileAgg, Domain.ProfileCmd>(
  {
    aggregate: () => ({ userId: '' }),
    stream: 'profile',
    fold: (ev, _) => {
      switch (ev.type) {
        case 'ProfileCreated':
          return { userId: ev.userId }
      }
    },
    provider: getProvider<Domain.ProfileEvent>(),
  },
  {
    Create: async (cmd, agg) => {
      if (agg.version !== 0) {
        throw new CommandError('Profile already exists', 'PROFILE_EXISTS')
      }

      return {
        type: 'ProfileCreated',
        userId: cmd.aggregateId,
      }
    },
  }
)
