const RateFuncs = {

linear : function(x) {
	return x;
},

sigmoid : function(x) {
	return 1 / (1 + Math.exp(-x));
},

smooth : function(x, inflection = 10) {
	let error = RateFuncs.sigmoid(-inflection / 2);
	return Math.min(Math.max((RateFuncs.sigmoid(inflection * (x - 0.5)) - error) / (1 - 2 * error), 0), 1);
},



easeInCubic : function(x) {
	return x * x * x;
},

easeOutCubic : function(x) {
	return 1 - Math.pow(1 - x, 3);
},

easeInOutCubic : function(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
},

thereAndBack : function(x, inflection = 10) {
	let newX = x < 0.5 ? 2 * x : 2 * (1 - x);
	return RateFuncs.smooth(newX, inflection);
},

wiggle : function(x, wiggles = 2) {
	return RateFuncs.thereAndBack(x) * Math.sin(wiggles * Math.PI * x);
}

}