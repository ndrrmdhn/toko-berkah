const menuBtn = document.getElementById("menu-btn");

const mobileNav = document.getElementById("mobile-nav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });
}
