const axios = require('axios')
const WebSocket = require('ws')
const Promise = require('bluebird')

const token = ''

const slack = axios.create({
  baseURL: 'https://slack.com/api/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

const targetUserId = ''

const reacts = []

const addReacts = async (channel, messageTs) => {
  await Promise.each(reacts, react => slack.post(
    '/reactions.add',
    {
      name: react,
      channel,
      timestamp: messageTs,
    }
  ))
}

const run = async () => {
  const { data } = await slack.get('/rtm.connect')

  const ws = new WebSocket(data.url)

  ws.on('message', (wsDataRaw) => {
    const wsData = JSON.parse(wsDataRaw)
    if (wsData.user !== targetUserId) {
      return
    }
    addReacts(wsData.channel, wsData.ts)
  })
}

run()
  .catch(console.log)