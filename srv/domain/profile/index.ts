import { profile } from './profile'
import { update } from './update'
import { populators } from './populate'
import { Domain, Schema } from './types'
import * as store from './store'

export const profiles = {
  profile,
  update,
  populators,
  store,
}

export { Domain, Schema }
