const Storage = require('@google-cloud/storage');
const Twitter = require('twitter');

const { tmpdir } = require('os');
const { join } = require('path');
const fs = require('fs-extra');

const twitterCredentials = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
};

/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

exports.publishTweet = async (event, context) => {
  const client = new Twitter(twitterCredentials);
  const storage = new Storage();
  const bucket = storage.bucket(event.bucket);
  const filePath = event.name;
  const workingDir = join(tmpdir(), 'images');
  const tmpFilePath = join(workingDir, 'image.png');

  await fs.ensureDir(workingDir);

  await bucket.file(filePath).download({
    destination: tmpFilePath
  });

  const data = await fs.readFileSync(tmpFilePath);

  client.post('media/upload', {media: data}, function(error, media, response) {
    if (!error) {
      var status = {
        status: process.env.TWEET_TEXT,
        media_ids: media.media_id_string
      }

      client.post('statuses/update', status, function(error, tweet, response) {
        if (!error) {
          console.log('Published!');
        }
      });
    }
  });
};
