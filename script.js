document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const sunIcon = '☀️';
    const moonIcon = '🌙';

    // Function to set the theme
    const setTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        themeToggleBtn.textContent = theme === 'dark' ? sunIcon : moonIcon;
        localStorage.setItem('theme', theme);
    };

    // Check for saved theme in localStorage or user's preference (Media Querie)
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    // Set initial theme
    setTheme(currentTheme);

    // Listener for the toggle button
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Listener for changes in OS theme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { // Only change if user hasn't set a preference
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
