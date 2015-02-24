module.exports = function() {
  var env = process.env.NODE_ENV;

  return {
    sessionSecret: 'randomkey',

    youtube: 'AIzaSyA7QOe5_6VAQBnO-XihFvcBOV1xomJ1gaQ',

    facebook: (function() {
      if (env == "development")
        return {
          // Test app for localhost:3000
          auth: {
            clientID: '1561796027400788',
            clientSecret: 'ff5641da40e3bd1e352e7947c9a7a9f7',
            callbackURL: '/auth/facebook/callback'
          },
          story: {
            broadcast_url: 'blink_fm_test:broadcast',
            image: 'http://www.tikiislandradio.com/Tiki_Island_7.jpg'
          }
        }
      else
        return {
          // Main app for blink.fm
          auth: {
            clientID: '1559394300974294',
            clientSecret: '50ff897b9bcece9393c233939ebc0e36',
            callbackURL: '/auth/facebook/callback'
          },
          story: {
            broadcast_url: 'blink_fm:broadcast',
            image: 'http://www.tikiislandradio.com/Tiki_Island_7.jpg'
          }
        }
    })()
  }
};