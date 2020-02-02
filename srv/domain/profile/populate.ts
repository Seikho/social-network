import { profile } from './profile'
import { update } from './update'
import { createProfile, updateProfile } from './store'
import { table, tables } from '../../db/client'
import { sockets } from 'srv/api'

const upd = update.handler('update-populator')
const prf = profile.handler('profile-populator')

export const populators = {
  profile: prf,
  update: upd,
}

prf.handle('ProfileCreated', async (_, ev) => {
  try {
    await createProfile(ev.userId)
  } catch (ex) {
    throw ex
  }
})

upd.handle('NicknameUpdated', async (_, ev) => {
  await updateProfile(ev.userId, 'nickname', ev.name)
  sockets
})

upd.handle('ProfileVerified', async (_, ev) => {
  await updateProfile(ev.userId, 'verified', ev.verify)
})

upd.handle('RoleUpdated', async (_, ev) => {
  const query = `
    UPDATE ${tables.profile}
    SET settings = json_set(${tables.profile}.settings, '$.role', ?)
    WHERE id = ?
  `
  await table.raw(query, ev.role, ev.userId)
})

upd.handle('DescriptionUpdated', async (_, ev) => {
  await updateProfile(ev.userId, 'description', ev.description)
})
