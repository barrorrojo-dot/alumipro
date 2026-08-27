var CORTE={
 jamba:{k:1.7,w:76.2,h:25.4,name:'JAMBA 7825',d:"M0 6 H76.2 M0 6 V25.4 H6 V18 M76.2 6 V25.4 H70.2 V18 M38.1 6 V20 M32 20 H44.2 M32 20 V16 M44.2 20 V16 M20 6 V10 A3 3 0 1 0 26 10 V6 M56 6 V10 A3 3 0 1 0 62 10 V6"},
 riel:{k:1.7,w:76.2,h:25.4,name:'RIEL 9957',d:"M0 8 H45 V12 H76.2 M0 8 V25.4 H6 V16 M76.2 12 V25.4 H70.2 V18 M30 8 V4 A2.5 2.5 0 1 1 35 4 V8 M20 8 V12 H25 V8"},
 zoclo:{k:2.0,w:25.4,h:49.4,name:'ZOCLO 7835',d:"M0 0 H25.4 M0 0 V49.4 M25.4 0 V12 H20 V6 M3 0 V5 H8 V0 M17.4 0 V5 H12.4 V0 M12.7 0 V6 M9 6 A3.7 3.7 0 1 0 16.4 6"},
 traslape:{k:1.7,w:35.1,h:51.2,name:'TRASLAPE 7848',d:"M0 0 H30 M0 0 V51.2 M30 0 V16 H35.1 V28 H30 V36 M3 0 V5 H8 V0 M27 0 V5 H22 V0 M15 0 V8 M11.3 8 A3.7 3.7 0 1 0 18.7 8 M30 44 V51.2 H25"},
 cerco:{k:1.6,w:27.2,h:65,name:'CERCO 7847',d:"M2 2 H25.2 M0 2 V8 H4 V4 M27.2 2 V8 H23.2 V4 M4 2 V63 M23.2 2 V63 M2 63 H25.2 M0 63 V57 H4 V61 M27.2 63 V57 H23.2 V61"},
 zoclo2:{k:1.5,w:25.4,h:76.2,name:'ZOCLO 2 VENAS 7842',d:"M0 0 H25.4 M0 0 V76.2 M25.4 0 V76.2 M3 0 V5 H8 V0 M17.4 0 V5 H12.4 V0 M12.7 0 V16 M9 16 A3.7 3.7 0 1 0 16.4 16 M12.7 34 V42 M9 42 A3.7 3.7 0 1 0 16.4 42"},
 cabezal:{k:2.0,w:25.4,h:37.4,name:'CABEZAL 7836',d:"M0 0 H25.4 M0 0 V37.4 M25.4 0 V14 H20 V6 M3 0 V5 H8 V0 M17.4 0 V5 H12.4 V0 M12.7 0 V10 M9 10 A3.7 3.7 0 1 0 16.4 10"}};
var SAW='<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#E2E8F0" stroke="#475569"/><g stroke="#475569"><line x1="8" y1="1" x2="8" y2="3"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="1" y1="8" x2="3" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/></g><circle cx="8" cy="8" r="2" fill="#F97316"/></svg>';
var CHK='<svg width="14" height="14" viewBox="0 0 16 16"><path d="M2 8 l4 4 8-8" stroke="#fff" stroke-width="3" fill="none"/></svg>';
var curOrden=null;
function orderTasks(p){if(p.tasks)return p.tasks;var t=[];(p.plan||[]).forEach(function(pr){(pr.barras||[]).forEach(function(b,bi){(b.t||[]).forEach(function(len,ci){t.push({perfil:pr.n,g:pr.g,medida:len,barra:bi,tramo:ci,done:false});});});});p.tasks=t;return t;}
function claveDe(n){var m=String(n).match(/\d{3,4}/);return (m?m[0]:String(n).slice(0,4)).toUpperCase();}
function seccionDe(t){return t.g=='marco'?'Contramarco':'Hoja';}
function abrirOrden(i){curOrden=i;var p=DB.pedidos[i];var c=DB.cotizaciones.find(function(x){return x.id==p.cotId;});
 orderTasks(p);go('ord');
 document.getElementById('ordTitulo').textContent='Orden #'+p.id+' · '+(c?c.cliente:'');
 document.getElementById('ordEstado').innerHTML='Estado: <span class="tag '+tagEst(p.estado)+'">'+p.estado+'</span> · Perfiles cortados: '+p.tasks.filter(function(t){return t.done;}).length+'/'+p.tasks.length;
 document.getElementById('btnTerm').style.display=(p.estado=='En armado')?'flex':'none';}
