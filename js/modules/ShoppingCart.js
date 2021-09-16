import DBProducts from "./DBProducts.js"

function ShoppingCart() {
	if (localStorage.getItem("cart") === null)
		localStorage.setItem("cart", JSON.stringify({}));
}

/* OWN METHODS */
ShoppingCart.prototype.getList = function() {
	return JSON.parse(localStorage.getItem("cart"));
}
ShoppingCart.prototype.updateList = function(cart = null) {
	if (cart === null)
		return false;

	localStorage.setItem("cart", JSON.stringify(cart));
	return true;
}
ShoppingCart.prototype.add = async function(products = null) {
	if (products === null)
		return false;

	const cart = this.getList();

	for (const product of products) {
		if (!/^\w+$/.test(product.id))
			continue;

		if (cart.hasOwnProperty(product.id)) {
			cart[product.id].quantity += parseFloat(product.quantity);
			continue;
		}

		const productInfo = await DBProducts.find(product.id);
		cart[product.id] = {
			name: productInfo.name,
			quantity: parseFloat(product.quantity),
			price: parseFloat(productInfo.price)
		}
	}

	this.updateList(cart);
	return true;
}
ShoppingCart.prototype.modify = async function({ id = null, data = {} }) {
	if (id === null)
		return false;

	const cart = await this.getList(),
		dataArr = Object.entries(data);

	dataArr.forEach(([key, value]) => cart[id][key] = value);
	this.updateList(cart);
	return Promise.resolve();
}
ShoppingCart.prototype.remove = async function(id = null) {
	if (id === null)
		return false;

	const cart = this.getList();

	delete cart[id];

	this.updateList(cart);
	return true;
}

export default ShoppingCart;