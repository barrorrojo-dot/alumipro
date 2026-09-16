(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) {
    root.AlumiEngine = api;
    root.RECETAS_BASE = api.RECETAS_BASE;
    root.RECETAS_EXTRA = api.RECETAS_EXTRA;
    root.PROFW = api.PROFW;
    root.SWAP = api.SWAP;
    root.F = api.F;
    root.optimizar = function (cortes, retazos, barra, kerf, DB) {
      return api.optimizar(cortes, retazos, barra, kerf, DB || root.DB);
    };
    root.kitItems = function (prod, DB) {
      return api.kitItems(prod, DB || root.DB);
    };
    root.itemSubtotal = function (it, DB) {
      return api.itemSubtotal(it, DB || root.DB);
    };
    root.priceOf = function (r, DB) {
      return api.priceOf(r, DB || root.DB);
    };
    root.recost = function (r, DB) {
      return api.recost(r, DB || root.DB, root.priceOf);
    };
  }
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var RECETAS_BASE = {
    cor2: { nombre: 'Ventana Corrediza 3"', perfiles: [
      { n: 'Chambrana/Jamba 7825', g: 'marco', f: ['H', 'H'], a: 76 },
      { n: 'Riel Superior 9957', g: 'marco', f: 'W-38', c: 1, a: 76 },
      { n: 'Riel Inferior 9957', g: 'marco', f: 'W-38', c: 1, a: 76 },
      { n: 'Cerco Lateral 7847', g: 'hoja', f: 'H-10', c: 2, a: 27 },
      { n: 'Cerco Traslape 7848', g: 'hoja', f: 'H-10', c: 2, a: 35 },
      { n: 'Cabezal 7836', g: 'hoja', f: '(W/2)-10', c: 2, a: 25 },
      { n: 'Zócalo 7835', g: 'hoja', f: '(W/2)-10', c: 2, a: 25 }
    ], vidrio: { fW: '(W/2)-30', fH: 'H-35', n: 2 },
    herrajes: [{ n: 'Carretillas', c: 4, g: 'carretillas', p: 45 }, { n: 'Jaladera c/seguro', c: 2, g: 'jaladeras', p: 120 }, { n: 'Felpa (m)', c: 6, g: 'felpa', p: 6 }, { n: 'Seguro central', c: 1, g: null, p: 60 }, { n: 'Pijas', c: 5, g: null, p: 1 }] },
    cor20: { nombre: 'Ventana Corrediza 2" (Serie 20)', perfiles: [
      { n: 'Chambrana/Jamba 2"', g: 'marco', f: ['H', 'H'], a: 50 },
      { n: 'Riel Superior 2"', g: 'marco', f: 'W-38', c: 1, a: 50 },
      { n: 'Riel Inferior 2"', g: 'marco', f: 'W-38', c: 1, a: 50 },
      { n: 'Cerco Lateral', g: 'hoja', f: 'H-10', c: 2, a: 27 },
      { n: 'Cerco Traslape', g: 'hoja', f: 'H-10', c: 2, a: 28 },
      { n: 'Cabezal de hoja', g: 'hoja', f: '(W/2)-10', c: 2, a: 25 },
      { n: 'Zócalo', g: 'hoja', f: '(W/2)-10', c: 2, a: 25 }
    ], vidrio: { fW: '(W/2)-30', fH: 'H-35', n: 2 },
    herrajes: [{ n: 'Carretillas', c: 4, g: 'carretillas', p: 45 }, { n: 'Jaladera c/seguro', c: 1, g: 'jaladeras', p: 120 }, { n: 'Felpa (m)', c: 6, g: 'felpa', p: 6 }, { n: 'Seguro central', c: 1, g: null, p: 60 }, { n: 'Pijas', c: 5, g: null, p: 1 }] },
    fija: { nombre: 'Ventana Fija', perfiles: [
      { n: 'Chambrana/Jamba', g: 'marco', f: ['H', 'H'], a: 76 },
      { n: 'Cabezal de marco', g: 'marco', f: 'W-38', c: 1, a: 76 },
      { n: 'Zócalo de marco', g: 'marco', f: 'W-38', c: 1, a: 76 }
    ], vidrio: { fW: 'W-20', fH: 'H-20', n: 1 },
    herrajes: [{ n: 'Vinil/Calza (m)', c: 'perim', g: null, p: 9 }, { n: 'Silicón', c: 1, g: null, p: 90 }, { n: 'Pijas', c: 5, g: null, p: 1 }] },
    puerta: { nombre: 'Puerta Batiente', perfiles: [
      { n: 'Chambrana (Jamba)', g: 'marco', f: ['H', 'H'], a: 76 },
      { n: 'Cabezal de marco', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Umbral/Riel inferior', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Cerco Lateral', g: 'hoja', f: 'H-10', c: 2, a: 27 },
      { n: 'Cabezal de hoja', g: 'hoja', f: 'W-10', c: 1, a: 25 },
      { n: 'Zócalo de hoja', g: 'hoja', f: 'W-10', c: 1, a: 25 }
    ], vidrio: { fW: 'W-35', fH: 'H-35', n: 1 },
    herrajes: [{ n: 'Bisagras', c: 3, g: null, p: 60 }, { n: 'Chapa/Cerradura', c: 1, g: null, p: 180 }, { n: 'Felpa (m)', c: 5, g: 'felpa', p: 6 }, { n: 'Pijas', c: 7, g: null, p: 1 }, { n: 'Cierra-puertas', c: 1, g: null, p: 250 }] }
  };

  var RECETAS_EXTRA = {
    proy: { nombre: 'Ventana Proyectable', perfiles: [
      { n: 'Chambrana', g: 'marco', f: ['H', 'H'], a: 76 },
      { n: 'Cabezal de marco', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Zócalo de marco', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Cerco Lateral', g: 'hoja', f: 'H-12', c: 2, a: 27 },
      { n: 'Cabezal de hoja', g: 'hoja', f: 'W-12', c: 1, a: 25 },
      { n: 'Zócalo de hoja', g: 'hoja', f: 'W-12', c: 1, a: 25 }
    ], vidrio: { fW: 'W-37', fH: 'H-37', n: 1 },
    herrajes: [{ n: 'Brazo proyección', c: 1, g: null, p: 95 }, { n: 'Bisagras', c: 3, g: null, p: 60 }, { n: 'Felpa (m)', c: 5, g: 'felpa', p: 6 }, { n: 'Pijas', c: 4, g: null, p: 1 }] },
    guill: { nombre: 'Ventana Guillotina', perfiles: [
      { n: 'Chambrana (Jamba ranura)', g: 'marco', f: ['H', 'H'], a: 76 },
      { n: 'Cabezal de marco', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Riel inferior', g: 'marco', f: 'W-40', c: 1, a: 76 },
      { n: 'Cerco Lateral', g: 'hoja', f: '(H/2)-10', c: 4, a: 27 },
      { n: 'Cabezal de hoja', g: 'hoja', f: 'W-15', c: 2, a: 25 },
      { n: 'Zócalo de hoja', g: 'hoja', f: 'W-15', c: 2, a: 25 }
    ], vidrio: { fW: 'W-40', fH: '(H/2)-35', n: 2 },
    herrajes: [{ n: 'Balancín espiral', c: 2, g: null, p: 120 }, { n: 'Felpa (m)', c: 5, g: 'felpa', p: 6 }, { n: 'Pijas', c: 4, g: null, p: 1 }, { n: 'Seguros/Ganchos', c: 2, g: null, p: 35 }] }
  };

  var SWAP = {
    marco: ['Chambrana/Jamba 7825', 'Riel Inferior 9957', 'Tubo rect. 2"x1"', 'Zoclo comercial 4"'],
    hoja: ['Cerco Lateral 7847', 'Cerco Traslape 7848', 'Cabezal 7836', 'Intermedio', 'Zoclo Ventana 7835 (1 vena)', 'Zoclo 2 Venas 7842']
  };

  var PROFW = {
    'Chambrana/Jamba 7825': 76, 'Riel Inferior 9957': 76, 'Tubo rect. 2"x1"': 50, 'Zoclo comercial 4"': 100,
    'Cerco Lateral 7847': 27, 'Cerco Traslape 7848': 35, 'Cabezal 7836': 25, 'Intermedio': 25,
    'Zoclo Ventana 7835 (1 vena)': 25, 'Zoclo 2 Venas 7842': 25
  };

  function requireDB(DB, caller) {
    if (!DB) throw new Error(caller + ' requiere DB');
    return DB;
  }

  function F(f, W, H) {
    return Math.round(Function('W', 'H', 'return ' + f)(W, H));
  }

  function kitItems(prod, DB) {
    DB = requireDB(DB, 'kitItems');
    var W = prod.W, H = prod.H, R = DB.recetas[prod.tip] || DB.recetas.cor2, P = DB.precios;
    var raw = [];
    (R.perfiles || []).forEach(function (p) {
      var n = p.n, a = p.a || 40;
      var lens = Array.isArray(p.f) ? p.f.map(function (x) { return F(x, W, H); }) : Array(p.c || 1).fill(F(p.f, W, H));
      raw.push({ n: n, g: p.g, lens: lens, a: a });
    });
    var items = raw.map(function (r) {
      var mTot = r.lens.reduce(function (a, b) { return a + b; }, 0) / 1000;
      return { n: r.n, d: r.d || (r.lens.length + ' pz: ' + r.lens.join(' + ') + ' mm'), costo: mTot * (r.g === 'marco' ? P.marcoM : P.hojaM), g: r.g, len: r.lens[0], lens: r.lens, cant: r.lens.length, a: r.a };
    });
    var vid = (DB.inv.vidrios || []).find(function (v) { return v.id === prod.vid; }) || { p: 380, n: 'Claro 6mm', id: 'v_claro6' };
    var vidM2 = 0;
    if (R.vidrio) {
      var vw = F(R.vidrio.fW, W, H), vh = F(R.vidrio.fH, W, H);
      vidM2 = vw * vh / 1e6 * R.vidrio.n;
      items.push({ n: 'Vidrio ' + vid.n + ' (' + vw + '×' + vh + 'mm)', d: R.vidrio.n + ' pz · ' + vidM2.toFixed(2) + ' m²', costo: vidM2 * vid.p, vidM2: vidM2, g: 'vidrio', vidId: vid.id });
    }
    var hojaA = H - 10, hojaW = (W / 2) - 10;
    var felpaM = Math.round(2 * (hojaA + hojaW) * 2 / 1000 * 1.1) || 0;
    var perimM = Math.round(2 * (W + H) / 1000);
    (R.herrajes || []).forEach(function (h) {
      var c = h.c;
      if (/carret/.test(h.n) && prod.conf) c = prod.conf === '2H' ? 4 : 2;
      c = c === 'felpa' ? felpaM : (c === 'perim' ? perimM : c);
      items.push({ n: h.n, d: c + (String(h.n).includes('(m)') ? ' m' : ' pz'), costo: c * h.p, un: c, g: 'herr' });
    });
    return { items: items, vidM2: vidM2, area: W * H / 1e6 };
  }

  function itemSubtotal(it, DB) {
    DB = requireDB(DB, 'itemSubtotal');
    var mat = (it.kitRows || []).reduce(function (a, r) { return a + r.costo; }, 0);
    var mo = (it.area || 0) * DB.precios.manoObraM2;
    var venta = (mat + mo) * (1 + DB.precios.margen);
    var iva = venta * DB.precios.iva;
    return { mat: mat, mo: mo, venta: venta, iva: iva, total: venta + iva };
  }

  function priceOf(r, DB) {
    DB = requireDB(DB, 'priceOf');
    if (r.g === 'marco') return DB.precios.marcoM;
    if (r.g === 'hoja') return DB.precios.hojaM;
    if (r.g === 'vidrio') {
      var v = DB.inv.vidrios.find(function (vid) { return vid.n === r.n; });
      return v ? v.p : 0;
    }
    if (r.g === 'herr') {
      var h = DB.inv.herrajes.find(function (her) { return her.n === r.n; });
      return h ? h.p : (r.p || 0);
    }
    return r.p || 0;
  }

  function recost(r, DB, priceResolver) {
    DB = requireDB(DB, 'recost');
    var resolvePrice = priceResolver || priceOf;
    if (r.g === 'marco' || r.g === 'hoja') {
      var m = (r.lens || []).reduce(function (a, b) { return a + b; }, 0) / 1000;
      r.costo = m * resolvePrice(r, DB);
    } else if (r.g === 'vidrio') {
      r.costo = (r.vidM2 || 0) * resolvePrice(r, DB);
    } else {
      r.costo = (r.un || 0) * resolvePrice(r, DB);
    }
    return r;
  }

  function optimizar(cortes, retazos, barra, kerf, DB) {
    DB = DB || {};
    barra = barra || ((DB.desc && DB.desc.largoBarra) || 6100);
    kerf = kerf || ((DB.desc && DB.desc.kerf) || 3.5);
    var s = (cortes || []).slice().sort(function (a, b) { return b - a; }), bs = [], usados = 0;
    s.forEach(function (c) {
      if (retazos) {
        var cand = retazos.filter(function (r) { return r.mm >= c && !r.used; }).sort(function (a, b) { return a.mm - b.mm; })[0];
        if (cand) {
          cand.used = true;
          usados++;
          cand.rem = cand.mm - c - kerf;
          return;
        }
      }
      var b = bs.find(function (x) { return x.rest >= c + kerf; });
      if (b) {
        b.t.push(c);
        b.rest -= c + kerf;
      } else {
        bs.push({ t: [c], rest: barra - c - kerf });
      }
    });
    return { barras: bs, usados: usados };
  }

  return {
    RECETAS_BASE: RECETAS_BASE,
    RECETAS_EXTRA: RECETAS_EXTRA,
    PROFW: PROFW,
    SWAP: SWAP,
    F: F,
    optimizar: optimizar,
    kitItems: kitItems,
    itemSubtotal: itemSubtotal,
    recost: recost,
    priceOf: priceOf
  };
});