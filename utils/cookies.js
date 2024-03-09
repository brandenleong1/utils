const Cookies = {

setCookie : function(cname, cvalue, ms) {
  const d = new Date();
  d.setTime(d.getTime() + ms);
  document.cookie = cname + '=' + cvalue + '; expires=' + d.toUTCString() + '; path=/';
},

getCookie : function(cname) {
	let name = cname + '=';
	let ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
		  c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
		  return c.substring(name.length, c.length);
		}
	}
	return null;
},

removeCookie : function(cname) {
	Cookies.setCookie(cname, '', 0);
}

};