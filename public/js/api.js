'use strict';
/**
 * API: DATA ACCESS LAYER (using fetch())
 * 
 * Primary Job: communicates with API methods. 
 *  
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
 * - Do not call render methods from this layer
 * 
 */

function buildUrl(path, query) {
  var url = new URL(path, window.location.origin);
  if (query) {
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
  }
  return url;
}

function normalizeResponseErrors(res) {
  if (!res.ok) {
    if (
      res.headers.has('content-type') &&
      res.headers.get('content-type').startsWith('application/json')
    ) {
      // It's a nice JSON error returned by us, so decode it
      return res.json().then(err => Promise.reject(err));
    }
    // It's a less informative error returned by express
    return Promise.reject({
      status: res.status,
      message: res.statusText
    });
  }
  return res;
}

var api = {
  signup: function (username, password) {
    const url = buildUrl('/api/users/');
    const body = {
      username: username,
      password: password
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  login: function (username, password) {
    const url = buildUrl('/api/auth/login/');
    const body = {
      username: username,
      password: password
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  refresh: function (token) {
    const url = buildUrl('/api/auth/refresh/');
    return fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  },
  protected: function (token) {
    const url = buildUrl('/api/protected');

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    }).then(normalizeResponseErrors)
      .then(res => res.json());
  }
};


