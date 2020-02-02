import './landing.scss'
import * as React from 'react'
import { withState } from '/store'
import { Redirect } from 'react-router'

export const Landing = withState(
  ({ user: { isLoggedIn } }) => ({ isLoggedIn }),
  ({ dispatch, isLoggedIn }) => {
    if (isLoggedIn) {
      return <Redirect to="/home" />
    }

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirm, setConfirm] = React.useState('')
    const [active, setActive] = React.useState(false)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
      if (password === confirm && error) {
        setError('')
      }
    }, [password, confirm])

    const onSubmit = () => {
      if (active) {
        if (password !== confirm) {
          setError('Passwords must match')
          return
        }

        dispatch({
          type: 'USER_REQUEST_REGISTER',
          username,
          password,
        })
        return
      }

      dispatch({
        type: 'USER_REQUEST_LOGIN',
        username,
        password,
      })
    }

    const loginMod = active ? '' : 'landing__link--active'
    const registerMod = active ? 'landing__link--active' : ''
    const confirmMod = !active ? 'landing__field--hide' : ''

    return (
      <div className="landing">
        <div className="landing__box">
          <div className="landing__header">
            <div className={`landing__link ${loginMod}`} onClick={() => setActive(false)}>
              LOGIN
            </div>
            <div className={`landing__link ${registerMod}`} onClick={() => setActive(true)}>
              REGISTER
            </div>
          </div>
          <form
            className="landing__body"
            onSubmit={ev => {
              ev.preventDefault()
            }}
          >
            <div className="landing__field">
              <div>Username</div>
            </div>
            <div className="landing__field">
              <input type="text" onChange={ev => setUsername(ev.currentTarget.value)} />
            </div>

            <div className="landing__field">
              <div>Password</div>
            </div>
            <div className="landing__field">
              <input type="password" onChange={ev => setPassword(ev.currentTarget.value)} />
            </div>
            <div className={`landing__field ${confirmMod}`}>
              <div>Confirm Password</div>
            </div>
            <div className={`landing__field ${confirmMod}`}>
              <input type="password" onChange={ev => setConfirm(ev.currentTarget.value)} />
            </div>
            <div className="landing__field landing__field--error">
              <div>{error}</div>
            </div>
            <div className="landing__field">
              <button type="button" className="button full" onClick={onSubmit}>
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
)
