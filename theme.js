/* Tema (light/dark) - o salvez in localStorage ca sa ramana si dupa refresh */
const root = document.documentElement;
const btn = document.getElementById("themeBtn");

export function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

export function initTheme() {
  setTheme(
    localStorage.getItem("theme") ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  if (btn) {
    btn.addEventListener("click", () =>
      setTheme(root.dataset.theme === "dark" ? "light" : "dark")
    );
  }
}
