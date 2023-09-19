"use strict";
(() => {
  window.addEventListener("scroll", stickyFn);

  var navbar = document.querySelector(".app-sidebar");
  var navbar1 = document.querySelector(".app-header");
  var sticky = navbar.offsetTop;
  // var sticky1 = navbar1.clientHeight;
  function stickyFn() {
    if (window.pageYOffset > sticky) {
      navbar.classList.add("sticky");
      navbar1.classList.add("sticky-pin");
    } else {
      navbar.classList.remove("sticky");
      navbar1.classList.remove("sticky-pin");
    }
  }
})();

window.addEventListener("unload", () => {
  // removing the scroll function
  window.addEventListener("scroll", stickyFn);
  window.addEventListener("DOMContentLoaded", stickyFn);
});
