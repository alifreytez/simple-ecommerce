import EventAssign from "./EventAssign.js"

function MenuDisplay(identity) {
	if (typeof identity.queryElementMenu !== 'undefined') {
		this.elementMenu = identity.queryElementMenu != "" ? document.querySelector(identity.queryElementMenu) : null;
		this.inOperation = identity.queryElementMenu != "" ? false : true;
		this.EventAssignment(identity);
	}
}
MenuDisplay.prototype.EventAssignment = function(identity) {
	const {
		queryButton: idSwitcher = null,
		queryElementMenu: idMenuElement = null,
		event: eventN = "click",
		callback = null,
		onOutsideMenu = false
	} = identity;
	const matchString = idSwitcher.map((element) => `${element},${element} *`).join();

	EventAssign.add({
		eventType: eventN,
		callback: {
			name: function(event) {
				// Element match.
				if (event.target.matches(matchString)) {
					callback();
				}
				// Element not match, so check if there is something to do in this case.
				else if (onOutsideMenu) {
					onOutsideMenu.forEach((element) => {
						if (typeof element === "object") {
							const isAll = element.queryButton == "all" && !event.target.matches(`${idMenuElement}, ${idMenuElement} *`),
								isSpecificButton = event.target.matches(`${element.queryButton}, ${element.queryButton} *`);

							if (isAll || isSpecificButton)
								element.callback();
						}
					});
				}
			}
		}
	});
	if (onOutsideMenu) {
		for (const element of onOutsideMenu) {
			if (typeof element !== "object" || !element.hasOwnProperty("eventN"))
				continue;

			EventAssign.add({
				eventType: element.eventN,
				callback: {
					name: function(event) {
						const isAll = element.queryButton == "all" && !event.target.matches(`${idMenuElement}, ${idMenuElement} *, ${matchString}`),
							isSpecificButton = event.target.matches(`${element.queryButton}, ${element.queryButton} *`);
						
						if (isAll || isSpecificButton)
							element.callback();
					}
				}
			});
		}
	}
}
MenuDisplay.prototype.show = function() {
	this.inOperation = true;
	// Enable menu.
	this.elementMenu.classList.add("show");
	// Show menu.
	setTimeout(() => {
		this.elementMenu.classList.add("after-showed");
		this.inOperation = false;
	}, 0);
}
MenuDisplay.prototype.hide = function() {
	this.inOperation = true;
	// Show menu.
	this.elementMenu.classList.remove("after-showed")
	// Disable menu.
	setTimeout(() => {
		this.elementMenu.classList.remove("show");
		this.inOperation = false;
	}, 200);
}
MenuDisplay.prototype.switcher = function() {
	if (!this.inOperation)
		this.elementMenu.classList.contains("show") ? this.hide() : this.show();
}

export default MenuDisplay;