(() => {
  const roots = [...document.querySelectorAll('[data-inline-banner-collection]')];
  if (!roots.length) return;

  const projects = [
    { title: 'Aria — BIコンサルタント採用', meta: '採用広告 / 2サイズ / 2025', purpose: '外国人BIコンサルタントの採用', target: '日本でのキャリアを検討する外国人材', items: [['aria-hiring-square.png', 'variant-square', 'Square'], ['aria-hiring-portrait.png', 'variant-portrait', 'Portrait']] },
    { title: 'アビエス法律事務所 — 経理スタッフ採用', meta: '採用広告 / 正方形 / 2025', purpose: '経理スタッフの応募獲得', target: '会計・税理士事務所での経験がある方', items: [['abies-accounting-recruit.png', 'variant-square', 'Square']] },
    { title: 'M2O法律事務所 — 相談への第一歩', meta: '認知広告 / 4点 / 2025', purpose: '法律相談への心理的ハードル低減', target: '悩みを抱えながら相談を迷っている方', items: [['m2o-consult-square.png', 'variant-square', 'Square', 'crop-frame'], ['m2o-first-step-photo-square.png', 'variant-square', 'Square'], ['m2o-consult-wide.png', 'variant-wide', 'Wide', 'crop-frame'], ['m2o-first-step-photo-wide.png', 'variant-wide', 'Wide']] },
    { title: 'M2O法律事務所 — お金の専門家', meta: '認知広告 / 4点 / 2025', purpose: '法律事務所の認知向上', target: '金銭問題の相談先を探している方', items: [['m2o-manga-square.png', 'variant-square', 'Square', 'crop-frame'], ['m2o-money-square.png', 'variant-square', 'Square', 'crop-frame'], ['m2o-manga-wide.png', 'variant-wide', 'Wide', 'crop-frame'], ['m2o-money-wide.png', 'variant-wide', 'Wide', 'crop-frame']] },
    { title: 'アビエス法律事務所 — 司法書士採用', meta: '採用広告 / 正方形 / 2025', purpose: '司法書士有資格者の採用', target: '転職を検討する司法書士有資格者', items: [['abies-legal-recruit.png', 'variant-square', 'Square', 'crop-frame']] },
    { title: 'アビエス法律事務所 — 債務整理キャンペーン', meta: '相談獲得広告 / 13点 / 2025', purpose: '債務整理相談への誘導', target: '借金問題の相談先を探している方', items: [['law-office-banner.png', 'variant-square', 'Square', 'crop-frame'], ['abies-debt-orange.png', 'variant-square', 'Square', 'crop-frame'], ['abies-debt-marriage.png', 'variant-square', 'Square', 'crop-frame'], ['abies-debt-lowest.png', 'variant-square', 'Square', 'crop-frame'], ['abies-debt-progress.png', 'variant-square', 'Square'], ['abies-debt-reduction.png', 'variant-square', 'Square'], ['abies-debt-interest.png', 'variant-square', 'Square'], ['abies-overpayment-note.png', 'variant-square', 'Square'], ['abies-overpayment-money.png', 'variant-square', 'Square'], ['abies-debt-statue-square.png', 'variant-square', 'Square'], ['abies-debt-yellow-square.png', 'variant-square', 'Square'], ['abies-debt-statue-portrait.png', 'variant-portrait', 'Portrait'], ['abies-debt-yellow-portrait.png', 'variant-portrait', 'Portrait']] }
  ];
  let rendered = false;

  const ensureModal = () => {
    if (document.querySelector('.banner-modal')) return;
    document.body.insertAdjacentHTML('beforeend', '<dialog class="banner-modal" aria-labelledby="banner-modal-title"><button class="modal-close" type="button" aria-label="詳細を閉じる">閉じる ×</button><div class="modal-visual"></div><div class="modal-copy"><p class="eyebrow">制作詳細 / CAMPAIGN DETAIL</p><h2 id="banner-modal-title"></h2><dl><div><dt>媒体</dt><dd data-field="media"></dd></div><div><dt>目的</dt><dd data-field="purpose"></dd></div><div><dt>ターゲット</dt><dd data-field="target"></dd></div><div><dt>デザイン意図</dt><dd data-field="intent"></dd></div></dl></div></dialog>');
  };

  const render = () => {
    if (rendered) return;
    const markup = `<div class="banner-collection-intro"><p class="eyebrow">BANNER COLLECTION / 25</p><h2>広告媒体と比率に合わせた<br>クリエイティブ展開。</h2><p>採用・法律相談を中心に、訴求の優先順位を調整した広告バナーを案件ごとにまとめています。</p></div><div class="banner-projects">${projects.map((project, index) => `<section class="banner-project"><header class="banner-project-head"><div><p class="eyebrow">PROJECT / ${String(index + 1).padStart(2, '0')}</p><h2>${project.title}</h2></div><p>${project.meta}</p></header><div class="variant-grid ${project.items.length === 1 ? 'variants-feature' : project.items.length <= 4 ? 'variants-2' : 'variants-4'}">${project.items.map((item, itemIndex) => `<button class="banner-item ${item[1]} ${item[3] || ''}" type="button" data-title="${project.title}" data-media="${item[2]}広告" data-purpose="${project.purpose}" data-target="${project.target}" data-intent="媒体比率に合わせてコピーとビジュアルの優先順位を調整し、短時間で訴求内容が伝わる構成にしました。"><img src="assets/images/${item[0]}" loading="lazy" decoding="async" alt="${project.title} ${itemIndex + 1}"></button>`).join('')}</div></section>`).join('')}</div>`;
    roots.forEach(root => { root.innerHTML = markup; });
    ensureModal();
    rendered = true;
  };

  window.ensureBannerCollection = render;

  const workGrid = document.querySelector('.work-grid');
  const bannerTab = document.querySelector('[data-show-banner]');
  const categoryTabs = [...document.querySelectorAll('[data-work-filters] [data-filter]')];

  bannerTab?.addEventListener('click', () => {
    render();
    [...categoryTabs, bannerTab].forEach(tab => {
      const active = tab === bannerTab;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    if (workGrid) workGrid.hidden = true;
    roots.forEach(root => { root.hidden = false; });
  });

  categoryTabs.forEach(tab => tab.addEventListener('click', () => {
    bannerTab?.classList.remove('active');
    bannerTab?.setAttribute('aria-pressed', 'false');
    if (workGrid) workGrid.hidden = false;
    roots.forEach(root => { root.hidden = true; });
  }));
})();
