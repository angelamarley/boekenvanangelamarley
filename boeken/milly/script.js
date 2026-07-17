(() => {
  const totalPages = 38;
  let currentPage = 1;
  let touchStartX = 0;

  const book = document.getElementById('book');
  const singleSlot = document.getElementById('singleSlot');
  const singlePage = document.getElementById('singlePage');
  const spread = document.getElementById('spread');
  const leftPage = document.getElementById('leftPage');
  const rightPage = document.getElementById('rightPage');
  const pageLabel = document.getElementById('pageLabel');
  const pageSelect = document.getElementById('pageSelect');
  const prevButtons = [document.getElementById('prevButton'), document.getElementById('prevButtonBottom')];
  const nextButtons = [document.getElementById('nextButton'), document.getElementById('nextButtonBottom')];
  const fullscreenButton = document.getElementById('fullscreenButton');

  const pageUrl = page => `pages/pagina-${String(page).padStart(2, '0')}.jpg`;
  const isDesktop = () => window.matchMedia('(min-width: 761px)').matches;

  for (let page = 1; page <= totalPages; page += 1) {
    const option = document.createElement('option');
    option.value = String(page);
    option.textContent = `Pagina ${page}`;
    pageSelect.appendChild(option);
  }

  function preloadAround(page) {
    [page - 2, page - 1, page + 1, page + 2].forEach(number => {
      if (number >= 1 && number <= totalPages) {
        const image = new Image();
        image.src = pageUrl(number);
      }
    });
  }

  function render() {
    if (isDesktop() && currentPage > 1) {
      const left = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      const right = left + 1;

      singleSlot.hidden = true;
      spread.hidden = false;
      leftPage.src = pageUrl(left);
      leftPage.alt = `Pagina ${left} van Milly en de Magische Stem`;

      if (right <= totalPages) {
        rightPage.src = pageUrl(right);
        rightPage.alt = `Pagina ${right} van Milly en de Magische Stem`;
        rightPage.style.visibility = 'visible';
      } else {
        rightPage.removeAttribute('src');
        rightPage.alt = '';
        rightPage.style.visibility = 'hidden';
      }

      pageLabel.textContent = right <= totalPages
        ? `Pagina's ${left}-${right} van ${totalPages}`
        : `Pagina ${left} van ${totalPages}`;
      pageSelect.value = String(left);
    } else {
      spread.hidden = true;
      singleSlot.hidden = false;
      singlePage.src = pageUrl(currentPage);
      singlePage.alt = `Pagina ${currentPage} van Milly en de Magische Stem`;
      pageLabel.textContent = `Pagina ${currentPage} van ${totalPages}`;
      pageSelect.value = String(currentPage);
    }

    prevButtons.forEach(button => { button.disabled = currentPage <= 1; });
    nextButtons.forEach(button => {
      button.disabled = isDesktop() ? currentPage >= totalPages - 1 : currentPage >= totalPages;
    });

    preloadAround(currentPage);
  }

  function animate(direction) {
    book.classList.remove('turn-next', 'turn-prev');
    void book.offsetWidth;
    book.classList.add(direction === 'next' ? 'turn-next' : 'turn-prev');
  }

  function nextPage() {
    if (isDesktop()) {
      if (currentPage === 1) currentPage = 2;
      else currentPage = Math.min(totalPages, (currentPage % 2 === 0 ? currentPage : currentPage - 1) + 2);
    } else {
      currentPage = Math.min(totalPages, currentPage + 1);
    }
    animate('next');
    render();
  }

  function prevPage() {
    if (isDesktop()) {
      if (currentPage <= 2) currentPage = 1;
      else currentPage = Math.max(2, (currentPage % 2 === 0 ? currentPage : currentPage - 1) - 2);
    } else {
      currentPage = Math.max(1, currentPage - 1);
    }
    animate('prev');
    render();
  }

  prevButtons.forEach(button => button.addEventListener('click', prevPage));
  nextButtons.forEach(button => button.addEventListener('click', nextPage));

  pageSelect.addEventListener('change', event => {
    currentPage = Number(event.target.value);
    render();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') nextPage();
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') prevPage();
  });

  book.addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  book.addEventListener('touchend', event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) nextPage();
    else prevPage();
  }, { passive: true });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      // Some mobile browsers do not support fullscreen mode.
    }
  });

  window.addEventListener('resize', render);
  render();
})();
