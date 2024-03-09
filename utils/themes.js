const Themes = {

themes : [
	['Light', 'https://utils.effofecks.repl.co/themes/theme_light.css'],
	['Dark', 'https://utils.effofecks.repl.co/themes/theme_dark.css']
],

createThemeCSS : function(id = 0) {
	let link = document.createElement('link');
	link.id = 'theme-css';
	link.href = Themes.themes[id][1];
	link.type = 'text/css';
	link.rel = 'stylesheet';
	document.head.appendChild(link);
}

}