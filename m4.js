(function(){var t=document.getElementById('taller');if(t){var card=t.querySelector('.card');
 var row=document.createElement('div');row.className='row';
 row.innerHTML='<button class="btn" onclick="abrirInst()">🧰 Instalación y entrega</button>';
 var ref=card.querySelector('.btn.navy');card.insertBefore(row,ref);}})();
(function(){var d=document.createElement('div');d.id='inst';d.className='screen';d.innerHTML='<div class="card"><h2>🧰 Instalación y entrega</h2>'+
'<p id="instInfo"></p>'+
'<label>Fecha de visita</label><input id="instFecha" type="date" onchange="setInstFecha()">'+
'<h3>Checklist de finalización</h3><div id="instCheck"></div>'+
'<h3>📷 Registro fotográfico</h3><input type="file" accept="image/*" onchange="addFoto(this)" multiple>'+
'<div id="instFotos" style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0"></div>'+
'<h3>✍️ Firma del cliente</h3>'+
'<canvas id="firmaPad" width="500" height="160" style="border:1px solid #cbd5e1;border-radius:8px;background:#fff;touch-action:none;width:100%"></canvas>'+
'<div class="row"><button class="btn small" onclick="limpiarFirma()">Limpiar</button><button class="btn small" onclick="guardarFirma()">Guardar firma</button></div>'+
'<div id="instFirmaPrev"></div>'+
'<div class="row"><button class="btn" onclick="emitirRecibo()">🧾 Emitir recibo</button><button class="btn navy" onclick="liquidarProyecto()">✅ Liquidar proyecto</button></div>'+
'<button class="btn small" onclick="go(\'taller\')">← Volver</button></div>';
document.body.appendChild(d);})();
var CHECK_DEF=['Verificar medidas y nivel','Fijar marco y asegurar','Colocar hojas y ajustar','Instalar vidrio y calzar','Colocar herrajes y probar','Sellado y limpieza final','Firma y entrega'];
function getInst(){if(!cur.inst)cur.inst={fecha:'',check:CHECK_DEF.map(function(t){return{t:t,done:false};}),fotos:[],firma:null};return cur.inst;}
function abrirInst(){if(!cur)return;go('inst');renderInst();initFirma();}
function renderInst(){var I=getInst();
 document.getElementById('instInfo').innerHTML='Proyecto #'+cur.id+' · '+cur.cliente+' · Estado: <b>'+cur.estado+'</b> · Saldo: <b style="color:#DC2626">$'+Math.max(0,(cur.total||0)-(cur.pagado||0)).toFixed(2)+'</b>';
 document.getElementById('instFecha').value=I.fecha||'';
 document.getElementById('instCheck').innerHTML=I.check.map(function(c,i){return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #e2e8f0"><button class="btn small" style="'+(c.done?'background:#16A34A':'')+'" onclick="toggleCheck('+i+')">'+(c.done?'✔':'○')+'</button><div>'+c.t+'</div></div>';}).join('');
 document.getElementById('instFotos').innerHTML=(I.fotos||[]).map(function(f){return '<img src="'+f+'" style="width:70px;height:70px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0">';}).join('')||'<small>Sin fotos.</small>';
 document.getElementById('instFirmaPrev').innerHTML=I.firma?'<img src="'+I.firma+'" style="max-height:80px;background:#fff;border:1px solid #e2e8f0;border-radius:8px">':'';}
function setInstFecha(){var I=getInst();I.fecha=document.getElementById('instFecha').value;save();}
function toggleCheck(i){var I=getInst();I.check[i].done=!I.check[i].done;save();renderInst();}
function addFoto(inp){var I=getInst();var files=Array.prototype.slice.call(inp.files||[]);var n=0;
 files.forEach(function(f){if(n>=4)return;n++;var r=new FileReader();r.onload=function(){var img=new Image();img.onload=function(){
  var sc=Math.min(800/img.width,800/img.height,1);var w=Math.max(1,img.width*sc),h=Math.max(1,img.height*sc);
  var cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);
  I.fotos.push(cv.toDataURL('image/jpeg',0.7));save();renderInst();};img.src=r.result;};r.readAsDataURL(f);});
 inp.value='';}
var fctx=null,fdraw=false;
function initFirma(){var cv=document.getElementById('firmaPad');if(!cv)return;fctx=cv.getContext('2d');fctx.lineWidth=2;fctx.lineCap='round';fctx.strokeStyle='#0F172A';
 cv.onpointerdown=function(e){fdraw=true;cv.setPointerCapture(e.pointerId);var r=cv.getBoundingClientRect();fctx.beginPath();fctx.moveTo((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height));};
 cv.onpointermove=function(e){if(!fdraw)return;var r=cv.getBoundingClientRect();fctx.lineTo((e.clientX-r.left)*(cv.width/r.width),(e.clientY-r.top)*(cv.height/r.height));fctx.stroke();};
 cv.onpointerup=function(){fdraw=false;};}
function limpiarFirma(){var cv=document.getElementById('firmaPad');if(fctx)fctx.clearRect(0,0,cv.width,cv.height);}
function guardarFirma(){var cv=document.getElementById('firmaPad');var I=getInst();I.firma=cv.toDataURL('image/png');save();renderInst();}
function emitirRecibo(){var I=getInst();var tot=cur.total||0,pag=cur.pagado||0;
 var rows=(cur.pagos||[]).map(function(p,i){return '<tr><td>'+(i+1)+'</td><td>'+p.tipo+'</td><td>$'+p.monto.toFixed(2)+'</td><td>'+new Date(p.fecha).toLocaleDateString('es-MX')+'</td></tr>';}).join('');
 document.getElementById('pdfCliente').innerHTML='<div style="padding:30px"><h2 style="color:#0F172A">RECIBO DE PAGO · '+tallerName()+'</h2>'+
 '<p>Proyecto #'+cur.id+' · Cliente: '+cur.cliente+' · Fecha: '+new Date().toLocaleDateString('es-MX')+'</p>'+
 '<table style="width:100%;border-collapse:collapse;margin:12px 0"><tr style="background:#0F172A;color:#fff"><th style="padding:8px">#</th><th>Concepto</th><th>Monto</th><th>Fecha</th></tr>'+rows+'</table>'+
 '<p style="text-align:right">Total: <b>$'+tot.toFixed(2)+'</b> · Pagado: <b style="color:#16A34A">$'+pag.toFixed(2)+'</b> · Saldo: <b style="color:#DC2626">$'+Math.max(0,tot-pag).toFixed(2)+'</b></p>'+
 (I.firma?'<p>Firma del cliente:</p><img src="'+I.firma+'" style="max-height:70px">':'')+
 '<div style="margin-top:40px;display:flex;gap:40px"><div style="flex:1;border-top:1px solid #94A3B8;text-align:center;padding-top:6px;font-size:12px">Firma del cliente</div><div style="flex:1;border-top:1px solid #94A3B8;text-align:center;padding-top:6px;font-size:12px">'+tallerName()+'</div></div></div>';
 document.body.classList.add('pdfmode');setTimeout(function(){window.print();},80);window.onafterprint=function(){document.body.classList.remove('pdfmode');};}
function liquidarProyecto(){var I=getInst();var done=I.check.filter(function(c){return c.done;}).length;
 var ok=done==I.check.length&&I.firma&&(cur.pagado||0)>=(cur.total||0);
 if(!ok){if(!confirm('Faltan: checklist '+done+'/'+I.check.length+', firma '+(I.firma?'✔':'✖')+', saldo $'+Math.max(0,(cur.total||0)-(cur.pagado||0)).toFixed(2)+'. ¿Liquidar de todos modos?'))return;}
 cur.estado='Liquidada';save();alert('✔ Proyecto liquidado e instalado.');go('home');}
