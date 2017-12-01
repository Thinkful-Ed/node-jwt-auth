/* global jQuery, handle */
'use strict';
/**
 * Event Listener
 * Primary Job:
 * - Listen for user events like `click`, and call event handler methods
 * - Pass the "STORE" and the event objects and the event handlers
 * 
 * Setup:
 * jQuery's document ready "starts" the app
 * Event listeners are wrapped in jQuery's document.ready function
 * STORE is inside document.ready so it is protected
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

// Make STORE global so it can be easily accessed in Dev Tools 
var STORE;
//on document ready bind events
jQuery(function ($) {

  STORE = {
    view: null,      // signup | login | protected
    action: null,    // used to prevent superfluous refresh calls
    token: localStorage.getItem('authToken'), // jwt token

    // Simple token refresher
    timer: {            // timer to track token expiration
      status: null,     // current status: ok | warning | expired
      warning: 60000,   // inactivity warning threshold in ms
      remaining: null,  // calculated remaining until expire ms
      polling: 1000,    // frequency to checkExpiry in ms
    }
  };

  // Setup all the event listeners, passing STATE and event to handlers
  $('#signup').on('submit', STORE, handle.signup);
  $('#login').on('submit', STORE, handle.login);
  
  $(document).on('click', '.viewLogin', STORE, handle.viewLogin);
  $(document).on('click', '.viewSignup', STORE, handle.viewSignup);
  $(document).on('click', '.viewProtected', STORE, handle.viewProtected);

  $('body').on('click', STORE, handle.refresh); //keep token alive

  // call checkExpiry once on document.ready
  handle.checkExpiry(STORE);
  // poll checkExpiry every few seconds to update status bar
  setInterval(() => handle.checkExpiry(STORE), STORE.timer.polling);
  
  $('.viewProtected').trigger('click');
});
