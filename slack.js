const axios = require('axios')

const token = process.env.TOKEN

if (!token) {
  throw new Error('Invalid Token')
}

const slack = axios.create({
  baseURL: 'https://slack.com/api/',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

module.exports = slack