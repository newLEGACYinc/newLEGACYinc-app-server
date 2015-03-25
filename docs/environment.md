# Environment Variables

  - [General](#general)
  - [Database](#database)
  - External Services
    - [Apple Push Notification Service](#apns)
    - [Google Cloud Messaging](#gcm)
    - [hitbox](#hitbox)
    - [Twitch](#twitch)
    - [Twitter](#twitter)
    - [YouTube](#youtube)

## General

  - `ANNOUNCE_PASSWORD` - Password for sending messages through server
  - `HTTP_PORT`
  - `NODE_ENV` - Should be `production` for deployment
  - `SSL_CERT` - Relative path to SSL certificate (`*.crt`) file
  - `SSL_KEY` - Relative path to SSL certificate key (`*.key`) file

## Database

  - `DB_HOST` - likely `127.0.0.1`
  - `DB_USER`
  - `DB_PASS`
  - `DB_DATABASE` - Database name

## External Services

### APNs

  - `APN_CERT` - Relative file location for APN certificate (`*.pem`) file
  - `APN_KEY` - Relative file location for APN key (`*.key`) file

### GCM

  - `GCM_API_KEY`

### hitbox

  - `HITBOX_USERNAME` - newLEGACYinc's username on hitbox (i.e. newLEGACYinc)

### Twitch

  - `TWITCH_CLIENT_ID`
  - `TWITCH_USERNAME` - ewLEGACYinc's username on Twitch (i.e. newLEGACYinc)

### Twitter

Obtain this information [here](https://apps.twitter.com/)

  - `TWITTER_CONSUMER_KEY` - from Twitter developer account
  - `TWITTER_CONSUMER_SECRET` - from Twitter developer account
  - `TWITTER_ACCESS_TOKEN` - from Twitter developer account
  - `TWITTER_ACCESS_TOKEN_SECRET` - from Twitter developer account
  - `TWITTER_USERNAME` - newLEGACYinc's username on Twitter (i.e. newLEGACYinc)

### YouTube

  - `YOUTUBE_API_KEY`
  - `YOUTUBE_CHANNEL_ID` - newLEGACYinc's channel id (i.e. `UC5iCLgl2ccta5MqTf2VU8bQ`)
