function freshDB(){return{
 precios:{marcoM:92,hojaM:78,manoObraM2:250,margen:0.35,iva:0.16},
 lineas:{L3:{prof:76},L25:{prof:50}},
 desc:{kerf:3.5,largoBarra:6100,holguraMarco:20},
 recetas:Object.assign({},RECETAS_BASE,RECETAS_EXTRA),
 inv:{perfiles:[],herrajes:[],vidrios:[mkIt('v_claro6','Claro 6mm','m²',120,40,null,380)],consumibles:[]},
 clientes:[],cotizaciones:[],pedidos:[],sigCot:1000,proveedores:[],priceHistory:[]};}
function save(){try{localStorage.setItem('alumipro_'+(TENANT_ID||'local'),JSON.stringify(DB));}catch(e){} cloudSave();}
function cargarRoles(){if(!SB||!SESSION){window.ROLES=['nuevo'];if(window.aplicarNav)aplicarNav();return;}
 SB.from('tenant_users').select('rol').eq('user_id',SESSION.id).maybeSingle().then(function(r){
  window.ROLES=r.data?(r.data.rol||'').split(',').map(function(s){return s.trim();}).filter(Boolean):['nuevo'];
  if(window.aplicarNav)aplicarNav();});}
var _m9=setInterval(function(){if(window.SB){clearInterval(_m9);
 var scoped=null;try{scoped=JSON.parse(localStorage.getItem('alumipro_'+(TENANT_ID||'local'))||'null');}catch(e){}
 if(!TENANT_ID){DB=scoped||freshDB();}
 if(window.SESSION){initTenant().then(function(){refreshBrand();});}
}},600);
(function(){var o=document.getElementById('onb');if(o){var h=o.querySelector('h2');if(h)h.textContent='🏭 Bienvenido: únete a tu taller o registra uno nuevo';}})();
