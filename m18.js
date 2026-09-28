/* m18.js — Estabiliza Ajustes: inicialización única, sin parpadeo */
(function(){
/* Desactiva los intervalos conflictivos de m16/m17 */
window.recEditor=function(){};
window.brandToggle=function(){};
window.brandTop=function(){};
window.killRec=function(){};

/* Flags para inicialización única */
var ajInit=false, brandInit=false;

function initAjustes(){
 var aj=document.getElementById('ajt');if(!aj)return;
 
 /* Branding: insertar solo una vez */
 if(!brandInit&&!document.getElementById('brandCard')){
  var c=document.createElement('div');c.className='card';c.id='brandCard';
  c.innerHTML='<h3>🎨 Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
  aj.insertBefore(c,aj.firstElementChild);
  brandInit=true;
  applyBrand();
 }
 
 /* JSON de recetas: restaurar si fue ocultado */
 var jc=document.getElementById('recJsonCard');
 if(jc&&jc.style.display==='none')jc.style.display='';
 
 /* Editor de recetas: NO inyectar (dejamos JSON original) */
 var rc=document.getElementById('recCard');if(rc)rc.remove();
 
 ajInit=true;
}

/* Observer: inicializar cuando Ajustes se vuelve visible */
var obs=new MutationObserver(function(mutations){
 mutations.forEach(function(m){
  if(m.attributeName==='class'){
   var el=m.target;
   if(el.id==='ajt'&&el.classList.contains('active')&&!ajInit){
    setTimeout(initAjustes,100);
   }
  }
 });
});
obs.observe(document.body,{attributes:true,subtree:true});

/* También inicializar al cargar si ya está activo */
setInterval(function(){
 var aj=document.getElementById('ajt');
 if(aj&&aj.classList.contains('active')&&!ajInit)initAjustes();
},1000);

/* Limpieza de intervalos viejos (m16/m17) */
var oldIntervals=window.setInterval.toString();
/* No podemos matar intervals anónimos, pero los flags previenen re-ejecución */
})();
