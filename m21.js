/* m21.js — Bloquea intervals de m16-m20 y estabiliza Ajustes definitivamente */
(function(){
/* === Sobrescribir setInterval para bloquear intervals de módulos anteriores === */
var _origSetInterval=window.setInterval;
var blockIntervals=false;
window.setInterval=function(fn,delay){
 /* Permitir solo intervals de m21+ (los que se registren después de este script) */
 if(blockIntervals)return -1;
 return _origSetInterval.apply(this,arguments);
};

/* === Ahora sí, permitir intervals de m21 === */
blockIntervals=true;

/* === Neutralizar TODAS las funciones de m16-m20 === */
window.recEditor=function(){};
window.brandToggle=function(){};
window.brandTop=function(){};
window.killRec=function(){};
window.moverInventario=function(){};
window.fixIcons=function(){};
window.initAjt=function(){};
window.renderRec=function(){};
window.saveRec=function(){};
window.toggleJson=function(){};

/* === Flag de inicialización === */
var AJT_INIT='ajt_init_v2';
if(sessionStorage.getItem(AJT_INIT)==='1'){
 /* Ya inicializado en esta sesión, no hacer nada */
 console.log('m21: Ajustes ya inicializado');
}else{
 /* Observer para detectar cuando Ajustes se vuelve activo */
 var obs=new MutationObserver(function(mutations){
  for(var i=0;i<mutations.length;i++){
   var m=mutations[i];
   if(m.attributeName==='class'&&m.target.id==='ajt'&&m.target.classList.contains('active')){
    setTimeout(function(){
     if(sessionStorage.getItem(AJT_INIT)==='1')return;
     
     var aj=document.getElementById('ajt');
     if(!aj)return;
     
     /* 1) Branding arriba */
     if(!document.getElementById('brandCard')){
      var c=document.createElement('div');c.className='card';c.id='brandCard';
      c.innerHTML='<h3>🎨 Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
      aj.insertBefore(c,aj.firstElementChild);
      if(window.applyBrand)applyBrand();
     }
     
     /* 2) JSON visible */
     var jc=document.getElementById('recJsonCard');
     if(jc)jc.style.display='';
     
     /* 3) Remover editor amigable */
     var rc=document.getElementById('recCard');if(rc)rc.remove();
     
     sessionStorage.setItem(AJT_INIT,'1');
     console.log('m21: Ajustes inicializado (una sola vez por sesión)');
    },100);
   }
  }
 });
 obs.observe(document.body,{attributes:true,subtree:true});
}

/* === Permitir intervals legítimos de otros módulos (m3-m15) === */
/* Restaurar setInterval original después de 5 segundos para no bloquear otros módulos */
setTimeout(function(){window.setInterval=_origSetInterval;},5000);
})();
