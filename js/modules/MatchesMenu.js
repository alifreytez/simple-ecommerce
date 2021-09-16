import MenuDisplay from "./MenuDisplay.js"
import DBProducts from "./DBProducts.js"
import TemplateQuery from "./TemplateQuery.js"

function MatchesMenu() {
	this.super({
		queryButton: ["#search input"],
		queryElementMenu: "#matches-menu",
		event: "input",
		onOutsideMenu: [
			{eventN: "click", queryButton: "all", callback: this.hide.bind(this)}
		],
		callback: this.show.bind(this)
	});
	TemplateQuery.then((tmpl) => this.allTmpl = tmpl);
	DBProducts.read().then((products) => this.products = products);
	this.initialEventAssignment();
}

/* INHERITANCE*/
MatchesMenu.prototype = new MenuDisplay({});
MatchesMenu.prototype.constructor = MatchesMenu;
MatchesMenu.prototype.super = MenuDisplay;

/* OWN METHODS */
MatchesMenu.prototype.buildMatch = function({ productId = null, content = {} }) {
	if (productId === null)
		return false;

	const template = this.allTmpl.getElementById("match-result-element").content.cloneNode(true);

	template.querySelector("a").href = `product.html?p=${productId}`;
	template.querySelector("a").innerHTML = content.name;

	return template;
}
MatchesMenu.prototype.showMatches = function(matches) {
	const wrapper = document.querySelector("#matches-menu ul"),
		fragment = document.createDocumentFragment();

	Object.entries(matches).forEach(([productId, content]) => {
		const template = this.buildMatch({
			productId: productId,
			content: content
		});

		if (template)
			fragment.appendChild(template);
	});

	wrapper.innerHTML = "";
	wrapper.appendChild(fragment);
}
MatchesMenu.prototype.searchInput = function() {
	event.target.value = event.target.value.replace(/(\<script|script\/\>)+/g, "");
	if (event.target.value == "") {
		document.querySelector("#matches-menu ul").innerHTML = `<li class="no-match">No matches found</li>`;
		return false;
	}

	const search = event.target.value.toLowerCase();
	let nameMatches = [], detailsMatches = [], nameMatchesId = [], detailsMatchesId, matchResult = [];

	nameMatches = Object.entries(this.products).filter((product) => product[1].name.toLowerCase().includes(search));
	detailsMatches = Object.entries(this.products).filter((product) => {
		return product[1].details.some((detail) => {
			return Object.entries(detail).join(" _ ").toLowerCase().includes(search);
		});
	});
	matchResult = [...nameMatches, ...detailsMatches].reduce((accumulator, current) => {
		const [productId, content] = current;

		if (!accumulator.hasOwnProperty(productId))
			accumulator[productId] =  content;

		return accumulator;
	}, {});

	if (Object.keys(matchResult).length) {
		this.showMatches(matchResult);
	} else {
		document.querySelector("#matches-menu ul").innerHTML = `<li class="no-match">No matches found</li>`;
	}
}
MatchesMenu.prototype.initialEventAssignment = async function() {
	document.getElementById("search").addEventListener("submit", () => event.preventDefault());
	// On input searching match
	document.getElementById("search-product").addEventListener("input", this.searchInput.bind(this))
}

export default MatchesMenu;