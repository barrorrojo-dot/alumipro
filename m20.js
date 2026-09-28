/* m20.js — Inicialización única de Ajustes con flag persistente, sin parpadeo ni scroll jump */
(function(){
/* === Neutralizar TODAS las funciones de m16/m17/m18/m19 === */
window.recEditor=function(){};
window.brandToggle=function(){};
window.brandTop=function(){};
window.killRec=function(){};
window.moverInventario=function(){};
window.fixIcons=function(){};
window.initAjt=function(){};

/* === Flag persistente: solo inicializar UNA vez por sesión === */
var AJT_INIT_KEY='ajt_init_done_v1';
var alreadyInit=localStorage.getItem(AJT_INIT_KEY)==='1';

/* === Inicialización única === */
function initAjtOnce(){
 if(alreadyInit)return;
 
 var aj=document.getElementById('ajt');
 if(!aj||!aj.classList.contains('active'))return;
 
 /* Guardar scroll position */
 var scrollY=window.scrollY;
 
 /* 1) Branding como primera tarjeta */
 if(!document.getElementById('brandCard')){
  var c=document.createElement('div');c.className='card';c.id='brandCard';
  c.innerHTML='<h3>🎨 Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
  aj.insertBefore(c,aj.firstElementChild);
  if(window.applyBrand)applyBrand();
 }
 
 /* 2) Asegurar JSON visible */
 var jc=document.getElementById('recJsonCard');
 if(jc)jc.style.display='';
 
 /* 3) Remover editor amigable si existe */
 var rc=document.getElementById('recCard');if(rc)rc.remove();
 
 /* 4) Restaurar scroll */
 window.scrollTo(0,scrollY);
 
 /* Marcar como inicializado */
 localStorage.setItem(AJT_INIT_KEY,'1');
 alreadyInit=true;
 
 console.log('m20: Ajustes inicializado (una sola vez)');
}

/* === Ejecutar cuando Ajustes se vuelve visible (una sola vez) === */
var checkInterval=setInterval(function(){
 var aj=document.getElementById('ajt');
 if(aj&&aj.classList.contains('active')){
  initAjtOnce();
  clearInterval(checkInterval);
 }
},500);

/* === Si ya está inicializado, solo asegurar scroll === */
if(alreadyInit){
 window.addEventListener('scroll',function(){
  var aj=document.getElementById('ajt');
  if(aj&&aj.classList.contains('active')){
   /* No hacer nada, solo prevenir re-inicialización */
  }
 });
}
})();
