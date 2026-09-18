function cotTotal(c){if(!c)return 0;var t=0;(c.items||[]).forEach(function(it){try{t+=itemSubtotal(it).total*(it.cant||1);}catch(e){}});
 if(!t&&c.K&&c.K.items&&c.K.items.length){var mat=c.K.items.reduce(function(a,r){return a+(+r.costo||0);},0);
  var mo=(c.K.area||0)*(DB.precios.manoObraM2||0);var v=(mat+mo)*(1+(DB.precios.margen||0));t=v*(1+(DB.precios.iva||0));}
 return t;}
var _ab13=window.abrirTaller;window.abrirTaller=function(id){var r=_ab13(id);try{if(cur){cur.total=cotTotal(cur);save();renderFin();}}catch(e){}return r;};
var _rf13=window.renderFin;window.renderFin=function(){var r=_rf13();try{if(cur){var tot=cotTotal(cur),pag=cur.pagado||0;
 document.getElementById('tFin').innerHTML='<h3>💰 Finanzas</h3><p>Total: <b>$'+tot.toFixed(2)+'</b> · Anticipo/Pagado: <b style="color:#16A34A">$'+pag.toFixed(2)+'</b> · Saldo: <b style="color:#DC2626">$'+Math.max(0,tot-pag).toFixed(2)+'</b></p>';}}catch(e){}return r;};
var _gc13=window.guardarCot;window.guardarCot=function(){var r=_gc13();try{if(cur){cur.total=cotTotal(cur);save();}}catch(e){}return r;};
function nuevaCot(){cur={cliente:'',items:[]};draft=null;try{cCliente.value='';}catch(e){}go('cot');try{calc();}catch(e){}}
setInterval(function(){document.querySelectorAll('button').forEach(function(b){if(/Nueva Cotización/.test(b.textContent||'')&&!b._nc){b._nc=1;b.onclick=nuevaCot;}});},2500);
var st13=document.createElement('style');st13.textContent='@media print{body.pdfmode .screen{display:none!important}body.pdfmode #pdfCliente{position:static!important;inset:auto!important}}';document.head.appendChild(st13);
var _ep13=window.exportarPDF;window.exportarPDF=function(){try{var p=document.getElementById('pdfCliente');if(p)p.innerHTML='';}catch(e){}return _ep13();};
