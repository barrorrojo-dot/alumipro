/* m19.js — Parche agresivo: neutraliza parpadeo de Ajustes */
(function(){
/* Neutralizar funciones de m16/m17/m18 */
window.recEditor=function(){};
window.brandToggle=function(){};
window.brandTop=function(){};
window.killRec=function(){};
window.moverInventario=function(){};
window.fixIcons=function(){};

/* Observer agresivo: detecta y remueve #recCard al instante */
var recObs=new MutationObserver(function(mutations){
 for(var i=0;i<mutations.length;i++){
  var m=mutations[i];
  if(m.addedNodes){
   for(var j=0;j<m.addedNodes.length;j++){
    var n=m.addedNodes[j];
    if(n.nodeType===1){
     if(n.id==='recCard'){n.remove();continue;}
     var rc=n.querySelector&&n.querySelector('#recCard');
     if(rc)rc.remove();
    }
   }
  }
 }
});
recObs.observe(document.body,{childList:true,subtree:true});

/* Observer: detectar cuando Ajustes se vuelve visible */
var ajtObs=new MutationObserver(function(mutations){
 for(var i=0;i<mutations.length;i++){
  var m=mutations[i];
  if(m.attributeName==='class'&&m.target.id==='ajt'&&m.target.classList.contains('active')){
   setTimeout(function(){
    /* Remover editor amigable si quedó */
    var rc=document.getElementById('recCard');if(rc)rc.remove();
    /* Mostrar JSON */
    var jc=document.getElementById('recJsonCard');
    if(jc)jc.style.display='';
    /* Branding arriba (una sola vez) */
    if(!document.getElementById('brandCard')){
     var aj=document.getElementById('ajt');
     var c=document.createElement('div');c.className='card';c.id='brandCard';
     c.innerHTML='<h3>🎨 Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
     aj.insertBefore(c,aj.firstElementChild);
     if(window.applyBrand)applyBrand();
    }
   },100);
  }
 }
});
ajtObs.observe(document.body,{attributes:true,subtree:true});

/* Fallback: limpieza cada 500ms */
setInterval(function(){
 var rc=document.getElementById('recCard');if(rc)rc.remove();
 var jc=document.getElementById('recJsonCard');if(jc&&jc.style.display==='none')jc.style.display='';
},500);
})();
