# Run

To run the server, I suggest you create a script file with your environment variables.
(or you can do something more fancy with node environment variable management)

Here's an example script. This will set up a bunch of environment variables,
then call Forever (npm install -g forever) to run the server.
The flags specify an output file (`-l`), restart the server on file changes (`-w`),
except for changes in out.log

```
NODE_ENV=production\
 PORT=8080\
 GCM_API_KEY=\
 DB_HOST=127.0.0.1\
 DB_USER=\
 DB_PASS=\
 DB_DATABASE=\
 SSL_CERT=\
 SSL_KEY=\
 PASSWORD=\
 HITBOX_USERNAME=\
 INSTAGRAM_USER_ID=\
 INSTAGRAM_CLIENT_ID=\
 INSTAGRAM_CLIENT_SECRET=\
 YOUTUBE_API_KEY=\
 YOUTUBE_CHANNEL_ID=\
 TWITCH_CLIENT_ID=\
 TWITCH_USERNAME=\
 TWITTER_USERNAME=\
 TWITTER_CONSUMER_KEY=\
 TWITTER_CONSUMER_SECRET=\
 TWITTER_ACCESS_TOKEN=\
 TWITTER_ACCESS_TOKEN_SECRET=\
 forever start -l ~/newLEGACYinc-app-server/out.log -a -w --watchIgnore out.log ~/newLEGACYinc-app-server/src/app.js
```
