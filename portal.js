// 業界ポータル共通エンジン。業界ごとの中身は site.js(設定・文言)と data.js(データ)に置く。
const UI={
 tBrands:{ja:'ブランド',zh:'品牌',en:'Brands',ko:'브랜드'},
 tShops:{ja:'お店',zh:'门店',en:'Shops',ko:'매장'},
 tNews:{ja:'新作',zh:'新品',en:'New',ko:'신작'},
 search:{ja:'ブランド名・店名で検索',zh:'按品牌名・店名搜索',en:'Search brands or shops',ko:'브랜드·매장명 검색'},
 all:{ja:'すべて',zh:'全部',en:'All',ko:'전체'},
 items:{ja:'件',zh:'条',en:' items',ko:'건'},
 shopsCol:{ja:'国内店舗',zh:'国内门店',en:'Stores',ko:'국내 매장'},
 featCol:{ja:'特徴',zh:'特点',en:'Notes',ko:'특징'},
 typeCol:{ja:'種別',zh:'类型',en:'Type',ko:'종류'},
 dateCol:{ja:'発売日',zh:'发售日',en:'Date',ko:'출시일'},
 src:{ja:'出典',zh:'出处',en:'Source',ko:'출처'},
 verify:{ja:'要確認',zh:'待确认',en:'unverified',ko:'확인 필요'},
 maker:{ja:'メーカー',zh:'厂商',en:'Maker',ko:'제조사'},
 whereBuy:{ja:'買える場所',zh:'购买渠道',en:'Where to buy',ko:'구입처'},
 newOf:{ja:'このブランドの新作',zh:'该品牌新品',en:'New from this brand',ko:'이 브랜드의 신작'},
 official:{ja:'公式サイト',zh:'官网',en:'Official site',ko:'공식 사이트'},
 stores:{ja:'店舗',zh:'家门店',en:' stores',ko:'개 매장'},
 hFind:{ja:'さがす',zh:'按类别找',en:'BROWSE',ko:'찾기'},
 hPick:{ja:'PICK UP 新作',zh:'PICK UP 新品',en:'PICK UP',ko:'PICK UP 신작'},
 hBrand:{ja:'ブランドからさがす',zh:'按品牌找',en:'BY BRAND',ko:'브랜드로 찾기'},
 hShop:{ja:'お店をさがす',zh:'找门店',en:'FIND A SHOP',ko:'매장 찾기'},
 more:{ja:'すべて見る',zh:'查看全部',en:'See all',ko:'전체 보기'},
 hFacts:{ja:'知っておきたいこと',zh:'基础知识',en:'GOOD TO KNOW',ko:'알아두면 좋은 것'},
 brandsN:{ja:'ブランド',zh:'个品牌',en:' brands',ko:'개 브랜드'},
};
const LN={ja:'日本語',zh:'中文',en:'EN',ko:'한국어'};
let L=SITE.langs[0],sec='home',tab='brands',q='',f={};
try{L=localStorage.getItem(SITE.id+'L')||L}catch(e){}
const t=k=>(SITE.text[k]||UI[k]||{})[L]||k, v=t;
const yen=p=>p?'¥'.repeat(p):'';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const link=(n,u)=>u?`<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`:esc(n);
const dot=k=>`<span class="dot" style="background:${SITE.dots[k]||'#111'}"></span>`;
const match=n=>!q||n.toLowerCase().includes(q.toLowerCase());
const S=id=>SITE.sections.find(s=>s.id===id);
const uniq=a=>a.filter((x,i)=>a.indexOf(x)===i);
const of=(kind,s)=>DATA[kind].filter(o=>o.sec===s);

function chips(key,opts,lab){
 const cur=f[key]||'';
 return `<div class="chips">${['',...opts].map(o=>`<button class="${cur===o?'on':''}" onclick="f['${key}']='${o}';render()">${o?(lab?lab(o):v(o)):t('all')}</button>`).join('')}</div>`;
}
function bar(key,opts){return `<div class="bar"><input type="search" placeholder="${t('search')}" value="${esc(q)}" oninput="q=this.value;render(true)">${opts.length>1?chips(key,opts):''}</div>`}

