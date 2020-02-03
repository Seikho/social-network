import { profile } from './domain'
import { createProfile, updateProfile } from './store'

export { prf as populator }

const prf = profile.handler('profile-populator')

prf.handle('ProfileCreated', async (_, ev) => {
  await createProfile(ev.userId)
})

prf.handle('NicknameUpdated', async (id, ev) => {
  await updateProfile(id, 'nickname', ev.name)
})

prf.handle('ProfileVerified', async (id, ev) => {
  await updateProfile(id, 'verified', ev.verify)
})

prf.handle('DescriptionUpdated', async (id, ev) => {
  await updateProfile(id, 'description', ev.description)
})
