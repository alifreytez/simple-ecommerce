import MatchesMenu from "./modules/MatchesMenu.js"
import NavMenu from "./modules/NavMenu.js"
import ResponsiveSearchMenu from "./modules/ResponsiveSearchMenu.js"
import ShoppingCart from "./modules/ShoppingCart.js"
import ShoppingCartMenu from "./modules/ShoppingCartMenu.js"

const matchesMenu = new MatchesMenu();
const navMenu = new NavMenu();
const responsiveSearchMenu = new ResponsiveSearchMenu();
const shoppingCart = new ShoppingCart();
const shoppingCartMenu = new ShoppingCartMenu({shoppingCart: shoppingCart});

export { shoppingCartMenu, matchesMenu, navMenu, responsiveSearchMenu, shoppingCart };