function brands(cf){
 const all=of('brands',sec), rows=all.filter(b=>match(b.n)&&(!f.t||b.t===f.t)&&(!f.p||b.p==f.p));
 return `<p class="lead">${t(cf.lead)}</p>${bar('t',cf.filters||uniq(all.map(b=>b.t)))}
 ${cf.price?`<div class="bar">${chips('p',['1','2','3','4'],o=>yen(+o))}</div>`:''}
 <p class="count">${rows.length}${t('items')}</p>
 <div class="grid">${rows.map(b=>`<div class="card click" onclick="openB(${DATA.brands.indexOf(b)})"><h3>${esc(b.n)}</h3>
 <div class="meta">${dot(b.t)}${v(b.t)}${b.c?' · '+b.c:''} ${yen(b.p)}${b.m?' · '+esc(b.m):''}</div>
 ${b.w?`<div class="meta">${b.w.map(v).join(' / ')}</div>`:''}</div>`).join('')}</div>`;
}
function shops(cf){
 const all=of('shops',sec), types=uniq(all.map(s=>s.t)), rows=all.filter(s=>match(s.n)&&(!f.t||s.t===f.t));
 return `<p class="lead">${t(cf.lead)}</p>${bar('t',types)}
 <p class="count">${rows.length}${t('items')}</p>
 <table><tr><th></th><th>${t('typeCol')}</th><th>${t('shopsCol')}</th><th class="hide-sm">${t('featCol')}</th></tr>
 ${rows.map(s=>`<tr><td><b>${link(s.n,s.u)}</b></td><td>${v(s.t)}</td><td>${s.s}</td><td class="hide-sm">${s.f?v('f_'+s.f):''}</td></tr>`).join('')}</table>`;
}
function newsRow(n){return `<tr><td style="white-space:nowrap">${n.d}</td><td><b>${esc(n.b)}</b><br><span class="meta">${dot(n.k)}${v(n.k)}</span></td>
 <td>${esc(n.x[L])}${n.v?`<span class="tag">${t('verify')}</span>`:''} <a class="meta" href="${n.s}" target="_blank" rel="noopener">${t('src')}</a></td></tr>`}
function news(cf){
 const all=of('news',sec), kinds=cf.kinds||uniq(all.map(n=>n.k)), rows=all.filter(n=>match(n.b)&&(!f.k||n.k===f.k)).sort((a,b)=>b.d.localeCompare(a.d));
 return `<p class="lead">${t(cf.lead)}</p>${bar('k',kinds)}
 <table><tr><th>${t('dateCol')}</th><th></th><th></th></tr>${rows.map(newsRow).join('')}</table>`;
}
const PAGES={brands,shops,news};

