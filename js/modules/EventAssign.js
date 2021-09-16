function EventAssign() {}

EventAssign.add = function({ eventType = "click", target = "", callback = function() {} }) {
	if (typeof callback !== "function") {
		document.addEventListener(eventType, callback.name);
		return true;
	}
	document.addEventListener(eventType, () => {
		if (event.target.matches(target))
			callback(event);
	});
}
EventAssign.remove = function() {}

export default EventAssign;