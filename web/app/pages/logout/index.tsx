import './logout.scss'
import * as React from 'react'
import { withState } from '../../../store'

export const Logout = withState(
  ({ user }) => ({ userId: user.userId }),
  ({ dispatch }) => {
    setTimeout(() => dispatch({ type: 'USER_REQUEST_LOGOUT' }), 1500)

    return <div className="logout">Logging out...</div>
  }
)
