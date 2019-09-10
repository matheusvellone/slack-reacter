require('dotenv').config()
const WebSocket = require('ws')
const Promise = require('bluebird')
const slack = require('./slack')

const actions = [
  {
    filter: {
      previous_message: {
        users: ['U7EA86QV7'],
      },
      types: ['message'],
      subtypes: ['message_deleted'],
    },
    action: (message) => {
      console.log(message)
    },
  },
]

const filterAction = (message, filter) => {
  if (filter.users && !filter.users.includes(message.user)) {
    return false
  }

  if (filter.channels && !filter.channels.includes(message.channel)) {
    return false
  }

  if (filter.types && !filter.types.includes(message.type)) {
    return false
  }

  if (filter.subtypes && !filter.subtypes.includes(message.subtype)) {
    return false
  }

  return true
}

const getActions = message => actions.filter(({ filter = {} }) => {
  if (filter.previous_message) {
    const previousMessageFilter = filter.previous_message

    const previousMessageFilterResult = filterAction(message, previousMessageFilter)

    if (!previousMessageFilterResult) {
      return previousMessageFilterResult
    }
  }

  return filterAction(message, filter)
})

const run = async () => {
  const { data } = await slack.get('/rtm.connect')

  const ws = new WebSocket(data.url)

  ws.on('message', async (messageRaw) => {
    const message = JSON.parse(messageRaw)
    
    const actions = getActions(message)

    Promise.each(actions, (action) => action.action(message))
  })
}

run()
  .catch(console.log)
