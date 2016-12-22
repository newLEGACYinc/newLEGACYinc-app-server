# Environment Variables

  - [General](#general)
  - [Database](#database)
  - External Services
    - [Google Cloud Messaging](#gcm)
    - [hitbox](#hitbox)
    - [Instagram](#instagram)
    - [Twitch](#twitch)
    - [Twitter](#twitter)
    - [YouTube](#youtube)

## General

  - `PORT` - http listening port
  - `NODE_ENV` - Should be `production` for deployment
  - `SSL_CERT` - Relative path to SSL certificate (`*.crt`) file
  - `SSL_KEY` - Relative path to SSL certificate key (`*.key`) file

## Database

  - `MONGODB_URI`

## External Services

### GCM

  - `GCM_API_KEY`

### hitbox

  - `HITBOX_USERNAME` - newLEGACYinc's username on hitbox (i.e. newLEGACYinc)

### Instagram

  - `INSTAGRAM_USER_ID` - newLEGACYinc's user ID on Instagram (i.e. 1700194644)
  - `INSTAGRAM_ACCESS_TOKEN` - Generated using https://www.instagram.com/oauth/authorize/?client_id=[CLIENT_ID]&redirect_uri=http://localhost&response_type=token&scope=public_content

### Twitch

  - `TWITCH_CLIENT_ID`
  - `TWITCH_USERNAME` - newLEGACYinc's username on Twitch (i.e. newLEGACYinc)

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
