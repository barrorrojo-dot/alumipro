/* m16.js — Lote de 8 ajustes de UX, navegación, permisos y branding */
(function(){
function cardPorTitulo(t,root){var cs=(root||document).querySelectorAll('.card');for(var i=0;i<cs.length;i++){var h=cs[i].querySelector('h2,h3');if(h&&(h.textContent||'').indexOf(t)>-1)return cs[i];}return null;}
function botsCon(txt,root){var o=[];(root||document).querySelectorAll('button').forEach(function(b){if((b.textContent||'').indexOf(txt)>-1)o.push(b);});return o;}
/* (1) Inventario como módulo independiente */
if(!document.getElementById('inv')){var inv=document.createElement('div');inv.id='inv';inv.className='screen';
 inv.innerHTML='<div class="card"><h2>📦 Inventario</h2><div id="invBody"></div><button class="btn small" onclick="go(\'home\')">← Volver</button></div>';
 document.body.appendChild(inv);}
function moverInventario(){var ped=document.getElementById('ped');if(!ped)return;
 var h=ped.querySelector('h2,h3');var tgt=null;ped.querySelectorAll('h2,h3').forEach(function(x){if(!tgt&&(x.textContent||'').indexOf('Inventario')>-1)tgt=x;});
 var nodo=tgt||cardPorTitulo('Inventario',ped);if(!nodo||nodo.dataset.moved)return;nodo.dataset.moved='1';
 var wrap=document.createElement('div');var n=nodo;
 while(n){var nx=n.nextElementSibling;wrap.appendChild(n);n=nx;if(n&&(n.tagName=='H2'||n.tagName=='H3'))break;}
 document.getElementById('invBody').appendChild(wrap);}
/* (2) Botón Proyectos en inicio + (1) rewiring Inventario */
function homeFix(){var home=document.getElementById('home');if(!home)return;
 var card=null;home.querySelectorAll('.card').forEach(function(c){if(!card&&(c.textContent||'').indexOf('Crear Nueva Cotización')>-1)card=c;});if(!card)return;
 if(!document.getElementById('btnProy')){var b=document.createElement('button');b.id='btnProy';b.className='btn';b.textContent='📦 Proyectos';b.onclick=function(){go('ped');};
  var ib=botsCon('Inventario',card)[0];card.insertBefore(b,ib||null);}
 botsCon('Inventario',card).forEach(function(b){if(!b._inv){b._inv=1;b.onclick=function(){moverInventario();go('inv');};}});}
/* (3) Fuera Proyectos de barra inferior + gating por rol del botón de inicio */
function navFix(){var np=document.getElementById('n-ped');if(np)np.remove();
 var R=window.ROLES||[];var bp=document.getElementById('btnProy');
 if(bp)bp.style.display=(R.includes('owner')||R.includes('armador')||R.includes('instalador'))?'':'none';}
/* (4) Icono de Ajustes */
function ajIcon(){var na=document.getElementById('n-ajt');if(na&&(na.textContent||'').indexOf('⚙')<0){na.insertBefore(document.createTextNode('⚙️ '),na.firstChild);}}
/* (6) Kit encima de Productos */
function kitOrder(){var cot=document.getElementById('cot');if(!cot)return;
 var prod=cardPorTitulo('Productos en esta cotización',cot);var kit=cardPorTitulo('Kit',cot);
 if(prod&&kit&&kit!==prod)cot.insertBefore(kit,prod);}
/* (7) Restringir registro de pagos a armador/instalador */
function payGate(){var R=window.ROLES||[];var block=R.length&&!R.includes('owner')&&(R.includes('armador')||R.includes('instalador'));
 botsCon('Registrar anticipo').concat(botsCon('Registrar pago')).forEach(function(b){b.style.display=block?'none':'';});}
/* (8) Ocultar branding */
window.setHideBrand=function(v){DB.taller=DB.taller||{};DB.taller.hideBrand=!!v;save();applyBrand();};
function applyBrand(){var hide=DB.taller&&DB.taller.hideBrand;
 var logo=document.getElementById('homeLogo');if(logo)logo.style.display=hide?'none':'';
 document.querySelectorAll('#home h1,#home h2,#home small').forEach(function(e){
  var t=(e.textContent||'').trim();var nb=DB.taller?(DB.taller.nombre||'').trim():'';var tb=DB.taller?(DB.taller.tagline||'').trim():'';
  if(nb&&t===nb||(tb&&t===tb)){e.dataset.brand='1';e.style.display=hide?'none':'';}
  else if(e.dataset.brand==='1'){e.style.display='';delete e.dataset.brand;}});
 var cb=document.getElementById('hideBrand');if(cb)cb.checked=!!hide;}
var _rb16=window.refreshBrand;window.refreshBrand=function(){var r=_rb16?_rb16.apply(this,arguments):undefined;applyBrand();return r;};
function brandToggle(){var aj=document.getElementById('ajt');if(!aj||document.getElementById('brandCard'))return;
 var c=document.createElement('div');c.className='card';c.id='brandCard';
 c.innerHTML='<h3>🎨 Branding</h3><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="hideBrand" onchange="setHideBrand(this.checked)"> Ocultar nombre, logo y eslogan del taller</label>';
 aj.appendChild(c);applyBrand();}
/* (5) Editor amigable de recetas (reemplaza JSON) */
function recEditor(){var aj=document.getElementById('ajt');if(!aj||document.getElementById('recCard'))return;
 var c=document.createElement('div');c.className='card';c.id='recCard';
 c.innerHTML='<h3>🧰 Editor de recetas de despiece</h3><label>Tipo de producto</label>'+
 '<select id="recTip" onchange="renderRec()">'+Object.keys(DB.recetas).map(function(k){return '<option value="'+k+'">'+((DB.recetas[k]||{}).nombre||k)+'</option>';}).join('')+'</select>'+
 '<div id="recBody"></div><button class="btn small" onclick="saveRec()">💾 Guardar receta</button> '+
 '<button class="btn small" onclick="toggleJson()">{ } JSON avanzado</button>';
 aj.appendChild(c);
 var ja=document.getElementById('ajRecetas');if(ja){var w=ja.closest('.card')||ja.parentNode;w.id='recJsonCard';w.style.display='none';}
 renderRec();}
window.toggleJson=function(){var w=document.getElementById('recJsonCard');if(w)w.style.display=(w.style.display==='none')?'':'none';};
window.renderRec=function(){var k=document.getElementById('recTip').value;var R=DB.recetas[k]||{};
 var h='<h4>Perfiles</h4><table><tr><th>Nombre</th><th>Grupo</th><th>Cant</th><th>Fórmula (mm)</th></tr>';
 (R.perfiles||[]).forEach(function(p,i){h+='<tr><td><input id="pf_n'+i+'" value="'+(p.n||'')+'"></td>'+
 '<td><select id="pf_g'+i+'"><option value="marco"'+(p.g=='marco'?' selected':'')+'>marco</option><option value="hoja"'+(p.g=='hoja'?' selected':'')+'>hoja</option></select></td>'+
 '<td><input id="pf_c'+i+'" type="number" value="'+(p.c||1)+'"></td><td><input id="pf_f'+i+'" value="'+(Array.isArray(p.f)?p.f.join('|'):p.f)+'"></td></tr>';});
 h+='</table><h4>Vidrio</h4><div class="row"><div><label>Ancho</label><input id="vd_w" value="'+((R.vidrio&&R.vidrio.fW)||'')+'"></div>'+
 '<div><label>Alto</label><input id="vd_h" value="'+((R.vidrio&&R.vidrio.fH)||'')+'"></div>'+
 '<div><label>Piezas</label><input id="vd_n" type="number" value="'+((R.vidrio&&R.vidrio.n)||1)+'"></div></div>'+
 '<h4>Herrajes</h4><table><tr><th>Nombre</th><th>Precio</th><th>Cant</th></tr>';
 (R.herrajes||[]).forEach(function(x,i){h+='<tr><td><input id="hj_n'+i+'" value="'+(x.n||'')+'"></td><td><input id="hj_p'+i+'" type="number" value="'+(x.p||0)+'"></td><td><input id="hj_c'+i+'" value="'+(x.c||1)+'"></td></tr>';});
 h+='</table>';document.getElementById('recBody').innerHTML=h;};
window.saveRec=function(){var k=document.getElementById('recTip').value;var R=DB.recetas[k];if(!R)return;
 (R.perfiles||[]).forEach(function(p,i){p.n=document.getElementById('pf_n'+i).value;p.g=document.getElementById('pf_g'+i).value;
  p.c=+document.getElementById('pf_c'+i).value||1;var f=document.getElementById('pf_f'+i).value;p.f=f.indexOf('|')>-1?f.split('|'):f;});
 if(R.vidrio){R.vidrio.fW=document.getElementById('vd_w').value;R.vidrio.fH=document.getElementById('vd_h').value;R.vidrio.n=+document.getElementById('vd_n').value||1;}
 (R.herrajes||[]).forEach(function(x,i){x.n=document.getElementById('hj_n'+i).value;x.p=+document.getElementById('hj_p'+i).value||0;
  var c=document.getElementById('hj_c'+i).value;x.c=isNaN(+c)?c:+c;});
 save();alert('Receta guardada.');};
/* Bucle de mantenimiento de UI */
setInterval(function(){navFix();ajIcon();homeFix();kitOrder();payGate();brandToggle();recEditor();moverInventario();applyBrand();},3000);
navFix();ajIcon();homeFix();
})();
