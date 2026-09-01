(function(){var o=document.getElementById('onb');if(o&&!document.getElementById('btnCanj')){var card=o.querySelector('.card');
 var b=document.createElement('button');b.id='btnCanj';b.className='btn navy';b.textContent='🎟️ Tengo código de invitación';b.onclick=canjearCodigo;
 card.insertBefore(b,card.querySelector('.btn.orange'));}})();
(function(){var d=document.createElement('div');d.id='memb';d.className='screen';
 d.innerHTML='<div class="card"><h2>👥 Miembros e invitaciones</h2><div id="membBody"></div><button class="btn small" onclick="go(\'home\')">← Volver</button></div>';
 document.body.appendChild(d);})();
setInterval(function(){if(window.SESSION)cargarRoles();},4000);
function cargarRoles(){if(!SB||!SESSION)return;
 SB.from('tenant_users').select('rol').eq('user_id',SESSION.id).maybeSingle().then(function(r){
  window.ROLES=r.data?(r.data.rol||'owner').split(',').map(function(s){return s.trim();}):['owner'];aplicarNav();});}
function aplicarNav(){var R=window.ROLES||['owner'];var isO=R.includes('owner');
 var show=function(id,ok){var el=document.getElementById(id);if(el)el.style.display=ok?'':'none';};
 show('n-cot',isO||R.includes('vendedor'));
 show('n-ped',isO||R.includes('armador')||R.includes('instalador'));
 show('n-prov',isO);show('n-rep',isO);show('n-ajt',isO);
  var hb=document.getElementById('btnMemb');if(hb)hb.style.display=isO?'':'none';}
function canjearCodigo(){var code=prompt('Código de invitación:');if(!code)return;
 SB.from('invites').select('*').eq('code',code.trim()).eq('activo',true).maybeSingle().then(function(r){
  if(!r.data){alert('Código no válido o ya usado.');return;}
  var tid=r.data.tenant_id,roles=r.data.roles;
  SB.from('tenant_users').select('user_id').eq('user_id',SESSION.id).maybeSingle().then(function(ex){
      var yaOwner=ex.data&&/owner/.test(ex.data.rol||'');
   var op=ex.data
     ? SB.from('tenant_users').update({tenant_id:tid,rol:yaOwner?ex.data.rol:roles}).eq('user_id',SESSION.id)
     : SB.from('tenant_users').insert({user_id:SESSION.id,tenant_id:tid,rol:roles});
   op.then(function(res){
     if(res.error){alert('Error: '+res.error.message);return;}
     SB.from('invites').update({activo:false}).eq('id',r.data.id).then(function(){location.reload();});});
  });});}
function abrirMemb(){go('memb');renderMemb();}
function renderMemb(){SB.from('tenant_users').select('user_id,rol').then(function(m){
 var rows=(m.data||[]).map(function(u){return '<tr><td>'+u.user_id.slice(0,8)+'…</td><td>'+u.rol+'</td><td><button class="btn small" onclick="editarRoles(\''+u.user_id+'\',\''+u.rol+'\')">✏️ Roles</button> <button class="btn small" style="background:#DC2626" onclick="quitarMiembro(\''+u.user_id+'\')">🗑</button></td></tr>';}).join('');
 SB.from('invites').select('*').eq('activo',true).then(function(iv){
  var inv=(iv.data||[]).map(function(x){return '<tr><td><b>'+x.code+'</b></td><td>'+x.roles+'</td><td><button class="btn small" style="background:#DC2626" onclick="anularInv(\''+x.id+'\')">Anular</button></td></tr>';}).join('');
  document.getElementById('membBody').innerHTML='<h3>Miembros</h3><table><tr><th>Usuario</th><th>Roles</th><th></th></tr>'+rows+'</table>'+
  '<h3>Códigos de invitación activos</h3><table><tr><th>Código</th><th>Roles</th><th></th></tr>'+(inv||'<tr><td colspan="3">Sin códigos.</td></tr>')+'</table>'+
  '<button class="btn" onclick="nuevaInv()">🎟️ Generar código de invitación</button>';});});}
function nuevaInv(){var roles=prompt('Roles separados por coma (vendedor,armador,instalador):','vendedor');if(!roles)return;
 var code=((DB.taller&&DB.taller.nombre)?DB.taller.nombre.slice(0,4).toUpperCase():'TALL')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
 SB.from('invites').insert({tenant_id:TENANT_ID,code:code,roles:roles}).then(function(r){if(r.error)alert(r.error.message);else renderMemb();});}
function anularInv(id){SB.from('invites').update({activo:false}).eq('id',id).then(renderMemb);}
function editarRoles(uid,rol){var n=prompt('Nuevos roles (coma):',rol);if(n===null)return;SB.from('tenant_users').update({rol:n}).eq('user_id',uid).then(renderMemb);}
function quitarMiembro(uid){if(!confirm('¿Quitar miembro?'))return;SB.from('tenant_users').delete().eq('user_id',uid).then(renderMemb);}
