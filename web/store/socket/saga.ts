import { saga } from '../store'
import { config } from '../config'

saga('INIT', (_, dispatch) => {
  dispatch({ type: 'SOCKET_REQUEST_CONNECT' })
})

saga('SOCKET_REQUEST_CONNECT', (_, dispatch, { socket }) => {
  if (socket.client) {
    socket.client.close()
  }

  const client = new WebSocket(`ws://${config.apiUrl}/ws`)
  client.onopen = () => {
    dispatch({ type: 'SOCKET_RECEIVE_CONNECT', client })
  }

  client.onmessage = msg => {
    if (typeof msg.data !== 'string') return
    const blobs = msg.data.split('\n')
    for (const blob of blobs) {
      try {
        const data = JSON.parse(blob)
        dispatch({ type: 'SOCKET_RECEIVE_MESSAGE', data })
      } catch (ex) {}
    }
  }

  client.onerror = () => {
    client.close()
  }

  client.onclose = () => {
    setTimeout(() => {
      dispatch({ type: 'SOCKET_REQUEST_CONNECT' })
    }, 3000)
  }
})