function renderCorte(){var p=DB.pedidos[curOrden];if(!p)return;var t=orderTasks(p);var LB=(DB.desc&&DB.desc.largoBarra)||6100;
 var done=t.filter(function(x){return x.done;}).length;
 var secs={};t.forEach(function(x,i){var s=seccionDe(x);(secs[s]=secs[s]||[]).push([x,i]);});
 var h='<p><b>'+done+'/'+t.length+'</b> perfiles cortados</p>';
 Object.keys(secs).forEach(function(s){h+='<h3>'+s+'</h3>';secs[s].forEach(function(pair){var x=pair[0],i=pair[1];
  h+='<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #e2e8f0">'+
   '<button class="btn small" onclick="verPerfil('+i+')">'+claveDe(x.perfil)+'</button>'+
   '<div style="flex:1">'+x.perfil+'<br><small>Barra '+(LB/1000).toFixed(2)+' m → Tramo <b>'+x.medida+' mm</b></small></div>'+
   '<button class="btn small" style="'+(x.done?'background:#16A34A':'')+'" onclick="sawToggle('+i+')">'+SAW+(x.done?' '+CHK:'')+'</button></div>';});});
 document.getElementById('corteCont').innerHTML=h;}
function sawToggle(i){var p=DB.pedidos[curOrden];var t=orderTasks(p);t[i].done=!t[i].done;
 if(t.every(function(x){return x.done;})&&p.estado=='En Corte'){p.estado='En armado';alert('✔ Todos los perfiles cortados. Orden → En armado.');}
 save();renderCorte();abrirOrden(curOrden);}
function terminarCorte(){var p=DB.pedidos[curOrden];var t=orderTasks(p);var done=t.filter(function(x){return x.done;}).length;
 if(done<t.length){if(!confirm('Aún no ha terminado de cortar todos los perfiles ('+done+'/'+t.length+'). ¿Desea terminar el proceso de corte?'))return;}
 t.forEach(function(x){x.done=true;});p.estado='En armado';save();showCorteDone();}
function showCorteDone(){go('pmod');document.getElementById('pmodBack').setAttribute('onclick',"go('home')");
 document.getElementById('pmodTitulo').textContent='Proceso de corte terminado';
 document.getElementById('pmodCont').innerHTML='<p>✔ Proceso de corte terminado</p>'+miniWin()+'<button class="btn" onclick="go(\'home\')">Ir a Inicio</button>';}
function miniWin(){var c=DB.cotizaciones.find(function(x){return x.id==DB.pedidos[curOrden].cotId;});var it=(c&&c.items&&c.items[0])?c.items[0]:null;
 if(!it)return '';var el=document.createElement('div');try{render3d(it,el);}catch(e){}return el.innerHTML;}
function terminarArmado(){var p=DB.pedidos[curOrden];p.estado='En instalación';save();abrirOrden(curOrden);}
function wastePct(p){var LB=(DB.desc&&DB.desc.largoBarra)||6100;var totBar=0,totCut=0;
 (p.plan||[]).forEach(function(pr){(pr.barras||[]).forEach(function(b){totBar+=LB;totCut+=(b.t||[]).reduce(function(a,c){return a+c;},0);});});
 if(!totBar)return 0;return Math.max(0,Math.round((1-totCut/totBar)*100));}
