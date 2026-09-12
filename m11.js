function renderRep(){var cots=DB.cotizaciones||[];
 var proy=cots.filter(function(c){return c.estado=='Aprobada'||c.estado=='En Proceso'||c.estado=='Liquidada';});
 var liq=cots.filter(function(c){return c.estado=='Liquidada';});
 var montoCot=cots.reduce(function(a,c){return a+(c.total||0);},0);
 var montoProy=proy.reduce(function(a,c){return a+(c.total||0);},0);
 var cobrado=cots.reduce(function(a,c){return a+(c.pagado||0);},0);
 var porCobrar=cots.reduce(function(a,c){return a+Math.max(0,(c.total||0)-(c.pagado||0));},0);
 var gan=0,venta=0;cots.forEach(function(c){(c.items||[]).forEach(function(it){var t=itemSubtotal(it);venta+=t.venta*it.cant;gan+=(t.venta-(t.mat+t.mo))*it.cant;});});
 var bajos=0,ret=0;for(var k in DB.inv)(DB.inv[k]||[]).forEach(function(i){var t=0,m=0;Object.keys(i.st).forEach(function(q){t+=i.st[q].s;m+=i.st[q].min;});if(t<m)bajos++;ret+=(i.retazos||[]).length;});
 var pend=(DB.priceBook||[]).filter(function(x){return x.estado!='confirmado';}).length;
 function K(t,v,col){return '<div class="card" style="flex:1;min-width:120px;margin:4px"><small style="color:#64748B">'+t+'</small><br><b style="font-size:20px;color:'+(col||'#0F172A')+'">'+v+'</b></div>';}
 var h='<h2>📊 Panel de Control</h2><div style="display:flex;flex-wrap:wrap">'+
  K('Cotizaciones',cots.length)+K('Proyectos',proy.length)+K('Liquidadas',liq.length)+
  K('Monto cotizado','$'+montoCot.toFixed(0))+K('Monto en proyectos','$'+montoProy.toFixed(0))+
  K('Cobrado','$'+cobrado.toFixed(0),'#16A34A')+K('Por cobrar','$'+porCobrar.toFixed(0),'#DC2626')+
  K('Ganancia estimada','$'+gan.toFixed(0),'#16A34A')+
  K('Órdenes',DB.pedidos.length)+K('Retazos',ret)+K('Bajo mínimo',bajos,'#DC2626')+K('Precios sin confirmar',pend,'#F97316')+'</div>';
 var pc=cots.filter(function(c){return Math.max(0,(c.total||0)-(c.pagado||0))>0;});
 h+='<h3>💳 Cuentas por cobrar</h3><table><tr><th>Proyecto</th><th>Cliente</th><th>Total</th><th>Pagado</th><th>Saldo</th></tr>'+
  pc.map(function(c){return '<tr><td>#'+c.id+'</td><td>'+c.cliente+'</td><td>$'+(c.total||0).toFixed(0)+'</td><td>$'+(c.pagado||0).toFixed(0)+'</td><td style="color:#DC2626;font-weight:700">$'+Math.max(0,(c.total||0)-(c.pagado||0)).toFixed(0)+'</td></tr>';}).join('')+'</table>';
 h+='<h3>🏆 Proyectos por monto</h3><table><tr><th>#</th><th>Cliente</th><th>Estado</th><th>Monto</th></tr>'+
  proy.slice().sort(function(a,b){return (b.total||0)-(a.total||0);}).slice(0,8).map(function(c){return '<tr><td>#'+c.id+'</td><td>'+c.cliente+'</td><td>'+c.estado+'</td><td>$'+(c.total||0).toFixed(0)+'</td></tr>';}).join('')+'</table>';
 document.getElementById('repBody').innerHTML=h;}
