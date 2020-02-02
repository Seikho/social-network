import './user'
import './socket'
import './profile'
import './notify'
import './post'
import './search'
import { withState, setup, history } from './store'

const store = setup()

store.dispatch({ type: 'INIT' })

export { store, withState, history }
