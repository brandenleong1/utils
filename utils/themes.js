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
}

};

(function() {
	let src = document.currentScript ? document.currentScript.src : document.baseURI;
	for (let theme of Themes.themes) {
		theme[1] = new URL('../themes/' + theme[1], src).href;
	}
})();
