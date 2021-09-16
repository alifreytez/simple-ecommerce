import { default as DependenciesHandler } from "./Dependencies.js"
import EventAssign from "./EventAssign.js"
import DBProducts from "./DBProducts.js"
import TemplateQuery from "./TemplateQuery.js"

function Product(dependencies) {
	this.dependencies = new DependenciesHandler({target: this, dependencies: dependencies});
	TemplateQuery.then((tmpl) => {
		this.allTmpl = tmpl;
		this.build();
	});
}

/* OWN METHODS */
Product.prototype.getUrlProductParam = function() {
	let paramsTxt = "", paramsArr = [];

	paramsTxt = location.search !== undefined ? location.search.slice(1) : "";
	paramsArr = paramsTxt.split("&")
		.map((element) => /^p\=[\da-zA-Z]+$/.test(element) ? element : null)
		.filter((element) => element !== null);

	return paramsArr.length ? paramsArr[0].slice(2) : null;
}
Product.prototype.build = async function() {
	const wrapper = document.getElementById("wrapper"),
		productId = this.getUrlProductParam(),
		info = await DBProducts.find(productId);

	if (productId === null || info === null) {
		wrapper.style.display = "none";
		document.getElementById("nothing").style.display = "flex";
		document.title = "alifreytez | Invalid product request"
		return false;
	}

	const listFragment = document.createDocumentFragment(),
		descriptionFragment = document.createDocumentFragment(),
		template = this.allTmpl.getElementById("product-element").content.cloneNode(true);

	info.details.forEach((element) => {
		const detailName = Object.keys(element)[0],
			liTemplate = this.allTmpl.getElementById("product-detail-element").content.cloneNode(true);
		
		liTemplate.querySelector(".title").textContent = detailName;
		liTemplate.querySelector(".text").textContent = element[detailName];

		listFragment.appendChild(liTemplate);
	});
	Object.entries(info.description).forEach(([key, value]) => {
		const element = document.createElement(key);

		switch(key) {
			case "p":
				element.innerHTML = value;
			break;
			case "ul":
				const ulFragment = document.createDocumentFragment();
				value.forEach((liContent) => {
					const li = document.createElement("li");
					li.innerHTML = liContent;
					ulFragment.appendChild(li);
				});
				element.appendChild(ulFragment);
			break;
		}

		descriptionFragment.appendChild(element);
	});

	template.querySelector(".wrapper").classList.add("rank");
	template.querySelector(".wrapper").classList.add(`rank-${info.rank}`);
	template.querySelector(".image img").src = Object.entries(info.image)[0][1];
	template.querySelector(".image img").classList.add(Object.keys(info.image)[0]);
	template.querySelector(".image img").alt = info.name;
	template.querySelector(".available-stock").textContent = "Available " + info.availableStock;
	template.querySelector(".sold-stock").textContent = "Sold " + info.soldStock;
	template.querySelector("h2").textContent = info.name;
	template.querySelector(".price").textContent = "$" + info.price;
	template.querySelector(".options").setAttribute("data-productId", productId);
	template.querySelector("#description").appendChild(descriptionFragment);
	template.querySelector(".details ul").appendChild(listFragment);

	wrapper.appendChild(template);
	document.title = "alifreytez | " + info.name;
	this.initialEventAssignment();
}
Product.prototype.initialEventAssignment = function() {
	// Before submit
	EventAssign.add({
		eventType: "submit",
		target: "#buy-form, #buy-form *",
		callback: this.beforeGo.bind(this)
	});
}
Product.prototype.beforeGo = async function(event) {
	event.preventDefault();
	
	const form = document.getElementById("buy-form");
	let element = event.target;

	// Validate quantity
	if (!/^\d+$/.test(form.quantity.value) || form.quantity.value == 0)
		return false;

	// Search for element which has the ID of product
	while (!element.hasAttribute("data-productId"))
		element = element.parentElement;

	let added = await this.addToCart({
		id: element.getAttribute("data-productId"),
		quantity: form.quantity.value
	});
	if (added)
		location.href = "buy.html"
}
Product.prototype.addToCart = async function({ id = null, quantity = 1 }) {
	if (id === null)
		return false;

	return await this.shoppingCart.add([{id: id, quantity: quantity}]);
}

export default Product;