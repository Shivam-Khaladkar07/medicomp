export function initQuickSearch() {
  const quickSearchButtons = document.querySelectorAll('.medicine-quick-search');
  const searchInput = document.getElementById('medicine-search');
  const searchBtn = document.getElementById('search-btn');

  quickSearchButtons.forEach(button => {
    button.addEventListener('click', () => {
      const medicine = button.getAttribute('data-medicine');
      if (searchInput && searchBtn) {
        searchInput.value = medicine;
        searchBtn.click();
      }
    });
  });
}