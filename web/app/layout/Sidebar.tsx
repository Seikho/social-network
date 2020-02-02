import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { withState } from '/store'

export const Sidebar = withState(
  ({ user, profile }) => ({ profile: profile.view.profile, userId: user.userId }),
  ({ userId }) => {
    const name = userId ?? 'Guest'
    return (
      <div className="layout__sidebar">
        <NavLink className="layout__link" to="/profile">
          Profile: {name}
        </NavLink>
        <NavLink className="layout__link" to={`/posts/${userId}`}>
          My Posts
        </NavLink>
        <NavLink className="layout__link" to="/home">
          Dashboard
        </NavLink>
        <NavLink className="layout__link" to="/logout">
          Logout
        </NavLink>
      </div>
    )
  }
)
