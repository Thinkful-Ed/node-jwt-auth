/* global $ */
'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update store/store
 * 
 */

var render = {
  page: function (store) {
    $('.view').hide();
    $('#' + store.view).show();
  },
  results: function (store) {
    $('#result').empty().append(store.protected.data);
  },
};