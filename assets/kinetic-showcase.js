(() => {
  const collections = {
    lp: [
      { image: 'assets/images/thumbs/apple-gift-top.webp', title: '即日アリアちゃん', meta: 'LP / 2025', scope: 'STRUCTURE / DESIGN / PC・SP', href: 'project.html' },
      { image: 'assets/images/thumbs/aria-recruit-top.webp', title: 'Aria Global Recruitment', meta: 'RECRUITMENT LP / 2025', scope: 'STRUCTURE / DESIGN / JP・EN', href: 'project-aria.html' },
      { image: 'assets/images/thumbs/abies-careers-top.webp', title: 'Abies Recruitment', meta: 'RECRUITMENT WEBSITE / 2025', scope: 'STRUCTURE / DESIGN / PC・SP', href: 'project-abies.html' },
      { image: 'assets/images/thumbs/factoring-top.webp', title: 'Factoring Recruitment', meta: 'RECRUITMENT LP / 2025', scope: 'STRUCTURE / DESIGN / SP', href: 'project-factoring.html' },
      { image: 'assets/images/thumbs/apple-ranking-top.webp', title: 'Apple Gift Comparison', meta: 'COMPARISON LP / 2025', scope: 'STRUCTURE / DESIGN / PC・SP', href: 'project-ranking.html' },
      { image: 'assets/images/thumbs/apple-speed-top.webp', title: 'Speed Purchase', meta: 'SERVICE LP / 2025', scope: 'STRUCTURE / DESIGN / SP', href: 'project-apple-speed.html' }
    ],
    banner: [
      { image: 'assets/images/thumbs/banner-law.webp', source: 'assets/images/law-office-banner.png', title: '債務整理キャンペーン', meta: 'BANNER / 2025', scope: 'SNS AD / SQUARE' },
      { image: 'assets/images/thumbs/banner-aria.webp', source: 'assets/images/aria-hiring-square.png', title: 'ARIA BI Consultant', meta: 'BANNER / 2025', scope: 'RECRUITMENT / SQUARE' },
      { image: 'assets/images/thumbs/banner-accounting.webp', source: 'assets/images/abies-accounting-recruit.png', title: '経理スタッフ採用', meta: 'BANNER / 2025', scope: 'RECRUITMENT / SQUARE' },
      { image: 'assets/images/thumbs/banner-consult.webp', source: 'assets/images/m2o-consult-square.png', title: '相談への第一歩', meta: 'BANNER / 2025', scope: 'AWARENESS / SQUARE' }
    ],
    other: [
      { image: 'assets/images/other-monogram.svg', title: 'Logo / Other', meta: 'OTHER / 2022', scope: 'GRAPHIC / IDENTITY', href: '#works' }
    ]
  };

  const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);

  document.querySelectorAll('[data-kinetic-showcase]').forEach(showcase => {
    showcase.innerHTML = '<div class="kinetic-stage" aria-label="制作実績カルーセル"></div><p class="kinetic-help">左右にスワイプ、または矢印キーで切り替え</p>';
    showcase.tabIndex = 0;
    const stage = showcase.querySelector('.kinetic-stage');
    let category = 'lp';
    let items = collections.lp;
    let cards = [];
    let current = 0;
    let startX = 0;
    let startY = 0;
    let dragX = 0;
    let dragging = false;
    let horizontal = false;
    let suppressClick = false;

    const distanceFor = (index, length) => {
      let distance = index - current;
      if (distance > length / 2) distance -= length;
      if (distance < -(length / 2)) distance += length;
      return distance;
    };

    const positionCards = () => {
      cards.forEach((card, index) => {
        const distance = distanceFor(index, cards.length);
        const slot = Math.max(-3, Math.min(3, distance));
        const isCentral = distance === 0;
        card.dataset.slot = String(slot);
        card.classList.toggle('is-central', isCentral);
        card.setAttribute('aria-hidden', Math.abs(distance) > 2 ? 'true' : 'false');
        const button = card.querySelector('button');
        button.tabIndex = isCentral ? 0 : -1;
        button.setAttribute('aria-label', isCentral ? `${items[index].title}の詳細を見る` : `${items[index].title}を中央に表示`);
      });
    };

    const goTo = next => {
      current = (next + cards.length) % cards.length;
      positionCards();
    };

    const openItem = async (item, index) => {
      if (index !== current) {
        goTo(index);
        return;
      }
      if (category === 'banner') {
        window.ensureBannerCollection?.();
        await new Promise(resolve => requestAnimationFrame(resolve));
        const banner = [...document.querySelectorAll('.banner-item')].find(candidate => candidate.querySelector('img')?.getAttribute('src') === item.source);
        banner?.click();
        return;
      }
      if (item.href) window.location.href = item.href;
    };

    const render = nextCategory => {
      category = collections[nextCategory] ? nextCategory : 'lp';
      items = collections[category];
      current = 0;
      showcase.dataset.category = category;
      stage.innerHTML = items.map((item, index) => `
        <article class="kinetic-carousel-card" data-index="${index}" data-slot="3" aria-hidden="true">
          <button class="kinetic-card-image" type="button">
            <img src="${escapeHtml(item.image)}" width="900" height="1125" alt="${escapeHtml(item.title)} サムネイル" draggable="false" decoding="async">
            <span class="kinetic-card-caption"><small>${escapeHtml(item.meta)}</small><strong>${escapeHtml(item.title)}</strong><em>${escapeHtml(item.scope)}</em></span>
          </button>
        </article>`).join('');
      cards = [...stage.querySelectorAll('.kinetic-carousel-card')];
      cards.forEach((card, index) => card.querySelector('button').addEventListener('click', event => {
        if (suppressClick) {
          event.preventDefault();
          return;
        }
        openItem(items[index], index);
      }));
      positionCards();
      requestAnimationFrame(() => showcase.classList.add('is-ready'));
    };

    const finishDrag = event => {
      if (!dragging) return;
      dragging = false;
      showcase.classList.remove('is-dragging');
      showcase.style.setProperty('--drag-x', '0px');
      if (horizontal && Math.abs(dragX) > 45) {
        suppressClick = true;
        goTo(current + (dragX < 0 ? 1 : -1));
        setTimeout(() => { suppressClick = false; }, 0);
      }
      horizontal = false;
      dragX = 0;
      try { stage.releasePointerCapture(event.pointerId); } catch (_) { /* no-op */ }
    };

    stage.addEventListener('pointerdown', event => {
      if (cards.length < 2) return;
      dragging = true;
      horizontal = false;
      startX = event.clientX;
      startY = event.clientY;
      dragX = 0;
      showcase.classList.add('is-dragging');
      stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', event => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!horizontal && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) horizontal = true;
      if (!horizontal) return;
      dragX = Math.max(-180, Math.min(180, dx));
      showcase.style.setProperty('--drag-x', `${dragX}px`);
    });
    stage.addEventListener('pointerup', finishDrag);
    stage.addEventListener('pointercancel', finishDrag);
    showcase.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
    });

    document.querySelectorAll('[data-showcase-filter]').forEach(tab => tab.addEventListener('click', () => {
      document.querySelectorAll('[data-showcase-filter]').forEach(candidate => {
        const active = candidate === tab;
        candidate.classList.toggle('active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      render(tab.dataset.showcaseFilter);
    }));

    render('lp');
  });
})();
