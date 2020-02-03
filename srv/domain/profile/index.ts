import { profile } from './domain'
import { populator } from './populate'
import { Domain, Schema } from './types'
import { relations } from './relation'
import * as store from './store'

export const profiles = {
  cmd: profile.command,
  populator,
  store,
  relations,
}

export { Domain, Schema }
