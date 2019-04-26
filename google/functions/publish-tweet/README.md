# Google Cloud Functions

## Overview

"Google Cloud Functions is a serverless execution environment for building and connecting cloud services. With Cloud Functions you write simple, single-purpose functions that are attached to events emitted from your cloud infrastructure and services. Your function is triggered when an event being watched is fired. Your code executes in a fully managed environment. There is no need to provision any infrastructure or worry about managing any servers."
From: https://cloud.google.com/functions/docs/concepts/overview

### Supported languages:

- JavaScript (Node.js)
- Python 3
- Go

### Service triggers:

- HTTP
- Cloud Storage
- Pub/Sub
- Firestore
- Firebase

### Event data:

The function should be wrote to receive the event sent by Google Cloud service. In general, if the function was triggered by a HTTP API we need to wait for two parameters: `request` and `response` (similar to Express.js). On the other hand, if the function was triggered by another service (like Storage or Pub/Sub) we need to wait mainly for `data`, `context` parameters.

- HTTP Functions:
    `(request, response)`

- Background Functions:
    `(data, context, callback)`

## Sample

This GCF sample publish a tweet message when a new image is added to the Google Storage.

### Requirements

- Create an account on Google Cloud Platform
- Enable Google Cloud Functions and Google Storage services
- Create a bucket on Google Storage
- Get Twitter secret key and access token

### Deploy

In order to deploy this function I've decided to use the [Google SDK](https://cloud.google.com/sdk/) (gcloud).

Field | Description
--- |  ---
runtime | Infrastructure to run an application on specified language.
trigger-resource | Google Storage bucket you want listen to events.
trigger-event | The event you want to trigger the function.
env-vars-file | File with environment variables required by the function.

Just enjoy it!

`gcloud functions deploy publishTweet --runtime nodejs10 --trigger-resource twitter-images --trigger-event google.storage.object.finalize --env-vars-file default.yaml`

