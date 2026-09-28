/* m22.js — Corrige routing: "Ir a proceso de corte" → Piso de Corte (m3), no Hoja de Taller */
(function(){
/* Intercepta botones "Ir a proceso de corte" y redirige al piso de corte */
function fixCorteRouting(){
 document.querySelectorAll('button').forEach(function(b){
  var t=(b.textContent||'').trim();
  if((t.indexOf('Ir a proceso de corte')>-1||t.indexOf('Proceso de corte')>-1)&&!b._fixed){
   b._fixed=true;
   b.onclick=function(e){
    e.preventDefault();e.stopPropagation();
    /* Ir al módulo de pedidos/proyectos donde está el piso de corte */
    if(window.go)go('ped');
    /* Seleccionar la orden activa si existe */
    if(cur&&cur.id&&DB.pedidos){
     var ord=DB.pedidos.find(function(p){return p.cotId==cur.id;});
     if(ord&&window.curOrd){window.curOrd=ord;}
    }
   };
  }
 });
}
/* Ejecutar cada 2s hasta que el botón exista */
var intv=setInterval(fixCorteRouting,2000);
/* Detener después de 30s */
setTimeout(function(){clearInterval(intv);},30000);
})();