function openB(i){
 const b=DATA.brands[i], cf=S(b.sec).brands, base=b.n.split(/[ (/（]/)[0].toLowerCase();
 const nw=DATA.news.filter(n=>n.b.toLowerCase().startsWith(base)||b.n.toLowerCase().includes(n.b.toLowerCase()));
 let where;
 if(b.w){
  const own=DATA.shops.find(s=>{const sn=s.n.toLowerCase();return sn.startsWith(base)||base.startsWith(sn.split(/[ (（]/)[0])});
  where=b.w.map(w=>`<li>${v(w)}${w==='own'&&own?' — '+link(own.n,own.u)+' · '+own.s.replace(/ \(.*\)/,'')+t('stores'):''}</li>`).join('');
 }else{
  where=of('shops',b.sec).filter(s=>!s.only||s.only.includes(b.t)).map(s=>`<li>${link(s.n,s.u)} <span class="meta">${v(s.t)}</span></li>`).join('');
 }
 document.getElementById('dlg').innerHTML=`<div class="dlg"><button class="x" onclick="dlg.close()">×</button>
 <h2>${esc(b.n)}</h2><div class="meta">${dot(b.t)}${v(b.t)}${b.c?' · '+b.c:''} ${yen(b.p)}${b.m?' · '+esc(b.m):''}</div>
 ${cf.note?`<p class="note">${t(cf.note)}</p>`:''}
 <h4>${t('whereBuy')}</h4><ul>${where}</ul>
 ${nw.length?`<h4>${t('newOf')}</h4><ul>${nw.map(n=>`<li><span class="meta">${n.d}</span> ${esc(n.x[L])} <a class="meta" href="${n.s}" target="_blank" rel="noopener">${t('src')}</a></li>`).join('')}</ul>`:''}
 <div class="btns">${b.u?`<a class="btn" href="${b.u}" target="_blank" rel="noopener">${t('official')} ↗</a>`:''}<button class="btn pri" disabled>${t('buyHere')}</button></div></div>`;
 document.getElementById('dlg').showModal();
}

function home(){
 const cnt=(s,tb,ff)=>of(tb,s).filter(o=>!ff.t||o.t===ff.t).length;
 const latest=[...DATA.news].sort((a,b)=>b.d.localeCompare(a.d)).slice(0,6);
 const top=DATA.shops.filter(s=>/^[0-9,約]/.test(s.s)).slice(0,8);
 const feat=(SITE.home.featured||[]).map(n=>DATA.brands.findIndex(b=>b.n===n)).filter(i=>i>=0);
 return `<div class="home"><div class="hero"><h2>${t('heroT')}</h2><p>${t('heroS')}</p>
 <div class="hs"><input type="search" placeholder="${t('search')}" onkeydown="if(event.key==='Enter'){const x=this.value;go(SITE.sections[0].id,'brands');q=x;render()}"></div></div>
 <h3 class="sh">${t('hFind')}</h3><div class="cats">${SITE.home.cats.map(([k,s,tb,ff])=>`<button class="cat" onclick='go("${s}","${tb}",${JSON.stringify(ff)})'><b>${t(k)}</b><span>${cnt(s,tb,ff)}${tb==='brands'?t('brandsN'):t('items')}</span></button>`).join('')}</div>
 <h3 class="sh">${t('hPick')}<a onclick="go(SITE.sections[0].id,'news')">${t('more')}</a></h3>
 <div class="pick">${latest.map(n=>`<div class="card"><div class="meta">${n.d} · ${dot(n.k)}${v(n.k)}</div><h3>${esc(n.b)}</h3><div class="meta">${esc(n.x[L])} <a href="${n.s}" target="_blank" rel="noopener">${t('src')}</a></div></div>`).join('')}</div>
 <h3 class="sh">${t('hBrand')}<a onclick="go(SITE.sections[0].id,'brands')">${t('more')}</a></h3>
 <div class="bchips">${feat.map(i=>`<button onclick="openB(${i})">${esc(DATA.brands[i].n)}</button>`).join('')}</div>
 ${DATA.facts?`<h3 class="sh">${t('hFacts')}</h3><ul class="facts">${DATA.facts.map(x=>`<li>${esc(x.x[L])} <a class="meta" href="${x.s}" target="_blank" rel="noopener">${t('src')}</a></li>`).join('')}</ul>`:''}
 <h3 class="sh">${t('hShop')}<a onclick="go(SITE.sections[0].id,'shops')">${t('more')}</a></h3>
 <table>${top.map(s=>`<tr><td><b>${link(s.n,s.u)}</b></td><td class="meta">${v(s.t)}</td><td>${s.s}</td></tr>`).join('')}</table></div>`;
}

const TABS=[['brands','tBrands'],['shops','tShops'],['news','tNews']];
function go(s,tb,ff){sec=s;tab=tb;q='';f=ff||{};try{history.replaceState(null,'','#'+s+'/'+tb)}catch(e){}render()}
function render(keepFocus){
 document.documentElement.lang=L;
 document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
 document.getElementById('lang').innerHTML=SITE.langs.map(l=>`<button class="${l===L?'on':''}" onclick="setL('${l}')">${LN[l]}</button>`).join(' ');
 document.getElementById('sec').innerHTML=SITE.sections.map(s=>`<button class="${s.id===sec?'on':''}" onclick="go('${s.id}',tab)">${t(s.name)}</button>`).join('');
 document.getElementById('tabs').innerHTML=sec==='home'?'':TABS.filter(([k])=>S(sec)[k]).map(([k,n])=>`<button class="${k===tab?'on':''}" onclick="go(sec,'${k}')">${t(n)}</button>`).join('');
 const m=document.getElementById('main'); m.innerHTML=sec==='home'?home():PAGES[tab](S(sec)[tab]);
 if(keepFocus){const i=m.querySelector('input');if(i){i.focus();i.setSelectionRange(q.length,q.length)}}
}
function setL(l){L=l;try{localStorage.setItem(SITE.id+'L',l)}catch(e){}render()}
{const h=location.hash.slice(1).split('/');if(S(h[0])){sec=h[0];if(S(sec)[h[1]])tab=h[1]}}
render();
