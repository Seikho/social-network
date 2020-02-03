import { handle, StatusError } from 'svcready'
import { toDto } from './util'
import { profiles } from '../../domain/profile'

export default handle(async (req, res) => {
  const id = req.params.id || req.session.userId

  if (!id) {
    throw new StatusError('Profile not specified', 400)
  }

  const profile = await profiles.store.getProfile(id)
  if (!profile) {
    throw new StatusError('Profile not found', 404)
  }

  const follows = await profiles.follow.getUserFollows(id)

  const dto = toDto(profile, follows)
  if (req.params.id) {
    delete dto.settings
  }

  return res.json({ profile: dto })
})
