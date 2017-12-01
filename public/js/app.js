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
 * - Never make fetch calls directly
 * - Updates to STATE/STORE allowed
 * 
 */

// Make STORE global so it can be easily accessed in Dev Tools 
var STORE = {
  view: null,      // signup | login | protected
  protected: null, // will hold the results from /api/protected
  token: localStorage.getItem('authToken'), // jwt token
};

//on document ready bind events
jQuery(function ($) {
  // attempt refresh token if user interacts with page
  $('body').on('click', handle.refresh);

  // Setup all the event listeners, passing STATE and event to handlers
  $('#signup').on('submit', handle.signup);
  $('#login').on('submit', handle.login);

  $(document).on('click', '.viewLogin', handle.viewLogin);
  $(document).on('click', '.viewSignup', handle.viewSignup);
  $(document).on('click', '.viewProtected', handle.viewProtected);

  $('.viewProtected').trigger('click');

});
