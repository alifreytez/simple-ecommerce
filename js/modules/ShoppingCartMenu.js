import { default as DependenciesHandler } from "./Dependencies.js"
import MenuDisplay from "./MenuDisplay.js"
import TemplateQuery from "./TemplateQuery.js"
import EventAssign from "./EventAssign.js"

function ShoppingCartMenu(dependencies) {
	this.dependencies = new DependenciesHandler({target: this, dependencies: dependencies});
	this.super({
		queryButton: ["#shopping-cart-btn"],
		queryElementMenu: "#shopping-cart-menu",
		onOutsideMenu: [
			{queryButton: "all", callback: this.hide.bind(this)}
		],
		callback: this.switcher.bind(this)
	});
	TemplateQuery.then((tmpl) => this.allTmpl = tmpl);
	this.initialEventAssignment();
}

/* INHERITANCE */
ShoppingCartMenu.prototype = new MenuDisplay({});
ShoppingCartMenu.prototype.constructor = ShoppingCartMenu;
ShoppingCartMenu.prototype.super = MenuDisplay;

/* OVEWRITED METHODS */
ShoppingCartMenu.prototype.hide = function() {
	document.getElementById("shopping-cart-menu").classList.remove("updated");
	MenuDisplay.prototype.hide.call(this);
}

/* OWN METHODS */
ShoppingCartMenu.prototype.initialEventAssignment = function() {
	EventAssign.add({
		target: ".shopping-cart-btn, .shopping-cart-btn *",
		callback: this.update.bind(this)
	})
}
ShoppingCartMenu.prototype.update = async function(masterPass = false) {
	if (document.getElementById("shopping-cart-menu").classList.contains("updated") && !masterPass)
		return false;

	const cart = this.shoppingCart.getList(),
		wrapper = document.querySelector("#shopping-cart-menu ul"),
		fragment = document.createDocumentFragment();

	// Cart is not empty
	if (Object.keys(cart).length) {
		Object.entries(cart).forEach(([key, value]) => {
			const template = this.allTmpl.getElementById("shopping-cart-menu-element").content.cloneNode(true);

			template.querySelector(".quantity").textContent = value["quantity"];
			template.querySelector(".name").textContent = value["name"];
			template.querySelector(".options").setAttribute("data-productId", key);

			fragment.appendChild(template);
		});

		wrapper.innerHTML = "";
		wrapper.appendChild(fragment);

		// Remove Button Event Assignment
		EventAssign.add({
			target: ".remove-product, .remove-product *",
			callback: this.remove.bind(this)
		})
	}
	// Cart is empty
	else {
		const li = document.createElement("li");
		li.innerHTML = "<span style='font-size: 14px'>There is nothing yet</span>";
		fragment.appendChild(li);

		wrapper.innerHTML = "";
		wrapper.appendChild(fragment);
	}

	document.getElementById("shopping-cart-menu").classList.add("updated");
}
ShoppingCartMenu.prototype.remove = function(event) {
	let element = event.target;

	while (!element.hasAttribute("data-productId"))
		element = element.parentElement;

	this.shoppingCart.remove(element.getAttribute("data-productId"));
	this.update(true);
}

export default ShoppingCartMenu;