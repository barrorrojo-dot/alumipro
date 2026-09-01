(function(){var t=document.getElementById('taller');if(t&&!document.getElementById('btnLink')){var card=t.querySelector('.card');
 var row=document.createElement('div');row.className='row';
 row.innerHTML='<button class="btn small" onclick="publishLink()">🔗 Link del cliente</button> <button class="btn small" onclick="verEventos()">📥 Ver confirmaciones</button>';
 card.insertBefore(row,card.querySelector('.btn.navy'));}})();
function buildShare(){var c=cur,t=DB.taller||{};
 var items=(c.items||[]).map(function(it){return{n:prodName(it),med:it.W+'×'+it.H,est:it.estado||c.estado};});
 var ord=null;DB.pedidos.forEach(function(p){if(p.cotId==c.id)ord=p;});
 var corte='';if(ord&&ord.tasks)corte=ord.tasks.filter(function(x){return x.done;}).length+'/'+ord.tasks.length;
 var cat=Object.entries(DB.recetas).map(function(e){return{n:e[1].nombre};});
 return{taller:{nombre:t.nombre,tagline:t.tagline,logo:t.logo},
  cot:{id:c.id,cliente:c.cliente,estado:c.estado,total:c.total||0,pagado:c.pagado||0,saldo:Math.max(0,(c.total||0)-(c.pagado||0)),items:items},
  avance:{corte:corte,orden:ord?ord.estado:'',instalacion:(c.inst&&c.inst.fecha)||''},
  catalog:cat,whatsapp:(t.tel||'')};}
function publishLink(){if(!cur)return;
 var tok=cur.shareToken||('c'+cur.id+'-'+Math.random().toString(36).slice(2,8));cur.shareToken=tok;save();
 SB.from('shares').upsert({token:tok,tenant_id:TENANT_ID,cot_id:cur.id,data:buildShare()}).then(function(r){
  if(r.error){alert(r.error.message);return;}
  prompt('Link del cliente (cópialo y envíaselo por WhatsApp):',location.origin+'/hermana.html?token='+tok);});}
function verEventos(){if(!cur||!cur.shareToken){alert('Primero genera el link del cliente.');return;}
 SB.from('client_events').select('*').eq('token',cur.shareToken).order('created_at').then(function(r){
  alert(((r.data||[]).map(function(e){return '• '+e.tipo+(e.monto?' $'+e.monto:'')+(e.msg?' — '+e.msg:'')+' · '+new Date(e.created_at).toLocaleString();}).join('\n'))||'Sin eventos del cliente.');});}
