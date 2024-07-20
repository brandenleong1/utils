const Colors = {

rgb2Hex : function(rgb) {
	return '#' + rgb.split(' ').map(e => parseInt(e.replace(/\D/g, ''), 10).toString(16)).join('');
},

cssColor2Rgb : function(str) {
	let x = document.createElement('div');
	x.style.color = str;
	let s = x.style.color;
	x.remove();
	return s;
},

randHSL : function() {
	return 'hsl(' + Math.random() + 'turn, ' + (Math.random() * 10 + 45) + '%, 50%)';
},

whiteOrBlackText : function(rgbBG) {
	let rgb = rgbBG.split(' ').map(e => parseFloat(e.replace(/[^0-9.]/g, '')));
	if ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186) {
		return '#000000';
	} else {
		return '#ffffff';
	}
}

};