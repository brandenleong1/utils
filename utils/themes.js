const Themes = {

themes : [
	['Light',				'theme_light.css'],
	['Dark',				'theme_dark.css'],
	['Dark High Contrast',	'theme_dark_high_contrast.css'],
	['Sepia',				'theme_sepia.css']
],

createThemeCSS : function(id = 0) {
	let link = document.createElement('link');
	link.id = 'theme-css';
	link.href = Themes.themes[id][1];
	link.type = 'text/css';
	link.rel = 'stylesheet';
	document.head.append(link);
},

stackThemeLabels : function() {
	let label1 = document.querySelector('#theme-label-1');
	let label2 = document.querySelector('#theme-label-2');

	if (!label1 || !label2 || label1.parentNode != label2.parentNode) {
		return;
	}

	let box = label1.parentNode;
	if (box.dataset.themeStacked) {
		return;
	}
	box.dataset.themeStacked = '1';

	// The page's spacing text (&nbsp;) would become a grid item; a margin replaces it
	for (let node of Array.from(box.childNodes)) {
		if (node.nodeType == Node.TEXT_NODE) {
			node.remove();
		}
	}

	Object.assign(box.style, {
		display: 'inline-grid',
		width: 'auto',
		marginLeft: '0.5em',
		verticalAlign: 'top'
	});

	// Invisible copies of every theme name set the cell's width
	let sizers = Themes.themes.map(([name]) => {
		let sizer = document.createElement('span');
		sizer.textContent = name;
		sizer.setAttribute('aria-hidden', 'true');
		sizer.style.visibility = 'hidden';
		return sizer;
	});
	box.prepend(...sizers);

	// Undo the pages' inline label styles
	for (let el of [...sizers, label1, label2]) {
		Object.assign(el.style, {
			gridArea: '1 / 1',
			position: 'static',
			maxWidth: 'none',
			whiteSpace: 'nowrap',
			overflow: 'visible',
			textOverflow: 'clip'
		});
	}
}

};

(function() {
	let src = document.currentScript ? document.currentScript.src : document.baseURI;
	for (let theme of Themes.themes) {
		theme[1] = new URL('../themes/' + theme[1], src).href;
	}

	if (document.readyState == 'loading') {
		document.addEventListener('DOMContentLoaded', Themes.stackThemeLabels);
	} else {
		Themes.stackThemeLabels();
	}
})();
