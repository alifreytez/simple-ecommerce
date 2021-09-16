import { default as DependenciesHandler } from "./Dependencies.js"
import EventAssign from "./EventAssign.js"
import DBProducts from "./DBProducts.js"
import TemplateQuery from "./TemplateQuery.js"

function BuyItem(dependencies) {
	this.dependencies = new DependenciesHandler({target: this, dependencies: dependencies});
	TemplateQuery.then((tmpl) => {
		this.allTmpl = tmpl;
		this.update();
	});
	this.initialEventAssignment();
	this.validateNameInput();
}

/* OWN METHODS */
BuyItem.prototype.initialEventAssignment = function() {
	EventAssign.add({
		eventType: "input",
		target: ".purchase input",
		callback: this.validateNameInput.bind(this)
	});
	EventAssign.add({
		target: ".purchase ul li button, .purchase ul li button *",
		callback: this.beforeSend.bind(this)
	});
	EventAssign.add({
		target: "#ready-purchase button",
		callback: this.confirmPurchase.bind(this)
	});
}
BuyItem.prototype.update = function() {
	this.updatePrice();
	this.updateItems();
}
BuyItem.prototype.updatePrice = function() {
	const cart = this.shoppingCart.getList(),
		element = document.getElementById("total-amount");
	let total = 0;

	Object.entries(cart).forEach(([productId, cartElement]) => total += cartElement.price * parseFloat(cartElement.quantity));

	element.textContent = "$" + total.toFixed(2);
}
BuyItem.prototype.updateItems = async function() {
	const cart = this.shoppingCart.getList(),
		cartArr = Object.entries(cart),
		wrapper = document.getElementById("product-list"),
		fragment = document.createDocumentFragment();
	
	wrapper.classList.remove("grid");

	if (cartArr.length == 0) {
		wrapper.innerHTML = "";
		wrapper.insertAdjacentHTML("afterbegin", "<li>There are not products in your shopping cart.</li>")
		return false;
	}

	for (let [productId, cartElement] of cartArr) {
		const info = await DBProducts.find(productId),
			template = this.allTmpl.getElementById("buy-item-element").content.cloneNode(true);
		
		template.querySelector(".list-item").classList.add(`rank`);
		template.querySelector(".list-item").classList.add(`rank-${info.rank}`);
		template.querySelector(".p-image img").src = Object.entries(info.image)[0][1];
		template.querySelector(".p-image img").classList.add(Object.keys(info.image)[0]);
		template.querySelector(".desc .p-name").textContent = info.name;
		template.querySelector(".desc .p-price").textContent = "$" + info.price;
		template.querySelector(".options").setAttribute("data-productId", productId);
		template.querySelector(".quantity").setAttribute("name", productId);
		template.querySelector(".quantity").value = cartElement.quantity;

		fragment.appendChild(template);
	}

	wrapper.classList.add("grid");
	wrapper.innerHTML = "";
	wrapper.appendChild(fragment);
	this.productItemEventAssignment();
}
BuyItem.prototype.productItemEventAssignment = function() {
	EventAssign.add({
		target: ".remove-from-cart, .remove-from-cart *",
		callback: this.removeFromCart.bind(this)
	});
	EventAssign.add({
		eventType: "keyup",
		target: ".product-list .quantity",
		callback: this.quantityItemControl.bind(this)
	});
}
BuyItem.prototype.removeFromCart = function(event) {
	let element = event.target;

	// Search for element which has the ID of product
	while (!element.hasAttribute("data-productId"))
		element = element.parentElement;

	this.shoppingCart.remove(element.getAttribute("data-productId"));
	this.update();
}
BuyItem.prototype.validateSendingMethod = function() {
	const ul = document.getElementById("sending-method"),
		input = document.getElementById("client-name"),
		cartArr = Object.keys(this.shoppingCart.getList());

	if (input.value != "" && /^[\w\s]+$/.test(input.value) && cartArr.length)
		ul.classList.remove("unavailable");
	else
		ul.classList.add("unavailable");
}
BuyItem.prototype.validateNameInput = function(event) {
	let element = document.getElementById("client-name");

	if (element.value != "" && !/^[\w\s]+$/.test(element.value))
		element.classList.add("wrong");
	else
		element.classList.remove("wrong");

	this.validateSendingMethod();
}
BuyItem.prototype.quantityItemControl = function(event) {
	let target = event.target,
		element = target,
		value = target.value;

	if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "Backspace"].includes(event.key))
		value = target.value.split("").filter((value) => /^\d$/.test(value)).join("");

	target.value = value == "" ? 1 : value;

	// Search for element which has the ID of product
	while (!element.hasAttribute("data-productId"))
		element = element.parentElement;

	this.shoppingCart.modify({
		id: element.getAttribute("data-productId"),
		data: {quantity: parseFloat(target.value)}
	}).then(() => this.updatePrice());
}
BuyItem.prototype.confirmPurchaseDisplay = function(show = false) {
	const wrapper = document.getElementById("ready-purchase");
	if (show) {
		wrapper.classList.add("show");
		setTimeout(() => wrapper.classList.add("after-showed"), 200);
	} else {
		wrapper.classList.remove("after-showed");
		setTimeout(() => wrapper.classList.remove("show"), 200);
	}
}
BuyItem.prototype.confirmPurchase = function(event) {
	const element = event.target;
	switch(element.textContent.toLowerCase()) {
		case "yes":
			this.shoppingCart.updateList({});
			location.href = "./";
		break;
	}
	this.confirmPurchaseDisplay(false);
}
BuyItem.prototype.beforeSend = function(event) {
	if (document.getElementById("sending-method").classList.contains("unavailable"))
		return false;

	let element = event.target;

	// Search for li element parent
	while (element.tagName != "LI")
		element = element.parentElement;

	this.prepareSending(element.classList.item(0));
}
BuyItem.prototype.prepareSending = function(type) {
	const wrapperAdditional = document.getElementById("additional-info");
	switch (type) {
		case "whatsapp":
			this.send(type);
		break; 
	}
}
BuyItem.prototype.send = async function(type = null) {
	const cart = this.shoppingCart.getList(),
		cartArr = Object.entries(cart);
	let finalArr = [],
		finalText = "",
		totalAmount = 0;

	for (const [productId, cartElement] of cartArr) {
		finalArr.push(`*${cartElement.name.replace(/\s+/g, "%20")}* _(${cartElement.quantity} unit)_`);
		totalAmount += parseFloat(cartElement.price) * parseFloat(cartElement.quantity);
	}

	finalText = `Greetings, my name is *${document.getElementById("client-name").value}*.
	I inform you that I would like to make a purchase in alifreytez.
	Total Amount: *$${totalAmount}*. Product(s): ${finalArr.join("; ")}`.replace(/\s+/g, "%20");	

	switch (type) {
		case "whatsapp":
			const a = document.createElement("a");
			a.target= "_blank";
			a.href= "https://wa.me/584121502028?text=" + finalText;
			a.click();

			this.confirmPurchaseDisplay(true);
		break; 
	}
}

export default BuyItem;