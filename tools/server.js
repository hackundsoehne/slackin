#!/usr/bin/env node

const pkg = require('./../package')
const args = require('args')
const ENV_VARS = require('./ENV_VARS')
const slackin = require('./../dist').default

args
  .option(['p', 'port'], 'Port to listen on [$PORT or 3000]', require('hostenv').PORT || process.env.PORT || 3000)
  .option(['h', 'hostname'], 'Hostname to listen on [$HOSTNAME or 0.0.0.0]', require('hostenv').HOSTNAME || process.env.WEBSITE_HOSTNAME || '0.0.0.0')
  .option(['c', 'channels'], 'One or more comma-separated channel names to allow single-channel guests [$SLACK_CHANNELS]', process.env.SLACK_CHANNELS)
  .option(['i', 'interval'], 'How frequently (ms) to poll Slack [$SLACK_INTERVAL or 5000]', process.env.SLACK_INTERVAL || 5000)
  .option(['P', 'path'], 'Path to serve slackin under', '/')
  .option(['s', 'silent'], 'Do not print out warns or errors')
  .option(['x', 'cors'], 'Enable CORS for all routes')
  .option(['C', 'coc'], 'Full URL to a CoC that needs to be agreed to')
  .option(['S', 'css'], 'Full URL to a custom CSS file to use on the main page')
  .option(['?', 'help'], 'Show the usage information')

const flags = args.parse(process.argv, {
  value: '<team-id><api-token>',
  help: false
})

const org = ENV_VARS.ORG
const token = ENV_VARS.TOKEN
const emails = ENV_VARS.EMAILS

if (flags.help) {
  args.showHelp()
}

if (!org || !token) {
  args.showHelp()
} else {
  flags.org = org
  flags.token = token
  flags.emails = emails
}

flags.interval = 1000

const port = flags.port
const hostname = flags.hostname

slackin(flags).listen(port, hostname, function (err) {
  if (err) throw err
  if (!flags.silent) console.log('%s � listening on %s:%d', new Date, hostname, port)
})
