function rot(s, i) {
	return s.replace(/[a-zA-Z]/g, function (c) {
		return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + i) ? c : c - 26);
	});
}
var encrypted = "esadlg:kgdaffwf@hjglgf.ew";
var els = document.getElementsByName('email');
for (i = 0; i < els.length; i++) {
	els[i].setAttribute('style', "display: flex");
	els[i].href = rot(encrypted, 8);
	var ps = els[i].getElementsByTagName('span');
	if (ps.length > 0) {
		ps[0].innerText = "E-mail";
	}
}