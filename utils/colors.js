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
},

rgb2Hsl : function(r, g, b) {
	// r, g, b ∈ [0, 1]
	// h, s, l ∈ [0, 1]

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);

	var h, s, l = (max + min) / 2;

	if (max == min) h = s = 0;
	else {
		let c = max - min;
		s = l > 0.5 ? c / (2 - max - min) : c / (max + min);

		switch (max) {
			case r: h = (g - b) / c + (g < b ? 6 : 0); break;
			case g: h = (b - r) / c + 2; break;
			case b: h = (r - g) / c + 4; break;
		}

		h /= 6;
	}

	return [h, s, l];
},

hsl2Rgb : function(h, s, l) {
	// h, s, l ∈ [0, 1]
	// r, g, b ∈ [0, 1]

	let r, g, b;

	if (s == 0) {
		r = g = b = l;
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		let p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [r, g, b];
}

};