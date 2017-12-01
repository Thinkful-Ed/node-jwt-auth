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
  status: function (store) {
    const timer = store.timer;
    switch (timer.status) {
      case 'warning':
        $('#statusbar').css('background-color', 'orange').find('.message').text(timer.status);
        break;
      case 'expired':
        $('#statusbar').css('background-color', 'red').find('.message').text(timer.status);
        break;
      default:
        $('#statusbar').css('background-color', 'green').find('.message').text(timer.status);
        break;
    }
  },
  results: function (store) {
    $('#result').empty().append(store.protected.data);
  },
};