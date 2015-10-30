var $ = window.$ = window.jQuery = require('jquery');
$.fn.transition = require('semantic-ui-transition');
$.fn.dropdown = require('semantic-ui-dropdown');

$.fn.dropdown.settings.selector.dropdown = '.dropdown';
$.fn.dropdown.settings.className.dropdown = 'dropdown';
$.fn.dropdown.settings.className.label = 'label';

$(function() {
	$('select').dropdown();
	$('.selection').dropdown();
	$('#dropdown1').dropdown();
	$('#nav-dropdown').dropdown();
});