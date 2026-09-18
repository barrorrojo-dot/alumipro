(function(){
 function mejor(a,b){var sa=(a.total||0)+((a.items&&a.items[0]&&a.items[0].kitRows&&a.items[0].kitRows.length)?1000:0);
  var sb=(b.total||0)+((b.items&&b.items[0]&&b.items[0].kitRows&&b.items[0].kitRows.length)?1000:0);return sa>=sb?a:b;}
 window.dedupCots=function(){var map={},n=0;(DB.cotizaciones||[]).forEach(function(c){
   if(map[c.id]){n++;map[c.id]=mejor(map[c.id],c);}else map[c.id]=c;});
  if(n){var arr=[];for(var k in map)arr.push(map[k]);arr.sort(function(a,b){return a.id-b.id;});DB.cotizaciones=arr;save();}
  return n;};
 window.repararCots=function(){var n=0;(DB.cotizaciones||[]).forEach(function(c){
  (c.items||[]).forEach(function(it){var bad=false,mat=0;
   try{mat=itemSubtotal(it).mat;if(!itemSubtotal(it).total)bad=true;}catch(e){bad=true;}
   if(!it.area||!it.kitRows||!it.kitRows.length||mat===0)bad=true;
   if(bad&&it.W&&it.H){var prod={tip:c.tip||'cor2',lin:c.lin||'L3',W:it.W,H:it.H,conf:c.conf||'2H',zoc:c.zoc||'V',col:c.col||'Natural',vid:c.vid||'v_claro6'};
    var k=kitItems(prod);it.kitRows=k.items;it.area=k.area||0;it.vidM2=k.vidM2||0;
    it.K={items:(it.kitRows||[]).map(function(r){return{n:r.n,d:r.d,costo:r.costo*(it.cant||1),g:r.g,lens:r.lens,vidM2:r.vidM2,un:r.un,p:r.p};}),area:it.area,vidM2:it.vidM2};
    n++;}});
  c.total=(c.items||[]).reduce(function(a,it){var s=0;try{s=itemSubtotal(it).total;}catch(e){}return a+s*(it.cant||1);},0);});
  if(n)save();return n;};
 function postCloud(){setTimeout(function(){var a=repararCots(),b=dedupCots();
  if(a||b){console.log('m15: reparadas',a,'· dedup',b);
   try{if(document.getElementById('cots').classList.contains('active'))go('cots');
       if(document.getElementById('taller').classList.contains('active')&&cur)abrirTaller(cur.id);}catch(e){}}},400);}
 var _lt=window.loadTenantState;
 if(_lt){window.loadTenantState=function(){var r=_lt.apply(this,arguments);
  if(r&&r.then)return r.then(function(x){postCloud();return x;});postCloud();return r;};}
 var _it=window.initTenant;
 if(_it){window.initTenant=function(){var r=_it.apply(this,arguments);
  if(r&&r.then)return r.then(function(x){postCloud();return x;});postCloud();return r;};}
})();
