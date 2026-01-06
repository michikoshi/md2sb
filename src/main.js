import md2sb from 'md2sb';

const markdownInput = document.getElementById('markdown-input');
const scrapboxOutput = document.getElementById('scrapbox-output');
const copyBtn = document.getElementById('copy-btn');
const removeParensBtn = document.getElementById('remove-parens-btn');
const themeToggle = document.getElementById('theme-toggle');

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Convert markdown to scrapbox
async function convert() {
  const markdown = markdownInput.value;
  if (!markdown.trim()) {
    scrapboxOutput.value = '';
    return;
  }

  try {
    const result = await md2sb(markdown);
    scrapboxOutput.value = result;
  } catch (error) {
    scrapboxOutput.value = `Error: ${error.message}`;
  }
}

// Debounced convert function (300ms delay)
const debouncedConvert = debounce(convert, 300);

// Input event listener
markdownInput.addEventListener('input', debouncedConvert);

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
  const text = scrapboxOutput.value;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');

    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
});

// Remove parentheses
removeParensBtn.addEventListener('click', () => {
  const text = scrapboxOutput.value;
  if (!text) return;

  const cleanedText = text.replace(/\(\)/g, '');
  scrapboxOutput.value = cleanedText;

  removeParensBtn.textContent = 'Removed!';
  removeParensBtn.classList.add('removed');

  setTimeout(() => {
    removeParensBtn.textContent = 'Remove ()';
    removeParensBtn.classList.remove('removed');
  }, 2000);
});

// Theme toggle
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function getStoredTheme() {
  return localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Initialize theme
setTheme(getStoredTheme());

// Initial conversion if there's content
if (markdownInput.value) {
  convert();
}
