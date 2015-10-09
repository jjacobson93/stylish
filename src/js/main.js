var select = require('./select');

document.on('ready', function() {
	var selectElements = document.getElementsByTagName('select');
	for (var i = 0; i < selectElements.length; i++) {
		var el = selectElements[i];
		select(el);
	}
});