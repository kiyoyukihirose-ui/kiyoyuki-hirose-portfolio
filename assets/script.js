(() => {
  const menuButton = document.querySelector('.menu-btn');
  const navigation = document.querySelector('#nav');
  const closeMenu = () => {
    navigation?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'メニュー';
  };
  menuButton?.addEventListener('click', () => {
    const open = navigation?.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
    menuButton.textContent = open ? '閉じる' : 'メニュー';
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  document.querySelectorAll('[data-work-filters] [data-filter]').forEach(button => button.addEventListener('click', () => {
    const controls = button.closest('[data-work-filters]');
    controls.querySelectorAll('button').forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-category]').forEach(card => {
      card.classList.toggle('hidden', card.dataset.category !== button.dataset.filter);
    });
  }));

  document.querySelectorAll('[data-device]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-device]').forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    const mock = document.querySelector('#pageMock');
    mock?.classList.remove('pc', 'sp');
    mock?.classList.add(button.dataset.device);
    if (mock) mock.scrollTop = 0;
  }));

  const setupTabs = (buttons, panels, key) => {
    if (!buttons.length) return;
    buttons.forEach((button, index) => {
      const panel = panels.find(candidate => candidate.dataset[key.replace('View', 'Panel')] === button.dataset[key]);
      const tabId = `${key}-tab-${index}`;
      const panelId = `${key}-panel-${index}`;
      button.id = tabId;
      button.setAttribute('aria-controls', panelId);
      button.tabIndex = button.classList.contains('active') ? 0 : -1;
      if (panel) { panel.id = panelId; panel.setAttribute('aria-labelledby', tabId); }
    });
    const activate = next => {
      buttons.forEach(button => {
        const active = button === next;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.dataset[key.replace('View', 'Panel')] !== next.dataset[key]; });
      const previewStage = next.closest('.full-view')?.querySelector('.aria-view-stage');
      if (previewStage) previewStage.scrollTop = 0;
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', event => {
        let nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        activate(buttons[nextIndex]);
        buttons[nextIndex].focus();
      });
    });
  };
  setupTabs([...document.querySelectorAll('[data-aria-view]')], [...document.querySelectorAll('[data-aria-panel]')], 'ariaView');

  const abiesImage = document.querySelector('#abiesProjectImage');
  const abiesStage = document.querySelector('#abiesProjectStage');
  const abiesSelect = document.querySelector('[data-abies-select]');
  const abiesPages = [...document.querySelectorAll('[data-abies-page]')];
  const updateAbiesView = () => {
    const page = document.querySelector('[data-abies-page].active');
    const device = document.querySelector('[data-abies-device].active')?.dataset.abiesDevice || 'pc';
    if (!page || !abiesImage || !abiesStage) return;
    abiesImage.src = page.dataset[device];
    abiesImage.alt = `アビエス法律事務所 採用サイト ${page.dataset.label} ${device.toUpperCase()}版`;
    abiesStage.classList.remove('pc', 'sp');
    abiesStage.classList.add(device);
    abiesStage.scrollTop = 0;
    if (abiesSelect) abiesSelect.value = page.dataset.label;
  };
  const activateAbiesPage = page => {
    abiesPages.forEach(candidate => {
      const active = candidate === page;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
    });
    updateAbiesView();
  };
  abiesPages.forEach((button, index) => {
    button.tabIndex = button.classList.contains('active') ? 0 : -1;
    button.addEventListener('click', () => activateAbiesPage(button));
    button.addEventListener('keydown', event => {
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      const next = abiesPages[(index + direction + abiesPages.length) % abiesPages.length];
      activateAbiesPage(next);
      next.focus();
    });
  });
  abiesSelect?.addEventListener('change', () => {
    const page = abiesPages.find(candidate => candidate.dataset.label === abiesSelect.value);
    if (page) activateAbiesPage(page);
  });
  document.querySelectorAll('[data-abies-device]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-abies-device]').forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle('active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });
    updateAbiesView();
  }));

  let returnFocus = null;
  document.addEventListener('click', event => {
    const item = event.target.closest('.banner-item');
    if (!item) return;
    const modal = document.querySelector('.banner-modal');
    if (!modal) return;
    returnFocus = item;
    const visual = modal.querySelector('.modal-visual');
    const visualClass = [...item.classList].find(name => name.startsWith('visual-'));
    visual.className = `modal-visual${visualClass ? ` ${visualClass}` : ''}${item.classList.contains('variant-wide') ? ' is-wide' : ''}`;
    visual.innerHTML = item.innerHTML;
    modal.querySelector('h2').textContent = item.dataset.title;
    ['media', 'purpose', 'target', 'intent'].forEach(field => {
      modal.querySelector(`[data-field="${field}"]`).textContent = item.dataset[field];
    });
    modal.showModal();
  });
  document.addEventListener('click', event => {
    const modal = document.querySelector('.banner-modal');
    if (!modal?.open) return;
    if (event.target.closest('.modal-close') || event.target === modal) {
      modal.close();
      returnFocus?.focus();
    }
  });

  const scrollTopButton = document.createElement('button');
  scrollTopButton.className = 'scroll-top-button';
  scrollTopButton.type = 'button';
  scrollTopButton.setAttribute('aria-label', 'ページ最上部へ戻る');
  scrollTopButton.textContent = '↑ TOP';
  document.body.appendChild(scrollTopButton);
  const updateScrollTop = () => scrollTopButton.classList.toggle('visible', window.scrollY > 700);
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
  scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
})();
