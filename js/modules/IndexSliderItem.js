import EventAssign from "./EventAssign.js"

function IndexSliderItem() {
	this.animationAssignment();
}

/* OWN METHODS */
IndexSliderItem.prototype.initialEventAssignment = function(data) {
	window.addEventListener('resize', () => {
		const wrapp = document.getElementById("testimonial-slider-wrap");
		wrapp.style.left = 0;
		wrapp.setAttribute("data-orientation", "front");
		wrapp.querySelector(".current").classList.remove("current");
		wrapp.querySelector(".slider-item").classList.add("current");
		clearInterval(this.testimonialInterval);
		this.setTestimonialInterval(data);
	});
}
IndexSliderItem.prototype.setTestimonialInterval = function({ section = "", wrapper = null, items = null, callback = function(){} }) {
	const time = section == "testimonial" ? 8000 : 4000;
	this[`${section}Interval`] = setInterval(callback.bind(this, { wrapper: wrapper, items: items }), time);
}
IndexSliderItem.prototype.assignAnimation = function({ section = "", wrapperSelector = null, itemSelector = null, callback = function(){} }) {
	if (wrapperSelector === null || itemSelector === null)
		return false;

	const wrapper = document.getElementById(wrapperSelector),
		items = wrapper.querySelectorAll(`.${itemSelector}`),
		data = {section, items, wrapper, callback};

	this.setTestimonialInterval(data);
	if (section == "testimonial")
		this.initialEventAssignment(data);
}
IndexSliderItem.prototype.prepareAnimation = function({ wrapper = null, items = null }) {
	let currentElement = wrapper.querySelector(".current"),
		currentElementNumber = parseFloat(currentElement.getAttribute("data-sliderItem")),
		animOrientation = wrapper.getAttribute("data-orientation"),
		nextElement = null;

	if (currentElementNumber == (items.length - 1) && animOrientation == "front") {
		wrapper.setAttribute("data-orientation", "backward");
		animOrientation = "backward";
	} else if (currentElementNumber == 0 && animOrientation == "backward") {
		wrapper.setAttribute("data-orientation", "front");
		animOrientation = "front";
	}

	nextElement = animOrientation == "front" ? items.item(currentElementNumber + 1) : items.item(currentElementNumber - 1);
	currentElement.classList.remove("current");
	nextElement.classList.add("current");

	return {currentElement: currentElement, nextElement: nextElement};
}
IndexSliderItem.prototype.animationBanner = function({ wrapper = null, items = null }) {
	const {currentElement, nextElement} = this.prepareAnimation({wrapper: wrapper, items: items});
	let move = parseFloat(getComputedStyle(nextElement).getPropertyValue("height")),
		currentTranslation = parseFloat(getComputedStyle(wrapper).getPropertyValue("top"));

	move = wrapper.getAttribute("data-orientation") == "front" ? -move : move;
	wrapper.style.top = `${currentTranslation + move}px`;
}
IndexSliderItem.prototype.animationTestimonial = async function({ wrapper = null, items = null }) {
	const {currentElement, nextElement} = this.prepareAnimation({wrapper: wrapper, items: items});
	let move = parseFloat(getComputedStyle(nextElement).getPropertyValue("width")),
		currentTranslation = parseFloat(getComputedStyle(wrapper).getPropertyValue("left"));	

	move = wrapper.getAttribute("data-orientation") == "front" ? -move : move;
	wrapper.style.left = `${currentTranslation + move}px`;
}
IndexSliderItem.prototype.animationAssignment = function() {
	this.assignAnimation({
		section: "banner",
		wrapperSelector: "banner-slider-wrap",
		itemSelector: "slider-item",
		callback: this.animationBanner
	});
	this.assignAnimation({
		section: "testimonial",
		wrapperSelector: "testimonial-slider-wrap",
		itemSelector: "slider-item",
		callback: this.animationTestimonial
	});
}

export default IndexSliderItem;