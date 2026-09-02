(() => {
  const collections={
    lp:[
      ['assets/images/apple-gift-lp-pc.png','即日アリアちゃん','LP / 2025','project.html'],
      ['assets/images/aria-recruit-en.png','ARIA Global Recruitment','LP / 2025','project-aria.html'],
      ['assets/images/abies-careers-top-pc.png','Abies Recruitment','LP / 2025','project-abies.html'],
      ['assets/images/aria-factoring-sp.png','Factoring Recruitment','LP / 2025','project-factoring.html'],
      ['assets/images/apple-ranking-pc.png','Apple Gift Comparison','LP / 2025','project-ranking.html'],
      ['assets/images/apple-speed-sp.png','Speed Purchase','LP / 2025','project-apple-speed.html']
    ],
    banner:[
      ['assets/images/law-office-banner.png','債務整理キャンペーン','BANNER / 2025',null],
      ['assets/images/aria-hiring-square.png','ARIA BI Consultant','BANNER / 2025',null],
      ['assets/images/abies-accounting-recruit.png','経理スタッフ採用','BANNER / 2025',null],
      ['assets/images/m2o-consult-square.png','相談への第一歩','BANNER / 2025',null],
      ['assets/images/m2o-first-step-photo-square.png','相談への第一歩 — Photo','BANNER / 2025',null],
      ['assets/images/m2o-manga-square.png','お金の専門家 — Manga','BANNER / 2025',null],
      ['assets/images/m2o-money-square.png','お金の専門家','BANNER / 2025',null],
      ['assets/images/abies-debt-interest.png','債務整理 — Interest','BANNER / 2025',null]
    ],
    other:[['assets/images/other-monogram.svg','Logo / Other','OTHER / 2022','index.html#about']]
  };
  const cardMarkup=(item,index)=>`<article class="kinetic-carousel-card" data-kinetic-card data-index="${index}" data-slot="3" aria-hidden="true"><button class="kinetic-card-image" type="button" data-kinetic-select="${index}" aria-label="${item[1]}の詳細を見る"><img src="${item[0]}" alt="${item[1]} サムネイル" draggable="false"></button><div class="kinetic-card-caption"><small>${item[2]}</small><strong>${item[1]}</strong></div></article>`;

  document.querySelectorAll('[data-kinetic-showcase]').forEach(showcase=>{
    document.querySelector('[data-inline-banner-collection]')?.setAttribute('id','banner-collection');
    showcase.innerHTML='<div class="kinetic-stage" aria-live="polite"></div>';
    showcase.tabIndex=0;
    showcase.setAttribute('aria-label','制作実績カルーセル。左右にスワイプして切り替えられます');
    const stage=showcase.querySelector('.kinetic-stage');
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cards=[],current=0,timer,startX=0,startY=0,dragX=0,dragging=false,horizontal=false,suppressClick=false;
    const stop=()=>{window.clearInterval(timer);timer=undefined};
    const distanceFor=(index,length)=>{let distance=index-current;if(distance>length/2)distance-=length;if(distance<-(length/2))distance+=length;return distance};
    const positionCards=()=>{const length=cards.length;cards.forEach((card,index)=>{const distance=distanceFor(index,length),slot=Math.max(-3,Math.min(3,distance)),visible=Math.abs(distance)<=2;card.dataset.slot=String(slot);card.setAttribute('aria-hidden',visible?'false':'true');card.querySelector('[data-kinetic-select]').tabIndex=visible?0:-1})};
    const goTo=next=>{if(!cards.length)return;current=(next+cards.length)%cards.length;positionCards()};
    const start=()=>{stop();if(!reduceMotion&&cards.length>1)timer=window.setInterval(()=>goTo(current+1),4200)};
    const render=nextCategory=>{const category=collections[nextCategory]?nextCategory:'lp',items=collections[category];stop();current=0;showcase.dataset.category=category;stage.innerHTML=items.map(cardMarkup).join('');cards=[...stage.querySelectorAll('[data-kinetic-card]')];cards.forEach(card=>card.querySelector('[data-kinetic-select]').addEventListener('click',event=>{if(suppressClick){event.preventDefault();return}const item=items[Number(card.dataset.index)];if(category==='banner'){const source=card.querySelector('img')?.getAttribute('src');const bannerItem=[...document.querySelectorAll('.banner-item')].find(candidate=>candidate.querySelector('img')?.getAttribute('src')===source);if(bannerItem){stop();bannerItem.click()}return}if(item?.[3]){stop();window.location.href=item[3]}}));positionCards();requestAnimationFrame(()=>showcase.classList.add('is-ready'));start()};

    const finishDrag=event=>{if(!dragging)return;dragging=false;showcase.classList.remove('is-dragging');showcase.style.setProperty('--drag-x','0px');if(horizontal&&Math.abs(dragX)>48){suppressClick=true;goTo(current+(dragX<0?1:-1));window.setTimeout(()=>{suppressClick=false},0)}horizontal=false;dragX=0;start();try{stage.releasePointerCapture(event.pointerId)}catch{}};
    stage.addEventListener('pointerdown',event=>{if(cards.length<2)return;dragging=true;horizontal=false;startX=event.clientX;startY=event.clientY;dragX=0;stop();showcase.classList.add('is-dragging');stage.setPointerCapture(event.pointerId)});
    stage.addEventListener('pointermove',event=>{if(!dragging)return;const dx=event.clientX-startX,dy=event.clientY-startY;if(!horizontal&&Math.abs(dx)>7&&Math.abs(dx)>Math.abs(dy))horizontal=true;if(!horizontal)return;dragX=Math.max(-180,Math.min(180,dx));showcase.style.setProperty('--drag-x',`${dragX}px`)});
    stage.addEventListener('pointerup',finishDrag);stage.addEventListener('pointercancel',finishDrag);
    showcase.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation()}},true);
    showcase.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();goTo(current-1);start()}if(event.key==='ArrowRight'){event.preventDefault();goTo(current+1);start()}});
    document.querySelectorAll('.filters [data-filter]').forEach(tab=>tab.addEventListener('click',()=>render(tab.dataset.filter)));
    document.querySelector('[data-show-banner]')?.addEventListener('click',()=>render('banner'));
    showcase.addEventListener('mouseenter',stop);showcase.addEventListener('mouseleave',()=>{if(!dragging)start()});showcase.addEventListener('focusin',stop);showcase.addEventListener('focusout',event=>{if(!showcase.contains(event.relatedTarget)&&!dragging)start()});
    const activeFilter=document.querySelector('.filters .active');render(activeFilter?.dataset.filter||'lp');
    if(!activeFilter){const lpTab=document.querySelector('.filters [data-filter="lp"]');lpTab?.classList.add('active');document.querySelectorAll('[data-category]').forEach(card=>card.classList.toggle('hidden',card.dataset.category!=='lp'))}
  });
})();
