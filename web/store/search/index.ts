import { SearchResult } from 'srv/domain/types'
import { createReducer, saga, get } from '../store'

export type Action = RequestSearch | ReceiveSearch

export type State = {
  loading: boolean
  result?: SearchResult
  error?: string
}

const reducer = createReducer<Action, 'search'>('search', { loading: false })

reducer('SEARCH_REQUEST_SEARCH', { loading: true, result: undefined, error: undefined })

reducer('SEARCH_RECEIVE_SEARCH', (_, action) => {
  return {
    loading: false,
    result: action.results,
    error: action.error,
  }
})

saga('SEARCH_REQUEST_SEARCH', async ({ search }, dispatch) => {
  if (!search || search.length < 2) {
    dispatch({ type: 'NOTIFY_REQUEST', text: 'Search too small', kind: 'warn' })
    return
  }

  const res = await get(`/search/${search}`)
  const error = res.status > 200 ? res.data.message : undefined
  const result = res.data.result

  if (error) {
    dispatch({ type: 'NOTIFY_REQUEST', kind: 'error', text: res.data.message ?? res.statusText })
  }

  dispatch({ type: 'SEARCH_RECEIVE_SEARCH', error, results: result })
})

type RequestSearch = {
  type: 'SEARCH_REQUEST_SEARCH'
  search: string
}

type ReceiveSearch = {
  type: 'SEARCH_RECEIVE_SEARCH'
  error?: string
  results: SearchResult
}
