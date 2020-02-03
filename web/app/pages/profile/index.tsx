import './profile.scss'
import * as React from 'react'
import { withState } from '../../../store'
import { useParams } from 'react-router'
import { Profile } from '../../../store/profile'

type Save = {
  nickname?: string
  role?: string
  description?: string
}

export const ProfilePage = withState(
  ({ profile, user }) => ({
    profile: profile.view.profile,
    error: profile.view.error,
    userId: user.userId,
  }),
  ({ dispatch, profile, error, userId }) => {
    const [load, setLoaded] = React.useState<Load>(Load.Init)
    const onSave = (changes: Save) => dispatch({ type: 'PROFILE_REQUEST_UPDATE', changes })

    const { id } = useParams()

    React.useEffect(() => {
      switch (load) {
        case Load.Init:
          dispatch({ type: 'PROFILE_REQUEST_PROFILE', id })
          setLoaded(Load.Loading)
          return

        case Load.Loading:
          if (!error && !profile) return
          setLoaded(Load.Loaded)
          return

        case Load.Loaded:
          return
      }
    }, [load, error, profile])

    if (load !== Load.Loaded || error || !profile) {
      return <Loading error={error} load={load} />
    }

    return (
      <div className="profile">
        <Head>Profile: {profile.nickname || profile.id}</Head>
        <Profile profile={profile} userId={userId ?? ''} onSave={onSave} />
      </div>
    )
  }
)
type ProfileProps = {
  profile: Profile
  userId: string
  onSave: (changes: Save) => void
}

const Profile: React.FunctionComponent<ProfileProps> = ({ profile, userId, onSave }) => {
  const [nick, setNick] = React.useState(profile?.nickname)
  const [desc, setDesc] = React.useState(profile?.description)
  const [dirty, setDirty] = React.useState(false)
  const canSave = userId === profile.id

  const onClick = () => {
    const changes: Save = {}
    if (nick !== profile.nickname) changes.nickname = nick
    if (desc !== profile.description) changes.description = desc
    onSave(changes)
  }

  React.useEffect(() => {
    if (nick !== profile.nickname) setDirty(true)
    else if (desc !== profile.description) setDirty(true)
    else setDirty(false)
  }, [nick, desc, profile])

  return (
    <Body>
      <Field name="Nickname">
        <input
          type="text"
          placeholder="Nickname..."
          value={nick}
          onChange={ev => setNick(ev.currentTarget.value)}
        />
      </Field>

      <Field name="Description">
        <input
          type="text"
          placeholder="Description..."
          value={desc}
          onChange={ev => setDesc(ev.currentTarget.value)}
        />
      </Field>

      {canSave && (
        <div className="profile__row">
          <button className="button light" disabled={!dirty} onClick={onClick}>
            Save
          </button>
        </div>
      )}
    </Body>
  )
}

const Head: React.FunctionComponent = ({ children }) => (
  <div className="profile__head">{children}</div>
)

const Body: React.FunctionComponent = ({ children }) => (
  <div className="profile__body">{children}</div>
)

const Field: React.FunctionComponent<{ name: string }> = ({ children, name }) => (
  <div className="profile__row">
    <div className="profile__field">{name}</div>
    {children}
  </div>
)

type LoadProps = {
  load: Load
  error?: string
}

const Loading = ({ load, error }: LoadProps) => {
  if (load === Load.Loaded) {
    return (
      <div className="profile">
        <Head>Could not load profile</Head>
        <Body>{error}</Body>
      </div>
    )
  }

  return (
    <div className="profile">
      <Head>Fetching profile</Head>
      <Body>Loading...</Body>
    </div>
  )
}

const enum Load {
  Init,
  Loading,
  Loaded,
}
