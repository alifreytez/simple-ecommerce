import CRUD from "./CRUD.js"

function DBProducts() {
	this.super("products.json");
}

/* INHERITANCE */
DBProducts.prototype = new CRUD();
DBProducts.prototype.constructor = DBProducts;
DBProducts.prototype.super = CRUD;

/* OWN METHODS */

export default new DBProducts();


/*dbProducts.remove("a02").then(data => dbProducts.save(data).then(res => console.log("si", res)));*/
/*dbProducts.find("a03").then(res => console.log(res));*/
/*dbProducts.read().then(res => console.log(res));*/
/*dbProducts.modify({id: "a03", data: {price: 5000, name: "rigoberto"}})
.then(data => dbProducts.save(data).then(res => console.log("si", res)));*/