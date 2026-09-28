/* m26.js — Parche definitivo: elimina botón original y crea uno nuevo con routing correcto */
(function(){
var SVG_CORTE='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:6px"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>';

function fixCorteBtnDefinitivo(){
 var taller=document.getElementById('taller');
 if(!taller)return;
 
 /* Buscar TODOS los botones en la pantalla de taller */
 var btns=taller.querySelectorAll('button');
 for(var i=0;i<btns.length;i++){
  var b=btns[i];
  var t=(b.textContent||'').trim();
  
  /* Si es el botón "Ir a proceso de corte" y aún no lo hemos parchado */
  if(t.indexOf('Ir a proceso de corte')>-1&&!b._parched26){
   b._parched26=true;
   
   /* Clonar el botón para eliminar todos los event listeners */
   var nuevoBtn=b.cloneNode(true);
   
   /* Eliminar el botón original */
   b.parentNode.replaceChild(nuevoBtn,b);
   
   /* Agregar el nuevo comportamiento */
   nuevoBtn.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    
    console.log('m26: clic en "Ir a proceso de corte" → redirigiendo...');
    
    /* Paso 1: Ir a Proyectos */
    if(window.go){
     go('ped');
     
     /* Paso 2: Esperar a que cargue la lista de órdenes */
     setTimeout(function(){
      /* Buscar la orden asociada a esta cotización */
      if(cur&&cur.id&&DB.pedidos){
       var ord=DB.pedidos.find(function(p){
        return p.cotId==cur.id||(p.id&&p.id.toString().indexOf(cur.id.toString())>-1);
       });
       
       if(ord){
        console.log('m26: orden encontrada:',ord.id);
        
        /* Buscar y hacer clic en el botón "Abrir" de esa orden */
        var abBtns=document.querySelectorAll('#ped button');
        for(var j=0;j<abBtns.length;j++){
         var bt=abBtns[j];
         if((bt.textContent||'').trim()==='Abrir'){
          var parent=bt.closest('.card')||bt.parentElement;
          if(parent&&(parent.textContent||'').indexOf('Orden #'+ord.id)>-1){
           console.log('m26: abriendo orden',ord.id);
           bt.click();
           
           /* Paso 3: Esperar a que se abra la orden y hacer clic en "Proceso de corte" */
           setTimeout(function(){
            var corteBtns=document.querySelectorAll('button');
            for(var k=0;k<corteBtns.length;k++){
             var cb=corteBtns[k];
             if((cb.textContent||'').trim()==='Proceso de corte'){
              console.log('m26: activando Piso de Corte');
              cb.click();
              return;
             }
            }
            console.log('m26: no se encontró botón "Proceso de corte"');
           },600);
           break;
          }
         }
        }
       }else{
        console.log('m26: no se encontró orden para cotización',cur.id);
        alert('No hay orden de producción para esta cotización. Primero convierte la cotización en orden.');
       }
      }
     },400);
    }
   };
   
   /* Agregar icono si no lo tiene */
   if(!nuevoBtn.querySelector('svg')){
    nuevoBtn.innerHTML=SVG_CORTE+nuevoBtn.textContent;
   }
   
   console.log('m26: botón parchado exitosamente');
   return; /* Salir después de parchar el primer botón encontrado */
  }
 }
}

/* Ejecutar cada 1.5s hasta que se parche el botón */
var intv=setInterval(fixCorteBtnDefinitivo,1500);

/* Detener después de 60s */
setTimeout(function(){
 clearInterval(intv);
 console.log('m26: deteniendo observer');
},60000);

/* También ejecutar cuando se navega a la pantalla de taller */
var _go=window.go;
if(_go){
 window.go=function(id){
  var r=_go.apply(this,arguments);
  if(id==='taller'){
   setTimeout(fixCorteBtnDefinitivo,300);
  }
  return r;
 };
}
})();
