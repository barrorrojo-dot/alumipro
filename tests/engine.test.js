const {
  F,
  optimizar,
  RECETAS_BASE,
  RECETAS_EXTRA,
} = require('../core/engine');

describe('F', () => {
  it('evalúa y redondea fórmulas conocidas con W/H', () => {
    expect(F('W-38', 1800, 1200)).toBe(1762);
    expect(F('(W/2)-30', 1800, 1200)).toBe(870);
    expect(F('(H/2)-35', 1800, 1201)).toBe(566);
  });
});

describe('optimizar', () => {
  it('descuenta kerf por cada corte y nunca excede la barra', () => {
    const result = optimizar([3000, 2000, 1000], [], 6100, 3.5);
    expect(result.barras).toHaveLength(1);
    expect(result.barras[0].t).toEqual([3000, 2000, 1000]);
    expect(result.barras[0].rest).toBeCloseTo(89.5);
    expect(result.barras[0].t.reduce((a, b) => a + b, 0) + 3.5 * 3)
      .toBeLessThanOrEqual(6100);
  });

  it('usa primero el retazo compatible más pequeño', () => {
    const retazos = [{ mm: 1500 }, { mm: 1100 }, { mm: 1300 }];
    const result = optimizar([1000], retazos, 6100, 4);
    expect(result.usados).toBe(1);
    expect(retazos[1]).toMatchObject({ used: true, rem: 96 });
    expect(result.barras).toHaveLength(0);
  });

  it('conserva como sobrantes únicamente restos de al menos 250 mm', () => {
    const retazos = [{ mm: 1300 }];
    const result = optimizar([1000, 5900], retazos, 6100, 4);
    const sobrantesRetazo = retazos.filter(r => r.used && r.rem >= 250).map(r => r.rem);
    const sobrantesBarra = result.barras.filter(b => b.rest >= 250).map(b => b.rest);
    expect(sobrantesRetazo).toEqual([296]);
    expect(sobrantesBarra).toEqual([]);
  });
});

describe('fuzz de recetas', () => {
  const recetas = { ...RECETAS_BASE, ...RECETAS_EXTRA };
  const barra = 6100;
  const kerf = 3.5;

  Object.entries(recetas).forEach(([key, receta], recipeIndex) => {
    it(`${key}: 500 combinaciones W/H producen cortes válidos`, () => {
      for (let i = 0; i < 500; i++) {
        // Secuencia determinista que cubre todo el rango sin aleatoriedad frágil.
        const W = 600 + ((i * 7919 + recipeIndex * 101) % 3401);
        const H = 600 + ((i * 6151 + recipeIndex * 211) % 3401);
        const cortes = receta.perfiles.flatMap(p => {
          if (Array.isArray(p.f)) return p.f.map(f => F(f, W, H));
          return Array(p.c || 1).fill(null).map(() => F(p.f, W, H));
        });

        expect(cortes.length).toBeGreaterThan(0);
        cortes.forEach(c => {
          expect(Number.isFinite(c)).toBe(true);
          expect(c).toBeGreaterThan(0);
        });

        const result = optimizar(cortes, [], barra, kerf);
        result.barras.forEach(b => {
          const ocupado = b.t.reduce((sum, corte) => sum + corte, 0) + b.t.length * kerf;
          expect(Number.isFinite(b.rest)).toBe(true);
          expect(ocupado).toBeLessThanOrEqual(barra);
          expect(b.rest).toBeCloseTo(barra - ocupado);
        });
      }
    });
  });
});