import MenuDisplay from "./MenuDisplay.js"

function ResponsiveSearchMenu() {
	this.super({
		queryButton: ["#show-search"],
		queryElementMenu: "#search-wrapper",
		onOutsideMenu: [
			{queryButton: "#hide-search", callback: this.hide.bind(this)}
		],
		callback: this.show.bind(this)
	});
}

/* INHERITANCE*/
ResponsiveSearchMenu.prototype = new MenuDisplay({});
ResponsiveSearchMenu.prototype.constructor = ResponsiveSearchMenu;
ResponsiveSearchMenu.prototype.super = MenuDisplay;

export default ResponsiveSearchMenu;