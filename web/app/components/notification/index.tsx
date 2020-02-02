import './notifications.scss'
import * as React from 'react'
import { withState } from '/store'

export const Notifications = withState(
  ({ notify }) => ({ notify: notify.notifications }),
  ({ notify }) => {
    return (
      <div className="notifications">
        <div className="notifications__container">
          {notify.map(note => (
            <Notification key={note.id} kind={note.kind}>
              {note.text}
            </Notification>
          ))}
        </div>
      </div>
    )
  }
)

const Notification: React.FunctionComponent<{ kind?: string }> = ({ children, kind = 'info' }) => (
  <div className="notifications__row">
    <div className={`notifications__item notifications__item--${kind}`}>{children}</div>
  </div>
)
