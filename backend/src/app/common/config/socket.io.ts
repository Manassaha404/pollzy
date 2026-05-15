import {Server} from "socket.io"

import { publisher, subscriber } from "./redis.js"
import { env } from "./envValidate.js";

await subscriber.subscribe(
  'redis:submit_vote:event',
  'redis:new_view:event'
)
subscriber.on('message',(channel, message) => {
    if(channel === 'redis:submit_vote:event'){
        const {pollId, pollData} = JSON.parse(message);
        io.to(`poll:${pollId}`).emit('vote_updated', {
          pollId,
          pollData  
        })
    }
    if(channel === 'redis:new_view:event'){
        const {pollId} = JSON.parse(message);
        io.to(`poll:${pollId}`).emit('view_updated');
    }
})
const io = new Server({
    cors:{
        origin: env.CLIENT_URL
    }
});

io.on('connection', (socket)=>{
    socket.on('join_poll', (pollId)=>{
        socket.join(`poll:${pollId}`)
    })
    socket.on('leave_poll', (pollId) => {
        socket.leave(`poll:${pollId}`);
    })
    socket.on('submit_vote', async({pollId, pollData}) => {
        await publisher.publish('redis:submit_vote:event', JSON.stringify({pollId, pollData}))
    })
    socket.on('new_view', async(pollId) => {
        await publisher.publish('redis:new_view:event', JSON.stringify({pollId}));
    })
})
export default io;