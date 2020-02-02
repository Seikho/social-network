import * as React from 'react'
import { withState } from '../../store'

export const Header = withState(
  ({ search }) => ({ search }),
  ({ dispatch }) => {
    const [text, setText] = React.useState('')

    const onClick = () => {
      dispatch({ type: 'NAVIGATE', to: `/search/${text}` })
    }

    return (
      <div className="layout__header">
        <div className="layout__left">network</div>
        <div className="layout__right">
          <input
            type="text"
            onChange={ev => setText(ev.currentTarget.value)}
            placeholder="Search..."
          />
          <button className="button light" onClick={onClick}>
            GO
          </button>
        </div>
      </div>
    )
  }
)
