// Dependencies: utils/animate.js

window.addEventListener('load', function() {
	for (let e of document.querySelectorAll('.popup')) {
		var bounding = document.createElement('div');

		e.parentNode.replaceChild(bounding, e);
		bounding.append(e);
		bounding.classList.add('popup-bounding');

		Animate.remove(bounding);
	}
});

const Popup = {

// e: HTMLDivElement (.popup)
popup : async function(e, fallingEdgeFunc = function() {}) {
	if (e.classList.contains('popup')) {
		Array.from(document.querySelectorAll('.popup')).forEach(e1 => {
			e1.parentNode.onclick = null;
			e1.parentNode.style.pointerEvents = 'auto';
		});

		await Animate.animateGroup(Array.from(document.querySelectorAll('.popup')).filter(e1 => e1.parentNode.style.opacity != 0).map(e1 => [[e1.parentNode, Animate.fadeOut, {}], [e1, Animate.fadeOut, {shiftTo: UP}]]).flat());

		await Animate.animateGroup([[e.parentNode, Animate.fadeIn, {}], [e, Animate.fadeIn, {shiftFrom: UP}]]);

		Array.from(document.querySelectorAll('.popup')).filter(e1 => e1 != e).forEach(e1 => {
			e1.parentNode.style.pointerEvents = 'none';
		});

		e.parentNode.onclick = async function(event) {
			if (event.target == e.parentNode) {
				e.parentNode.onclick = null;
				await Animate.animateGroup([[e.parentNode, Animate.fadeOut, {}], [e, Animate.fadeOut, {shiftTo: UP}]]);
				fallingEdgeFunc();
				e.parentNode.style.pointerEvents = 'none';
			}
		};
	}
},

toastPopup : async function(text, direction = Vector3.add(DOWN, LEFT), duration = 1000) {
	if (document.querySelector('#toast-popup')) document.querySelector('#toast-popup').remove();

	let toast = document.createElement('div');
	toast.id = 'toast-popup';
	toast.innerText = text;
	document.body.append(toast);

	function setToastXY() {
		let [toast_width, toast_height] = [toast.getBoundingClientRect().width, toast.getBoundingClientRect().height];
		let [new_x, new_y] = [(window.visualViewport.width / 2 - 20) * (1 + direction.x), (window.visualViewport.height / 2 - 20) * (1 - direction.y)];

		toast.style.top = new_y + 20 - (toast_height / 2 * (1 - direction.y)) + 'px';
		toast.style.left = new_x + 20 - (toast_width / 2 * (1 + direction.x)) + 'px';
	}
	setToastXY();

	window.addEventListener('resize', setToastXY);

	await Animate.remove(toast);
	await Animate.fadeIn(toast);
	await Animate.wait(duration);
	await Animate.fadeOut(toast);
	toast.remove();

	window.removeEventListener('resize', setToastXY);
},

hoverHelperFuncs : {
	enter : function(e) {
		if (!document.querySelector('#hover-popup')) {
			let hover = document.createElement('div');
			hover.id = 'hover-popup';
			hover.innerText = e.target.hoverText;
			document.body.append(hover);
			hover.style.top = e.clientY + 5 + 'px';
			hover.style.left = e.clientX + 5 + 'px';
		} else {
			document.querySelector('#hover-popup').remove();
		}
	},
	move : function(e) {
		let hover = document.querySelector('#hover-popup');
		if (hover) {
			hover.style.top = e.clientY + 5 + 'px';
			hover.style.left = e.clientX + 5 + 'px';
		}
	},
	out : function() {
		if (document.querySelector('#hover-popup')) document.querySelector('#hover-popup').remove();
	}
},

createHoverPopup : function(text, element) {
	element.hoverText = text;
	element.addEventListener('mouseenter', Popup.hoverHelperFuncs.enter);
	element.addEventListener('mousemove', Popup.hoverHelperFuncs.move);
	element.addEventListener('mouseout', Popup.hoverHelperFuncs.out);
},

removeHoverPopup : function(element) {
	element.removeEventListener('mousemove', Popup.hoverHelperFuncs.move);
	element.removeEventListener('mouseenter', Popup.hoverHelperFuncs.enter);
	element.removeEventListener('mouseout', Popup.hoverHelperFuncs.out);
}

};