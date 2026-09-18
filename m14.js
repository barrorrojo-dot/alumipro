(function(){
 var _ki14=window.kitItems;window.kitItems=function(prod){var r=_ki14(prod);
  try{(r.items||[]).forEach(function(x){
    if(x.g=='herr'&&x.un>0&&!x.p)x.p=x.costo/x.un;
    if(x.g=='vidrio'&&x.vidM2>0&&!x.p)x.p=x.costo/x.vidM2;});}catch(e){}
  return r;};
 window.recost=function(r){var f=(DB.desc&&DB.desc.factorAluminio)||1;
  if(r.g=='marco'||r.g=='hoja'){var m=(r.lens||[]).reduce(function(a,b){return a+b;},0)/1000;
   r.costo=m*((r.g=='marco'?DB.precios.marcoM:DB.precios.hojaM)*f);return r.costo;}
  if(r.g=='vidrio'){r.costo=(r.vidM2||0)*(r.p||0);return r.costo;}
  if(r.g=='herr'){r.costo=(r.un||r.c||0)*(r.p||0);return r.costo;}
  return r.costo||0;};
 function flattenRows(it){var out=[];(it.kitRows||[]).forEach(function(r){out.push({n:r.n,d:r.d,costo:r.costo*(it.cant||1),g:r.g,lens:r.lens,vidM2:r.vidM2,un:r.un,p:r.p});});return out;}
 function rebuildItem(it,c){var prod={tip:c.tip||'cor2',lin:c.lin||'L3',W:it.W,H:it.H,conf:c.conf||'2H',zoc:c.zoc||'V',col:c.col||'Natural',vid:c.vid||'v_claro6'};
  var k=kitItems(prod);it.kitRows=k.items;it.area=k.area||it.area||0;it.vidM2=k.vidM2||0;
  it.K={items:flattenRows(it),area:it.area,vidM2:it.vidM2};return it;}
 window.repararCots=function(){var n=0;(DB.cotizaciones||[]).forEach(function(c){var ch=false;
   (c.items||[]).forEach(function(it){var t=0;try{t=itemSubtotal(it).total;}catch(e){}
     if(!t||!it.kitRows||!it.kitRows.length||!it.area){rebuildItem(it,c);ch=true;n++;}});
   if(ch){c.total=(c.items||[]).reduce(function(a,it){var s=0;try{s=itemSubtotal(it).total;}catch(e){}return a+s*(it.cant||1);},0);}});
  if(n){save();try{if(document.getElementById('taller').classList.contains('active')&&cur)abrirTaller(cur.id);else{renderElem();renderFin();}}catch(e){}}
  return n;};
 var _gc14=window.guardarCot;window.guardarCot=function(){try{if(cur)(cur.items||[]).forEach(function(it){if(!it.kitRows||!it.kitRows.length||!it.area)rebuildItem(it,cur);});}catch(e){}return _gc14();};
 var _t14=setInterval(function(){if(window.DB&&window.TENANT_ID&&DB.cotizaciones){clearInterval(_t14);
   if(!localStorage.getItem('reparado1')){var n=repararCots();localStorage.setItem('reparado1','1');if(n)console.log('m14: cotizaciones reparadas:',n);}}},1500);
})();
