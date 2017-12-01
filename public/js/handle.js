/* global $, render, api, STORE */
'use strict';

/**
 * 
 * Event Handlers validate input, update STATE and call render methods
 */

var handle = {
  signup: function (event) {
    event.preventDefault();
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    el.trigger('reset');
    api.signup(username, password)
      .then(() => {
        STORE.view = 'login';
        render.page(STORE);
      }).catch(err => {
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },
  login: function (event) {
    event.preventDefault();
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    api.login(username, password)
      .then(response => {
        STORE.token = response.authToken;
        localStorage.setItem('authToken', STORE.token);
        handle.viewProtected(event);
      }).catch(err => {
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },
  refresh: function () {
    // No preventDefault on this one!
    api.refresh(STORE.token)
      .then(response => {
        STORE.token = response.authToken;
        localStorage.setItem('authToken', STORE.token);
      }).catch(err => {
        STORE.token = null; // remove expired token
        localStorage.removeItem('authToken');
        console.error('ERROR:', err);
      });
  },

  viewProtected: function (event) {
    event.preventDefault();    
    api.protected(STORE.token)
      .then(response => {
        STORE.protected = response;
        render.results(STORE);
        STORE.view = 'protected';
        render.page(STORE);
      }).catch(err => {
        if (err.status === 401) {
          STORE.backTo = STORE.view;
          STORE.view = 'signup';
          render.page(STORE);
        }
        console.error('ERROR:', err);
      });
  },
  viewLogin: function (event) {
    event.preventDefault();
    STORE.view = 'login';
    render.page(STORE);
  },
  viewSignup: function (event) {
    event.preventDefault();
    STORE.view = 'signup';
    render.page(STORE);
  }
};
