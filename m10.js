(function(){var d=document.createElement('div');d.id='solic';d.className='screen';
 d.innerHTML='<div class="card"><h2>📥 Solicitudes de clientes</h2><div id="solicBody"></div><button class="btn small" onclick="go(\'home\')">← Volver</button></div>';
 document.body.appendChild(d);})();
setInterval(function(){var R=window.ROLES||[];
 if(R.includes('owner')&&!document.getElementById('btnSolic')){
  var c=document.querySelector('#home .card');if(c){var b=document.createElement('button');b.id='btnSolic';b.className='btn small';
   b.textContent='📥 Solicitudes';b.onclick=abrirSolic;c.appendChild(b);}}},4000);
var MAPTIP={'Corrediza':'cor2','Fija':'fija','Puerta':'puerta','Proyectable':'proy','Guillotina':'guill'};
function abrirSolic(){go('solic');
 SB.from('shares').select('token').eq('tenant_id',TENANT_ID).then(function(s){
  var toks=(s.data||[]).map(function(x){return x.token;});if(!toks.length){document.getElementById('solicBody').innerHTML='<p>Sin enlaces publicados.</p>';return;}
  SB.from('client_events').select('*').in('token',toks).order('created_at',{ascending:false}).then(function(r){
   window._evs=r.data||[];
   document.getElementById('solicBody').innerHTML=window._evs.map(function(e,i){
    var det='';var acc='';
    if(e.tipo=='solicitar_cotizacion'){try{var o=JSON.parse(e.msg);det=o.nom+' · '+o.tip+' '+o.W+'×'+o.H+'mm '+o.col+(o.notas?' · '+o.notas:'');
      acc='<button class="btn small" onclick="cotizarDesde('+i+')">🪟 Cotizar</button>';}catch(err){det=e.msg;}}
    else det=(e.msg||'')+(e.monto?' · $'+e.monto:'');
    return '<div style="padding:8px 0;border-bottom:1px solid #e2e8f0"><b>'+e.tipo+'</b><br><small>'+det+'</small><br><small style="color:#94A3B8">'+new Date(e.created_at).toLocaleString()+'</small> '+acc+
     ' <a class="btn small" target="_blank" href="https://wa.me/?text='+encodeURIComponent('Hola, respecto a tu solicitud en '+ (DB.taller?DB.taller.nombre:'') )+'">💬</a></div>';}).join('')||'<p>Sin solicitudes aún.</p>';});});}
function cotizarDesde(i){var o=JSON.parse(window._evs[i].msg);
 cur={cliente:o.nom||'Cliente',items:[]};
 cCliente.value=o.nom||'Cliente';
 cTip.value=MAPTIP[o.tip]||'cor2';cW.value=o.W||1800;cH.value=o.H||1200;cCol.value=o.col||'Natural';
 go('cot');calc();}
