import { io } from 'socket.io-client'
const socketUrl = import.meta.env.VITE_SOCKET_URL
const socket = io('https://pollzy.onrender.com', {
  autoConnect: false,
})

export default socket
