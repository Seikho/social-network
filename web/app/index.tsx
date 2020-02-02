import * as React from 'react'
import { Provider } from 'react-redux'
import { store, withState, history } from '../store'
import { Layout } from './layout'
import { Switch, Route, RouteProps, Redirect } from 'react-router'
import { Router } from 'react-router-dom'
import { Landing } from './pages/landing'
import { ProfilePage } from './pages/profile'
import { Home } from './pages/home'
import { Logout } from './pages/logout'
import { PostsPage } from './pages/posts'
import { SearchPage } from './pages/search'

export const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Layout>
        <Switch>
          <Route path="/" exact={true} component={Landing} />
          <Private path="/search/:search" component={SearchPage} />
          <Private path="/posts/:id" component={PostsPage} />
          <Private path="/logout" component={Logout} />
          <Private path="/home" component={Home} />
          <Private path="/profile/:id?" component={ProfilePage} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
)

const Private = withState<{ isLoggedIn: boolean }, RouteProps>(
  ({ user }) => ({ isLoggedIn: !!user.userId }),
  props => {
    if (!props.isLoggedIn) return <Redirect to="/" />
    return <Route {...props} />
  }
)
