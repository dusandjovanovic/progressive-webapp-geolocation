## Progressive web application with Geolocation

Prototypical _Location-based crowdsourcing progressive application_. Web application for realtime collaborative **geolocation and metadata sharing**. Made possible with MERN, this stack consists of MongoDB, Express, **React w/ Redux, and Node.js**.<br><br>
This repository is technically a fork of [/structured](https://github.com/dusandjovanovic/structured) since an integral part of it's code base is being shared.

### `npm start`

To run frontend in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.<br>

### `cd backend && npm run local`

To run server in development mode.<br>
API will be accessible at [http://localhost:8080](http://localhost:8080) and socket-io entry point will be open on port `65080`. Optionally rename `.env.sample` to `.env` for establishing custom MongoDB cluster connection, otherwise make sure you have `mongod` instance running locally.

### `cd backend && npm start`

To run server with a daemon process manager suitable for production environment.<br>
Application is sustainable online with this configuration. Runs in multiple instances with auto-restart capability. Logging is available in realtime.

## Folder Structure

```
/
  README.md
  node_modules/
  public/
    index.html
    mainfest.json
    ...
  src/
    assets/
    components/
    containers/
    hoc/
    store/
    utils/
    App.js
    App.test.js
    package.json
    ...
  backend/
    README.md
    node_modules/
    app/
    config/
    public/
    test/
    ...
```

## Overview

This is a web application made for sharing insights between users in realtime. Upon signing-in, a user can choose of three room types to join. In the screenshots bellow, user joined "Air pollution insights" room where metadata and insights about pollution are being shared. Each insight includes user's current location and his provided input. Messaging and insights data is persisted accross sessions, realtime synchronization and state management is built upon a separata socket domain for each room.

![alt text][screenshot_intro]

[screenshot_intro]: documents/images/screenshot-intro.png

![alt text][screenshot_home]

[screenshot_home]: documents/images/screenshot-home.png

![alt text][screenshot_room]

[screenshot_room]: documents/images/screenshot-room.png

![alt text][screenshot_insight]

[screenshot_insight]: documents/images/screenshot-insight.png

![alt text][screenshot_dashboard]

[screenshot_dashboard]: documents/images/screenshot-dashboard.png
