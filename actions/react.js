const Promise = require('bluebird')

const slack = require('../slack')

module.exports = (message, reacts) => {
  return Promise.each(reacts, async (react) => {
    await slack.post(
      '/reactions.add',
      {
        name: react,
        channel: message.channel,
        timestamp: message.ts,
      }
    )
    await Promise.delay(100)
  })
}