export const applyDarkMode = () => {
  const darkModeEnabled = JSON.parse(localStorage.getItem('darkMode')) || false;
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

export const toggleDarkMode = (isEnabled) => {
  document.body.classList.toggle('dark-mode', isEnabled);
  localStorage.setItem('darkMode', isEnabled);
};

export const initializeDarkMode = () => {
  applyDarkMode();
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    darkModeToggle.checked = document.body.classList.contains('dark-mode');
    darkModeToggle.addEventListener('change', (event) => {
      toggleDarkMode(event.target.checked);
    });
  }
};

document.addEventListener('DOMContentLoaded', initializeDarkMode);