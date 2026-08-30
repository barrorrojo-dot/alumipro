(function(){var p=document.getElementById('prov');if(p&&!document.getElementById('btnLibro')){
 var card=p.querySelector('.card');var b=document.createElement('button');b.id='btnLibro';b.className='btn';
 b.textContent='📖 Libro de Precios';b.onclick=abrirPrec;card.insertBefore(b,card.querySelector('.btn.orange'));}})();
function initPriceBook(){if(DB.priceBook)return DB.priceBook;var B=[];var f=new Date().toISOString();
 B.push({sku:'marcoM',name:'Marco $/m',price:DB.precios.marcoM,supplier:'',fecha:f,estado:'confirmado'});
 B.push({sku:'hojaM',name:'Hoja $/m',price:DB.precios.hojaM,supplier:'',fecha:f,estado:'confirmado'});
 (DB.inv.vidrios||[]).forEach(function(v){B.push({sku:v.id,name:v.n+' $/m²',price:v.p,supplier:'',fecha:f,estado:'confirmado'});});
 (DB.inv.herrajes||[]).forEach(function(h){B.push({sku:h.id,name:h.n+' $/pz',price:h.p,supplier:'',fecha:f,estado:'confirmado'});});
 DB.priceBook=B;save();return B;}
function abrirPrec(){initPriceBook();go('prec');renderPrec();}
function dias(f){return Math.floor((Date.now()-new Date(f).getTime())/86400000);}
function renderPrec(){var el=document.getElementById('precList');if(!el)return;var B=initPriceBook();
 var pend=B.filter(function(x){return x.estado!='confirmado';}).length;
 var viejos=B.filter(function(x){return x.estado=='confirmado'&&dias(x.fecha)>30;}).length;
 var warn=(pend||viejos)?'<div class="card" style="background:#FFEDD5;border-left:6px solid #F97316">⚠️ '+pend+' precio(s) por confirmar · '+viejos+' confirmado(s) con +30 días (re‑confirmar).</div>':'';
 el.innerHTML=warn+'<table><tr><th>Concepto</th><th>Proveedor</th><th>Precio</th><th>Fecha</th><th>Estado</th><th></th></tr>'+
 B.map(function(x,i){return '<tr><td>'+x.name+'</td><td>'+(x.supplier||'—')+'</td><td>$'+x.price+'</td><td>'+new Date(x.fecha).toLocaleDateString('es-MX')+'</td>'+
 '<td><span class="tag '+(x.estado=='confirmado'?'t-green':'t-orange')+'">'+(x.estado=='confirmado'?'Confirmado':'Por confirmar')+'</span></td>'+
 '<td><button class="btn small" onclick="editarPrecio('+i+')">✏️</button> <button class="btn small" style="background:#16A34A" onclick="confirmarPrecio('+i+')">✅</button></td></tr>';}).join('')+'</table>';}
function editarPrecio(i){var B=initPriceBook();var x=B[i];
 var v=prompt('Nuevo precio (estimado) para '+x.name+':',x.price);if(v===null)return;
 var s=prompt('Proveedor (opcional):',x.supplier||'');
 x.price=+v||x.price;x.supplier=s||x.supplier;x.fecha=new Date().toISOString();x.estado='por confirmar';save();renderPrec();}
function confirmarPrecio(i){var B=initPriceBook();var x=B[i];x.estado='confirmado';x.fecha=new Date().toISOString();
 writeUnderlying(x);recalcPending();save();renderPrec();alert('✔ Precio confirmado y aplicado.');}
function writeUnderlying(x){if(x.sku=='marcoM')DB.precios.marcoM=x.price;
 else if(x.sku=='hojaM')DB.precios.hojaM=x.price;
 else{var v=(DB.inv.vidrios||[]).find(function(v){return v.id==x.sku;})||(DB.inv.herrajes||[]).find(function(h){return h.id==x.sku;});if(v)v.p=x.price;}}
(function(){var d=document.createElement('div');d.id='prec';d.className='screen';
 d.innerHTML='<div class="card"><h2>📖 Libro de Precios</h2><p style="font-size:12px;color:#64748B">✏️ registra un precio <b>estimado</b> (no afecta cotizaciones) · ✅ lo <b>confirma</b> y lo aplica.</p><div id="precList"></div><button class="btn small" onclick="go(\'prov\')">← Volver</button></div>';
 document.body.appendChild(d);})();
