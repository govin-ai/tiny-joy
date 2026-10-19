import {content} from './content.mjs';
import {search,nextItem,choose,randomInteger,countText} from './core.mjs';
import {createFavorites} from './storage.mjs';
const $=s=>document.querySelector(s),favorites=createFavorites(()=>localStorage,content.map(x=>x.id));
let view='home',filter='all',query='',timer;const featured={joke:'j1',fact:'f1'};
function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;}
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(timer);timer=setTimeout(()=>$('#toast').hidden=true,4500);}
function notice(){const el=$('#storage-notice');el.textContent=favorites.message;el.hidden=!favorites.message;$('#fav-count').textContent=favorites.ids.size;}
function card(item,isFeature=false){
 const el=node('article',`content-card ${item.type}`);el.dataset.id=item.id;
 const top=node('div','card-top'),kind=node('span','card-kind');kind.append(node('span','kind-icon',item.type==='joke'?'☺':'✧'),node('span','',item.type==='joke'?'笑话角 · 笑一下':'冷知识 · 涨点见识'));top.append(kind,node('span','card-index',`${item.type==='joke'?'J':'K'} / ${item.id.slice(1).padStart(2,'0')}`));
 const title=node('h3','',item.title),body=node('p','card-body',item.body),bottom=node('div','card-bottom'),left=node('div','card-actions');
 if(isFeature){const btn=node('button','shuffle','换一条 ↻');btn.type='button';btn.disabled=content.filter(x=>x.type===item.type).length<2;btn.setAttribute('aria-label',item.type==='joke'?'换一条笑话':'换一条冷知识');btn.onclick=()=>{featured[item.type]=nextItem(content.filter(x=>x.type===item.type),item.id).id;const replacement=card(content.find(x=>x.id===featured[item.type]),true);el.replaceWith(replacement);replacement.querySelector('.shuffle').focus();toast('已换一条');};left.append(btn);}else left.append(node('span','tag',item.tags[0]));
 const actions=node('div','card-actions'),fav=node('button','icon-button',favorites.ids.has(item.id)?'♥':'♡');fav.type='button';fav.setAttribute('aria-pressed',String(favorites.ids.has(item.id)));fav.setAttribute('aria-label',`${favorites.ids.has(item.id)?'取消收藏':'收藏'}：${item.title}`);
 fav.onclick=()=>{const removing=favorites.ids.has(item.id);toast(favorites.toggle(item.id));notice();if(view==='favorites'){renderCards();const remaining=$('#cards button');if(remaining)remaining.focus();else $('#search').focus();}else {fav.textContent=removing?'♡':'♥';fav.setAttribute('aria-pressed',String(!removing));fav.setAttribute('aria-label',`${removing?'收藏':'取消收藏'}：${item.title}`);}};
 const copy=node('button','icon-button','⧉');copy.type='button';copy.setAttribute('aria-label',`复制：${item.title}`);copy.onclick=async()=>{try{await navigator.clipboard.writeText(item.body);toast('已复制，分享一点小乐趣吧。');}catch{toast('复制失败，请手动选择正文复制。');}};
 actions.append(copy,fav);bottom.append(left,actions);el.append(top,title,body);if(item.url){const source=node('a','source',`来源：${item.source} ↗`);source.href=item.url;source.target='_blank';source.rel='noopener noreferrer';el.append(source);}el.append(bottom);return el;
}
function renderCards(){let items;const isFeature=view==='home'&&!query.trim()&&filter==='all';if(isFeature)items=['joke','fact'].map(t=>content.find(x=>x.id===featured[t]));else {let base=view==='favorites'?content.filter(x=>favorites.ids.has(x.id)):content;const type=view==='jokes'?'joke':view==='facts'?'fact':filter;items=search(base,query,type);}
 $('#cards').replaceChildren(...items.map(x=>card(x,isFeature)));$('#empty').hidden=items.length>0;$('#empty').textContent=view==='favorites'&&!query&&!favorites.ids.size?'还没有收藏。点内容卡片上的爱心，把小乐趣留下来。':'没有找到匹配内容，试试换个关键词。';
}
function renderView(){const route=location.hash.slice(1);view=['home','jokes','facts','tools','favorites'].includes(route)?route:'home';document.body.dataset.view=view;document.querySelectorAll('[data-nav]').forEach(el=>{if(el.dataset.nav===view)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});$('#hero').hidden=view!=='home';$('#discovery').hidden=view==='tools';$('#tool-section').hidden=!['home','tools'].includes(view);$('#filters').hidden=['jokes','facts'].includes(view);$('#section-title').textContent=({home:'今天，想找点什么乐子？',jokes:'笑一笑，今天没什么大不了。',facts:'世界比想象中更有趣。',favorites:'喜欢的乐趣，慢慢攒。'})[view]||'';renderCards();}
window.addEventListener('hashchange',()=>{renderView();window.scrollTo({top:0});});
$('#search').addEventListener('input',e=>{query=e.target.value;renderCards();});
document.querySelectorAll('[data-filter]').forEach(btn=>btn.onclick=()=>{filter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));renderCards();});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(view==='tools'){location.hash='home';renderView();}$('#search').focus();}});
function result(selector,fn){const output=$(selector);try{output.textContent=fn();output.classList.remove('error');}catch(err){output.textContent=err.message;output.classList.add('error');}}
$('#choose-form').onsubmit=e=>{e.preventDefault();result('#choose-result',()=>`就选：${choose($('#choices').value)}`);};
$('#number-form').onsubmit=e=>{e.preventDefault();result('#number-result',()=>`这次是：${randomInteger($('#minimum').value,$('#maximum').value)}`);};
function updateStats(){const target=$('#text-result');try{const stats=countText($('#text-input').value);target.classList.remove('error');target.replaceChildren(...[['count','字符'],['clean','去空白'],['lines','行']].map(([key,label])=>{const span=node('span','stat');span.append(node('strong','',stats[key].toLocaleString()),node('span','',label));return span;}));}catch(err){target.classList.add('error');target.textContent=err.message;}}
$('#text-input').addEventListener('input',updateStats);updateStats();notice();renderView();
document.querySelectorAll('a[href="#home"]').forEach(link=>link.addEventListener('click',()=>{if(location.hash==='#home')window.scrollTo({top:0});}));
