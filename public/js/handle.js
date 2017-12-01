/* global $, render, api */
'use strict';

/**
 * 
 * Event Handlers validate input, update STATE and call render methods
 */

var handle = {
  signup: function (event) {
    event.preventDefault();
    const store = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    el.trigger('reset');
    api.signup(username, password)
      .then(() => {
        store.view = 'login';
        render.page(store);
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
    const store = event.data;
    const el = $(event.target);
    const username = el.find('[name=username]').val().trim();
    const password = el.find('[name=password]').val().trim();
    store.action = 'getToken';
    api.login(username, password)
      .then(response => {
        store.action = null;
        store.token = response.authToken;
        localStorage.setItem('authToken', store.token);
        store.view = 'protected';
        render.page(store);
      }).catch(err => {
        store.action = null;
        if (err.reason === 'ValidationError') {
          console.error('ERROR:', err.reason, err.message);
        } else {
          console.error('ERROR:', err);
        }
      });
  },
  refresh: function (event) {
    // don't preventDefault on this one!
    const store = event.data;
    const timer = store.timer;
    if (store.action === 'getToken') { return; }
    if (store.token && timer.remaining < timer.warning) {
      api.refresh(store.token)
        .then(response => {
          store.token = response.authToken;
          localStorage.setItem('authToken', store.token);
        }).catch(err => {
          store.token = null; // remove expired token
          localStorage.removeItem('authToken');
          console.error('ERROR:', err);
        });
    }
  },
  checkExpiry: function (store) {
    const timer = store.timer;
    if (store.token) {
      var section = store.token.split('.')[1];
      var payload = window.atob(section);
      var decoded = JSON.parse(payload);
      var now = new Date();
      var expiry = new Date(0);
      expiry.setUTCSeconds(decoded.exp);

      timer.remaining = Math.floor(expiry - now);
      // console.log('Seconds: ', Math.floor(timer.remaining / 1000));
      if (timer.remaining < 0) {
        timer.status = 'expired';
      } else if (timer.remaining <= timer.warning) {
        timer.status = 'warning';
      } else {
        timer.status = 'ok';
      }
      render.status(store);
    }
  },
  protected: function (event) {
    event.preventDefault();
    const store = event.data;
    api.protected(store.token)
      .then(response => {
        store.protected = response;
        render.results(store);
        store.view = 'protected';
        render.page(store);
      }).catch(err => {
        if (err.status === 401) {
          store.backTo = store.view;
          store.view = 'signup';
          render.page(store);
        }
        console.error('ERROR:', err);
      });
  },
  viewLogin: function (event) {
    event.preventDefault();
    const store = event.data;
    store.view = 'login';
    render.page(store);
  },
  viewSignup: function (event) {
    event.preventDefault();
    const store = event.data;
    store.view = 'signup';
    render.page(store);
  },
  viewProtected: function (event) {
    event.preventDefault();
    const store = event.data;
    if (!store.list) {
      handle.protected(event);
      return;
    }
    store.view = 'protected';
    render.page(store);
  }
};
