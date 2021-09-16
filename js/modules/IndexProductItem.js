import { default as DependenciesHandler } from "./Dependencies.js"
import EventAssign from "./EventAssign.js"
import DBProducts from "./DBProducts.js"
import TemplateQuery from "./TemplateQuery.js"

function IndexProductItem(dependencies) {
	this.dependencies = new DependenciesHandler({target: this, dependencies: dependencies});
	TemplateQuery.then((tmpl) => {
		this.allTmpl = tmpl;
		this.build();
	});
}

/* OWN METHODS */
IndexProductItem.prototype.initialEventAssignment = function() {
	// Add to cart
	EventAssign.add({
		target: ".p-options .add-to-cart, .p-options .add-to-cart *",
		callback: (event) => {
			let element = event.target;

			while (!element.hasAttribute("data-productId"))
				element = element.parentElement;

			this.addToCart(element.getAttribute("data-productId"));
		}
	});
	// Go to buy
	EventAssign.add({
		target: ".p-options .buy, .p-options .buy *",
		callback: async (event) => {
			let element = event.target;

			while (!element.hasAttribute("data-productId"))
				element = element.parentElement;

			await this.addToCart(element.getAttribute("data-productId"));

			location.href = "buy.html";
		}
	});
}
IndexProductItem.prototype.buildProductItem = function({ productId = null, content = {} }) {
	if (productId === null)
		return false;

	const template = this.allTmpl.getElementById("product-item-element").content.cloneNode(true);

	template.querySelector(".product-item").classList.add("rank");
	template.querySelector(".product-item").classList.add(`rank-${content.rank}`);
	template.querySelector(".p-image img").src = Object.entries(content.image)[0][1];
	template.querySelector(".p-image img").classList.add(Object.keys(content.image)[0]);
	template.querySelector(".p-image img").alt = content.name;
	template.querySelector(".p-desc").setAttribute("data-productId", productId);
	template.querySelector("h5").innerHTML = content.name;
	template.querySelector("p").innerHTML = "$" + content.price;
	template.querySelector(".p-options a").href = `product.html?p=${productId}`;

	return template;
}
IndexProductItem.prototype.buildRecentlyAdded = async function() {
	const info = await DBProducts.read(),
		wrapper = document.querySelector("#recently-added .product-wrapper"),
		fragment = document.createDocumentFragment();

	Object.entries(info).forEach(([productId, content]) => {
		const template = this.buildProductItem({
			productId: productId,
			content: content
		});

		if (template)
			fragment.appendChild(template);
	});

	wrapper.appendChild(fragment);
}
IndexProductItem.prototype.buildBestSeller = async function() {
	const info = await DBProducts.read(),
		wrapper = document.querySelector("#best-seller .product-wrapper"),
		fragment = document.createDocumentFragment(),
		itemsSoldStock = {},
		filteredList = [];
	let itemsSoldOrder = [];


	Object.entries(info).forEach((product, i) => {
		itemsSoldStock[product[1].soldStock] = product[0];
	});

	itemsSoldOrder = Object.keys(itemsSoldStock).sort(function(a, b){return b - a});

	for (let i = 0; i < itemsSoldOrder.length; i++) {
		filteredList.push({[itemsSoldStock[itemsSoldOrder[i]]]: info[itemsSoldStock[itemsSoldOrder[i]]]});

		if (i == 2)
			break;
	};
	
	filteredList.forEach((product) => {
		fragment.appendChild(this.buildProductItem({
			productId: Object.keys(product)[0],
			content: Object.values(product)[0]
		}));
	});

	wrapper.appendChild(fragment);
}
IndexProductItem.prototype.build = function() {
	this.buildRecentlyAdded();
	this.buildBestSeller();
	this.initialEventAssignment();
}
IndexProductItem.prototype.addToCart = async function(id = null) {
	if (id === null)
		return false;
	
	await this.shoppingCart.add([{id: id, quantity: 1}]);
}

export default IndexProductItem;