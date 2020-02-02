import './layout.scss'
import * as React from 'react'
import { withState } from '../../store'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Notifications } from '../components/notification'
import { CreatePostModal } from '../components/create-post'

export const Layout = withState(
  ({ user }) => ({ userId: user.userId || 'Guest' }),
  ({ children }) => {
    return (
      <div>
        <div className="layout">
          <Header />
          <Sidebar />
          <div className="layout__content">{children}</div>
          <div className="layout__footer"></div>
        </div>
        <Notifications />
        <CreatePostModal />
      </div>
    )
  }
)
