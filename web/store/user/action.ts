export type Action = ReceiveLogin | RequestRegister | RequestLogin | RequestLogout

type ReceiveLogin = {
  type: 'USER_RECEIVE_LOGIN'
  userId?: string
  error?: string
}

type RequestRegister = {
  type: 'USER_REQUEST_REGISTER'
  username: string
  password: string
}

type RequestLogin = {
  type: 'USER_REQUEST_LOGIN'
  username: string
  password: string
}

type RequestLogout = {
  type: 'USER_REQUEST_LOGOUT'
}