function aggregateFor(c){var prev=cur;cur=c;var a=aggregate();cur=prev;return a;}
function renderDesg(mode){var p=DB.pedidos[curOrden];if(!p)return;
 document.getElementById('desgWaste').innerHTML='Desperdicio acumulado: <b>'+wastePct(p)+'%</b>';
 var h='';
 if(mode=='tramos'){h='<table><tr><th>Clave</th><th>Nombre</th><th>Barra</th><th>Tramo</th></tr>';
  orderTasks(p).forEach(function(x,i){var LB=(DB.desc&&DB.desc.largoBarra)||6100;
   h+='<tr><td><button class="btn small" onclick="verTramo('+i+')">'+claveDe(x.perfil)+'</button></td><td>'+x.perfil+'</td><td>'+(LB/1000).toFixed(2)+' m</td><td>'+x.medida+' mm</td></tr>';});
  h+='</table>';}
 else{var c=DB.cotizaciones.find(function(x){return x.id==p.cotId;});var agg=c?aggregateFor(c):{herr:[]};
  h='<ul>'+agg.herr.map(function(x){return '<li>'+x.n+' × '+x.un+'</li>';}).join('')+'</ul>';}
 document.getElementById('desgCont').innerHTML=h;}
function verTramos(){renderDesg('tramos');}
function verHerrajes(){renderDesg('herr');}
function verTramo(i){var p=DB.pedidos[curOrden];var t=orderTasks(p);var x=t[i];var LB=(DB.desc&&DB.desc.largoBarra)||6100;
 var bar=null;(p.plan||[]).forEach(function(pr){if(pr.n==x.perfil&&pr.barras&&pr.barras[x.barra])bar=pr.barras[x.barra];});
 go('tramo');
 var h='<p><b>'+claveDe(x.perfil)+'</b> · '+x.perfil+'</p><p>Holgura del disco: 0.5 cm</p>'+
 '<p style="font-size:20px;font-weight:800;color:var(--blue)">Tramo #'+(i+1)+' · '+x.medida+' mm</p>';
 if(bar){h+='<div class="bar">'+bar.t.map(function(len,ci){return '<div class="seg" style="width:'+(len/LB*100)+'%;'+(ci==x.tramo?'outline:3px solid #F97316':'')+'"></div><div class="cut"></div>';}).join('')+(bar.rest>0?'<div class="rest" style="width:'+(bar.rest/LB*100)+'%"></div>':'')+'</div><small>Antes: barra '+(LB/1000).toFixed(2)+' m · Después: tramo '+x.medida+' mm (resaltado) · sobrante '+bar.rest+' mm</small>';}
 document.getElementById('tramoCont').innerHTML=h;}
function crossSvg(n){var key=null;var s=String(n).toLowerCase();
 if(/jamba|chambrana/.test(s))key='jamba';else if(/riel/.test(s))key='riel';else if(/zoclo 2/.test(s))key='zoclo2';else if(/zoclo/.test(s))key='zoclo';else if(/traslape/.test(s))key='traslape';else if(/cerco/.test(s))key='cerco';else if(/cabezal/.test(s))key='cabezal';
 if(!key)return '<p>(sin sección)</p>';
 var d=CORTE[key];var k=1.5;
 return '<svg width="'+(d.w*k+20)+'" height="'+(d.h*k+20)+'" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px"><g transform="translate(10,10) scale('+k+')"><path d="'+d.d+'" fill="none" stroke="#1F2937" stroke-width="1.4" vector-effect="non-scaling-stroke"/></g></svg>';}
function verPerfil(i){var p=DB.pedidos[curOrden];var t=orderTasks(p);var x=t[i];
 go('pmod');document.getElementById('pmodBack').setAttribute('onclick',"go('corte')");
 document.getElementById('pmodTitulo').textContent='Perfil '+claveDe(x.perfil);
 document.getElementById('pmodCont').innerHTML=crossSvg(x.perfil)+'<p><b>'+x.perfil+'</b><br>Clave: '+claveDe(x.perfil)+'<br>Antes: barra '+(((DB.desc&&DB.desc.largoBarra)||6100)/1000).toFixed(2)+' m · Después: <b>'+x.medida+' mm</b></p>';}
