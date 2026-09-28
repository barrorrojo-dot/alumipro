/* m18.js — Estabiliza Ajustes: neutraliza intervalos conflictivos de m16/m17 e inicializa una sola vez */
(function(){
/* === Neutralizar funciones de m16/m17 para que sus intervals no hagan nada === */
window.brandToggle=function(){};
window.recEditor=function(){};
window.brandTop=function(){};
window.killRec=function(){};
window.moverInventario=function(){};
window.fixIcons=function(){};

/* === Flags de inicialización única === */
var brandDone=false, navDone=false, iconsDone=false, ajtDone=false;

/* === Inicialización de Ajustes (una sola vez) === */
function initAjt(){
 var aj=document.getElementById('ajt');
 if(!aj||!aj.classList.contains('active'))return;
 if(ajtDone)return;
 ajtDone=true;

 /* 1) Branding como primera tarjeta (una sola vez) */
 if(!brandDone&&!document.getElementById('brandCard')){
  var c=document.createElement('div');c.className='card';c.id='brandCard';
  c.innerHTML='<h3> Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
  aj.insertBefore(c,aj.firstElementChild);
  brandDone=true;
  if(window.applyBrand)applyBrand();
 }

 /* 2) Asegurar que el JSON de recetas sea visible (m17 lo ocultó) */
 var jc=document.getElementById('recJsonCard');
 if(jc&&jc.style.display==='none')jc.style.display='';

 /* 3) Quitar editor amigable si quedó (m16 lo inyectó) */
 var rc=document.getElementById('recCard');if(rc)rc.remove();
}

/* === Observer: detectar cuando Ajustes se vuelve visible === */
var obs=new MutationObserver(function(mutations){
 for(var i=0;i<mutations.length;i++){
  var m=mutations[i];
  if(m.attributeName==='class'&&m.target.id==='ajt'&&m.target.classList.contains('active')){
   setTimeout(initAjt,50);
  }
 }
});
obs.observe(document.body,{attributes:true,subtree:true});

/* === Fallback por si el observer no dispara === */
setInterval(function(){
 var aj=document.getElementById('ajt');
 if(aj&&aj.classList.contains('active'))initAjt();
},1500);

/* === Iconos y navegación (una sola vez, no en interval) === */
function fixNavOnce(){
 if(!navDone){
  var np=document.getElementById('n-ped');if(np)np.remove();
  var bp=document.getElementById('btnProy');
  if(bp&&(bp.textContent||'').indexOf('🗂')<0){bp.textContent='️ Proyectos';}
  navDone=true;
 }
 if(!iconsDone){
  var na=document.getElementById('n-ajt');
  if(na&&(na.textContent||'').indexOf('⚙')<0){na.insertBefore(document.createTextNode('⚙️ '),na.firstChild);}
  iconsDone=true;
 }
}
fixNavOnce();
setInterval(fixNavOnce,3000);

/* === Icono de ventana SVG en "Crear Nueva Cotización" (una sola vez) === */
var SVG_WIN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;margin-right:6px"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="3" y1="12" x2="21" y2="12"/></svg>';
setInterval(function(){
 document.querySelectorAll('#home button').forEach(function(b){
  var t=(b.textContent||'');
  if(t.indexOf('Crear Nueva Cotización')>-1&&!b._win){b._win=1;b.innerHTML=SVG_WIN+'Crear Nueva Cotización';}
 });
},2000);
})();
