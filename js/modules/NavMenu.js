import MenuDisplay from "./MenuDisplay.js"

function NavMenu() {
	this.super({
		queryButton: ["#menu-btn"],
		queryElementMenu: "#nav-menu",
		callback: this.switcher.bind(this)
	});
}

/* INHERITANCE*/
NavMenu.prototype = new MenuDisplay({});
NavMenu.prototype.constructor = NavMenu;
NavMenu.prototype.super = MenuDisplay;

export default NavMenu;