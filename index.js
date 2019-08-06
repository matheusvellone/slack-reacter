require('dotenv').config()
const axios = require('axios')
const WebSocket = require('ws')
const Promise = require('bluebird')
const {
  flatten,
  pipe,
  pluck
} = require('ramda')

const token = process.env.TOKEN

const slack = axios.create({
  baseURL: 'https://slack.com/api/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

const targets = [
  {
    users: ['USER_ID'],
    channels: ['CHANNEL_ID'],
    reacts: [
      'thumbsup',
    ],
  },
]

const addReacts = async (channel, messageTs, reacts) => {
  await Promise.each(reacts, react => slack.post(
    '/reactions.add',
    {
      name: react,
      channel,
      timestamp: messageTs,
    }
  ))
}

const flattenReacts = pipe(
  pluck('reacts'),
  flatten
)

const getReacts = (message) => {
  const matches = targets.filter((target) => {
    if (target.users && !target.users.includes(message.user)) {
      return false
    }

    if (target.channels && !target.channels.includes(message.channel)) {
      return false
    }

    return true
  })

  return flattenReacts(matches)
}

const run = async () => {
  const { data } = await slack.get('/rtm.connect')

  const ws = new WebSocket(data.url)

  ws.on('message', (wsDataRaw) => {
    const wsData = JSON.parse(wsDataRaw)
    
    const reacts = getReacts(wsData)

    if (reacts.length) {
      console.log('Reagindo à mensagem')
      addReacts(wsData.channel, wsData.ts, reacts)
    }
  })
}

run()
  .catch(console.log)