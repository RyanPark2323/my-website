document.addEventListener("DOMContentLoaded", () => {
  // Menu functionality
  const menuIcon = document.getElementById("menu-icon");
  const menu = document.getElementById("menu");

  if (menuIcon && menu) {
    menuIcon.addEventListener("click", () => {
      console.log("Menu icon clicked!");  // Debug log
      menu.classList.toggle("hidden");
    });

    document.querySelectorAll("#menu a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("hidden");
      });
    });
  }
});
