const Themes = {

themes : [
	['Light', 'https://cdn.jsdelivr.net/gh/brandenleong1/utils@latest/themes/theme_light.css'],
	['Dark', 'https://cdn.jsdelivr.net/gh/brandenleong1/utils@latest/themes/theme_dark.css'],
	['Sepia', 'https://cdn.jsdelivr.net/gh/brandenleong1/utils@latest/themes/theme_sepia.css']
],

createThemeCSS : function(id = 0) {
	let link = document.createElement('link');
	link.id = 'theme-css';
	link.href = Themes.themes[id][1];
	link.type = 'text/css';
	link.rel = 'stylesheet';
	document.head.append(link);
}

}