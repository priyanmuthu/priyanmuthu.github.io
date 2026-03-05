(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem("theme");
  } catch (e) {
    storedTheme = null;
  }

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  function setTheme(theme) {
    var isDark = theme === "dark";
    root.setAttribute("data-theme", theme);
    toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    toggle.setAttribute("aria-pressed", String(isDark));
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* Ignore storage failures in private mode/restricted contexts. */
    }
  }

  setTheme(initialTheme);
  toggle.addEventListener("click", function () {
    var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
})();
