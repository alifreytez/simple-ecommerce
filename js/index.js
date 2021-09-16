import { shoppingCartMenu, matchesMenu, navMenu, responsiveSearchMenu, shoppingCart } from "./main.js"
import IndexProductItem from "./modules/IndexProductItem.js"
import IndexSliderItem from "./modules/IndexSliderItem.js"

const indexProductItem = new IndexProductItem({shoppingCart: shoppingCart});
const indexSliderItem = new IndexSliderItem();