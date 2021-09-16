function CRUD(fileName = "") {
	this.file = fileName;
}

CRUD.prototype.find = async function(id = null) {
	if (id === null)
		return false;

	const {...tempList} = await this.read().then(res => res);

	return tempList.hasOwnProperty(id) ? tempList[id] : null;
}
CRUD.prototype.read = function() {
	async function getData() {
		try {
            let res = await window.fetch(`db/${this.file}`),
                json = await res.json();

            if (!res.ok) throw {status: res.status, statusText: res.statusText};
            
            return json;
        } catch (error) {
            console.log(`Error <${error.status}>: ${error.statusText || "desconocido"}`);
        }
    }

    return getData.call(this, {});
}
CRUD.prototype.remove = async function(id = null) {
	if (id === null)
		return false;

	const {...tempList} = await this.read().then(res => res);
	delete tempList[id];

	return tempList;
}
CRUD.prototype.modify = async function({ id = null, data = {} }) {
	if (id === null)
		return false;

	const {...tempList} = await this.read().then(res=> res);
	Object.entries(data).forEach(([key, value]) => tempList[key] = value);

	return tempList;
}
CRUD.prototype.save = function(data = null) {
	if (data === null)
		return false;

	const formattedInfo = new FormData(),
		info = {
			file: this.file,
			data: JSON.stringify(data)
		};

	formattedInfo.append("db", JSON.stringify(info));

	return fetch("/saveDB.php", {
	    method: "POST",
	    body: formattedInfo
	})
	.then(res => res.json());
}

export default CRUD;