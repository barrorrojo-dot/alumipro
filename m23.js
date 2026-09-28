/* m23.js — Corrige "Ir a proceso de corte" → Piso de Corte (sierras/contador/secciones) */
(function(){
function fixCorteBtn(){
 document.querySelectorAll('button').forEach(function(b){
  var t=(b.textContent||'').trim();
  if(t.indexOf('Ir a proceso de corte')>-1&&!b._fixed23){
   b._fixed23=true;
   b.onclick=function(e){
    e.preventDefault();e.stopPropagation();
    /* Ir a proyectos/pedidos */
    if(window.go)go('ped');
    /* Esperar a que cargue y activar piso de corte */
    setTimeout(function(){
     /* Buscar botón de "Proceso de corte" dentro de la pantalla de pedidos */
     var corteBtns=document.querySelectorAll('#ped button');
     for(var i=0;i<corteBtns.length;i++){
      var bt=corteBtns[i];
      if((bt.textContent||'').indexOf('Proceso de corte')>-1||(bt.textContent||'').indexOf('Piso de corte')>-1){
       bt.click();
       break;
      }
     }
    },500);
   };
  }
 });
}
/* Ejecutar cada 2s hasta que el botón exista */
var intv=setInterval(fixCorteBtn,2000);
setTimeout(function(){clearInterval(intv);},30000);
})();
