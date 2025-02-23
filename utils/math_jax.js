(function() {
	let script = document.createElement('script');
	script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
	document.head.append(script);

	script = document.createElement('script');
	script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
	script.setAttribute('async', '');
	document.head.append(script);
})();