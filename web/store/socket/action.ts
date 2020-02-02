export type Action = RequestSend | RequestConnect | ReceiveConnect | RequestReconnect | ReceiveData

type RequestSend = {
  type: 'SOCKET_REQUEST_SEND'
  data: any
}

type RequestConnect = {
  type: 'SOCKET_REQUEST_CONNECT'
}

type ReceiveConnect = {
  type: 'SOCKET_RECEIVE_CONNECT'
  client: WebSocket
}

type RequestReconnect = {
  type: 'SOCKET_REQUEST_RECONNECT'
}

type ReceiveData = {
  type: 'SOCKET_RECEIVE_MESSAGE'
  data: any
}
