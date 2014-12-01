/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */

module.exports = {

    /**
   * Render the login page
   *
   * The login form itself is just a simple HTML form:
   *
      <form role="form" action="/auth/local" method="post">
        <input type="text" name="identifier" placeholder="Username or Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign in</button>
      </form>
   *
   * You could optionally add CSRF-protection as outlined in the documentation:
   * http://sailsjs.org/#!documentation/config.csrf
   *
   * A simple example of automatically listing all available providers in a
   * Handlebars template would look like this:
   *
      {{#each providers}}
        <a href="/auth/{{slug}}" role="button">{{name}}</a>
      {{/each}}
   *
   * @param {Object} req
   * @param {Object} res
   */ //login fucntion with views
    li: function(req, res) {
        var strategies = sails.config.passport,
            providers = {};

        // Get a list of available providers for use in your templates.
        Object.keys(strategies).forEach(function(key) {
            // this needs to be undone
            if (key === 'local') return;
            providers[key] = {
                name: strategies[key].name,
                slug: key
            };
        });

        sails.log("Providers", providers);
        // Render the `auth/login.ext` view
        res.view('auth/login', {
            providers: providers,
            errors: req.flash('error'),
            //, layout:   '/layouts/public',
        });
    },

    /**
     * Log out a user and return them to the homepage
     *
     * Passport exposes a logout() function on req (also aliased as logOut()) that
     * can be called from any route handler which needs to terminate a login
     * session. Invoking logout() will remove the req.user property and clear the
     * login session (if any).
     *
     * For more information on logging out users in Passport.js, check out:
     * http://passportjs.org/guide/logout/
     *
     * @param {Object} req
     * @param {Object} res
     */ // logout funciton with views
    lo: function(req, res) {      
       User.logout(req, function() {
          res.redirect('/');
       });
    },

    /*
    * Api Login for use with ajax and sockets
    * @param {Object} req
    * @param {Object} res
    */

    logout: function(req, res, next) {
       User.logout(req, function(err, user) {

        var message = {verb: 'logout'};

        if (err)
          message.error = err;
        else
          message.user = user;

          if (req.isSocket) {
              var socketId = sails.sockets.id(req.socket);
              if (socketId) {
                sails.sockets.emit(socketId, 'auth', message);
              }
                
          }

          res.send(message);
       
       });
    },

    /**
   * Render the registration page
   *
   * Just like the login form, the registration form is just simple HTML:
   *
      <form role="form" action="/auth/local/register" method="post">
        <input type="text" name="username" placeholder="Username">
        <input type="text" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <button type="submit">Sign up</button>
      </form>
   *
   * @param {Object} req
   * @param {Object} res
   */
    register: function(req, res) {
        res.view({
            errors: req.flash('error'),
            layout: '/layouts/public'
        });
    },

    /**
     * Create a third-party authentication endpoint
     *
     * @param {Object} req
     * @param {Object} res
     */
    provider: function(req, res) {
        passport.endpoint(req, res);
    },

    /**
     * Create a authentication callback endpoint
     *
     * This endpoint handles everything related to creating and verifying Pass-
     * ports and users, both locally and from third-aprty providers.
     *
     * Passport exposes a login() function on req (also aliased as logIn()) that
     * can be used to establish a login session. When the login operation
     * completes, user will be assigned to req.user.
     *
     * For more information on logging in users in Passport.js, check out:
     * http://passportjs.org/guide/login/
     *
     * @param {Object} req
     * @param {Object} res
     */
    getOne: function(req, res) {
        console.log('in get one');
    },
    // we use this to pull the user data
    user: function(req, res) {
      var user = req.user;

      if (!user)
        return res.send({none: true});

      var socket = req.isSocket;

      if (req.isSocket) {
         var socketId = sails.sockets.id(req.socket);
         sails.sockets.emit(socketId, 'auth', {verb: 'login', user: user} );
      }

      res.send(user.toJSON());
    },

    callback: function(req, res) {

       User.login(req, res, function(err, user) {
                // If an error was thrown, redirect the user to the login which should
                // take care of rendering the error messages.
                var socket = req.isSocket,
                 message;

                 console.log("My error", err);

                if (socket) 
                  var socketId = sails.sockets.id(req.socket);
                    
                if (err) {
                    
                     message = {verb: 'login', error: err};
                    
                    if (socket) {
                      sails.sockets.emit(socketId, 'auth', message );
                      return res.badRequest(message);
                     } else
                      return res.redirect('/login');
                }
                // Upon successful login, send the user to the homepage were req.user
                // will available.
                else {

                    message = {verb: 'login', user: user};

                    console.log("My message", message);
                    
                    if (socket) {
                        sails.sockets.emit(socketId, 'auth', message );
                    }
                  
                    console.log('===api/controllers/AuthController.js============================================');
                    console.log('currently logged in user is: ' + req.user.username);
                    // must set session here !!!jrt -jul 19 2014
                    req.session.authenticated = true; //jrt
                    req.session.user = user; //jrt
                    console.log('currently logged in user  req.session.authenticated : ' + req.session.authenticated);
                    console.log('================================================================================');
                    console.log('================================================================================');

                    console.log('currently logged in user is: ' + req.user.username);

                    if (socket) 
                      res.send(message);
                     else 
                      res.redirect('/');
                    

                    
                }

       });
    }

};