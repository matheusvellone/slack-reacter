slack-reacter
---

# Requirements

- NodeJs 8 or later (async/await)

# Steps to make it work

1. Copy `.env.example` to a `.env` file
2. Create a token in https://api.slack.com/custom-integrations/legacy-tokens#legacy-info
3. Add it to your `.env` file
4. Add your target user ID, channel and reacts in the `targets` variable in the `index.js` file. You can use the example existing structure.
5. Run `npm start` to start

# Use it with responsibility

This project may be very annoying very fast. Be careful not to disturb anyone working with slack.

> With great power comes great responsibility