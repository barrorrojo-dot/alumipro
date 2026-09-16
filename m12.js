function priceOf(r){var f=(DB.desc&&DB.desc.factorAluminio)||1;
 if(r.g=='marco')return DB.precios.marcoM*f;
 if(r.g=='hoja')return DB.precios.hojaM*f;
 if(r.g=='vidrio'){var v=DB.inv.vidrios.find(function(v){return v.n==r.n;});return v?v.p:0;}
 if(r.g=='herr'){var h=DB.inv.herrajes.find(function(h){return h.n==r.n;});return h?h.p:(r.p||0);}
 return r.p||0;}
function setFactor(v){DB.desc.factorAluminio=+v||1;recalcPending();save();renderAjt();}
function renderAjt(){var f=(DB.desc&&DB.desc.factorAluminio)||1;
 var h='<h3>📈 Índice de aluminio (ajuste diario)</h3>'+
 '<div class="row"><div><label>Factor</label><input type="number" step="0.01" value="'+f+'" onchange="setFactor(this.value)"></div>'+
 '<div style="display:flex;gap:6px;align-items:center"><button class="btn small" onclick="setFactor('+(f*0.98).toFixed(2)+')">−2%</button><button class="btn small" onclick="setFactor('+(f*1.02).toFixed(2)+')">+2%</button></div></div>'+
 '<p style="font-size:12px;color:#64748B">Marco efectivo: $'+(DB.precios.marcoM*f).toFixed(0)+'/m · Hoja efectiva: $'+(DB.precios.hojaM*f).toFixed(0)+'/m</p>'+
 '<h3>Precios y margen</h3>'+campos(DB.precios,'precios')+
 '<h3>Descuentos / kerf / holgura</h3>'+campos(DB.desc,'desc');
 document.getElementById('ajForm').innerHTML=h;
 ajRecetas.value=JSON.stringify(DB.recetas,null,1);}
