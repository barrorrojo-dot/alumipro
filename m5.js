(function(){var rc=document.getElementById('rowConf');if(rc&&!document.getElementById('cMosqWrap')){
 var d=document.createElement('div');d.id='cMosqWrap';
 d.innerHTML='<label>MOSQUITERO</label><select id="cMosq" onchange="calc()"><option value="">Sin mosquitero</option><option value="1">Con mosquitero</option></select>';
 rc.appendChild(d);}})();
function formProduct(){var L=luzCalc();var vid=(DB.inv.vidrios||[]).find(function(v){return v.id==cVid.value;})||{n:'Claro 6mm'};
 return{tip:cTip.value,lin:cLin.value,W:L.W,H:L.H,med:L.med,grosor:L.grosor,conf:cConf.value,zoc:cZoc.value,
 col:cCol.value,vid:cVid.value,vidTxt:vid.n,cant:Math.max(1,+cCant.value||1),
 mosq:(document.getElementById('cMosq')?cMosq.value:'')};}
function kitItems(prod){
 var W=prod.W,H=prod.H,R=DB.recetas[prod.tip]||DB.recetas.cor2,P=DB.precios;
 var items=[];
 (R.perfiles||[]).forEach(function(p){
  var name=p.n,a=p.a;
  if(/Zócalo|Zoclo/.test(p.n)){
   if(prod.zoc=='P'){name=(prod.lin=='L25'?'Zoclo 2 Venas':'Zoclo 2 Venas 7842');a=76;}
   else{name=(prod.lin=='L25'?'Zoclo':'Zoclo 7835 (1 vena)');a=25;}
  }
  var lens=Array.isArray(p.f)?p.f.map(function(x){return F(x,W,H);}):Array(p.c||1).fill(F(p.f,W,H));
  var mTot=lens.reduce(function(s,b){return s+b;},0)/1000;
  items.push({n:name,d:lens.length+' pz: '+lens.join(' + ')+' mm',costo:mTot*(p.g=='marco'?P.marcoM:P.hojaM),g:p.g,lens:lens,a:a});
 });
 if(prod.tip=='cor2'||prod.tip=='cor20'){
  if(prod.conf=='1H'){items.forEach(function(it){if(/Traslape/.test(it.n)){it.n=it.n.replace('Traslape','Cerco Lateral');}});}
 }
 var vid=(DB.inv.vidrios||[]).find(function(v){return v.id==prod.vid;})||{p:380,n:'Claro 6mm',id:'v_claro6'};
 var vidM2=0;if(R.vidrio){var vw=F(R.vidrio.fW,W,H),vh=F(R.vidrio.fH,W,H);vidM2=vw*vh/1e6*R.vidrio.n;
  items.push({n:'Vidrio '+vid.n+' ('+vw+'×'+vh+'mm)',d:R.vidrio.n+' pz · '+vidM2.toFixed(2)+' m²',costo:vidM2*vid.p,vidM2:vidM2,g:'vidrio',vidId:vid.id});}
 var hojaA=H-10,hojaW=(W/2)-10,felpaM=Math.round(2*(hojaA+hojaW)*2/1000*1.1)||0,perimM=Math.round(2*(W+H)/1000);
 (R.herrajes||[]).forEach(function(h){var c=h.c;
  if(/carret/.test(h.n)&&prod.conf)c=(prod.conf=='2H')?4:2;
  c=(c=='felpa')?felpaM:((c=='perim')?perimM:c);
  items.push({n:h.n,d:c+(String(h.n).includes('(m)')?' m':' pz'),costo:c*h.p,un:c,g:'herr'});});
 if(prod.mosq){var mp=Math.round(2*(W+H)/1000);
  items.push({n:'Marco mosquitero',d:'perímetro '+mp+' m',costo:mp*P.hojaM,g:'marco',lens:[W,H,W,H],a:20});
  items.push({n:'Malla mosquitero (m²)',d:(W*H/1e6).toFixed(2)+' m²',costo:(W*H/1e6)*120,un:1,g:'herr'});}
 return{items:items,vidM2:vidM2,area:(W*H/1e6)};}
