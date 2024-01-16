const getCookieFromServer = (name) => {
  //   return cookies.get(name);
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      let val = c.substring(nameEQ.length, c.length);
      if (name == "idToken") {
        return val;
      }
    }
  }
};

const getCookie = (name) => {
  //   return cookies.get(name);
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      let val = c.substring(nameEQ.length, c.length);

      if (name != "rfToken") {
        if (val) {
          localStorage.setItem(name, val);
        }
      }

      return val;
    }
  }
  return localStorage.getItem(name);
};

module.exports = {
  getCookie,
  getCookieFromServer,
};
