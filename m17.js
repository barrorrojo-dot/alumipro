/* m17.js — Icono de ventana, iconos diferenciados y Branding arriba (recetas intactas) */
(function(){
var SVG_WIN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-3px;margin-right:6px"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="3" y1="12" x2="21" y2="12"/></svg>';
function fixIcons(){
 document.querySelectorAll('#home button').forEach(function(b){
  var t=(b.textContent||'');
  if(t.indexOf('Crear Nueva Cotización')>-1&&!b._win){b._win=1;b.innerHTML=SVG_WIN+'Crear Nueva Cotización';}});
 var bp=document.getElementById('btnProy');
 if(bp&&(bp.textContent||'').indexOf('🗂')<0){bp.textContent='🗂️ Proyectos';}}
window.recEditor=function(){};
function killRec(){var rc=document.getElementById('recCard');if(rc)rc.remove();
 var jc=document.getElementById('recJsonCard');if(jc)jc.style.display='';}
function brandTop(){var aj=document.getElementById('ajt');if(!aj)return;
 var bc=document.getElementById('brandCard');
 if(bc&&aj.firstElementChild!==bc)aj.insertBefore(bc,aj.firstElementChild);}
setInterval(function(){fixIcons();killRec();brandTop();},2500);
fixIcons();killRec();brandTop();
})();
