import { createStore } from 'typedstate'
import { RootState, RootAction } from './types'
import axios from 'axios'
import { config } from './config'
import * as hist from 'history'

export { createReducer, saga, setup, withState, get, post, upload, history }

const history = hist.createBrowserHistory()

const api = axios.create({
  baseURL: `http://${config.apiUrl}/api`,
  validateStatus: () => true,
})

const get = <T = any>(url: string) => api.get<T>(url, { headers: getHeaders() })
const post = <T = any>(url: string, body = {}) => api.post<T>(url, body, { headers: getHeaders() })
const upload = <T = any>(url: string, body = {}) =>
  api.post<T>(url, body, { headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' } })

function getHeaders() {
  const token = getToken()
  if (!token) return {}

  return { Authorization: `Bearer ${token}` }
}

const { createReducer, saga, setup, withState } = createStore<RootState, RootAction>('beam')

const TOKEN_KEY = 'access_token'
let cachedToken = ''

export function getToken(): string | null {
  if (cachedToken) return cachedToken
  const token = localStorage.getItem(TOKEN_KEY)
  return token
}

export function setToken(token: string) {
  cachedToken = token
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  cachedToken = ''
  localStorage.removeItem(TOKEN_KEY)
}

saga('NAVIGATE', ({ to }) => {
  history.push(to)
})
