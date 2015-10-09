
function Dropdown(el) {
	if (!(this instanceof Dropdown)) {
		return new Dropdown(el);
	}

	this._el = el;
	this.initialize();
}

Dropdown.prototype.initialize = function() {
	var options = this._el.getElementsByTagName('option');
	for (var i = 0; i < options.length; i++) {

	}

	this._el;
}

module.exports = Dropdown;