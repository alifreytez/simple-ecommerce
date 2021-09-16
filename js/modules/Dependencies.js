function Dependencies({ target = null, dependencies = {} }) {
	this.target = target;
	this.unpack(dependencies);
}

Dependencies.prototype.unpack = function(list) {
	Object.entries(list).forEach(([key, value]) => this.target[key] = value);
}

export default Dependencies;