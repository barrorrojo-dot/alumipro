# AlumiPro core engine — reporte de pruebas

## Alcance

- Extracción UMD/CommonJS de las funciones puras y catálogos de recetas.
- Compatibilidad Node mediante `module.exports`.
- Compatibilidad browser mediante `window.AlumiEngine` y los nombres globales históricos.
- Sin cambios intencionales en la interfaz ni en los flujos visibles.

## Suite

Comando:

```sh
npm test
```

Casos cubiertos:

1. `F()` con fórmulas conocidas de ancho y alto.
2. `optimizar()`:
   - descuento de kerf por corte;
   - selección del retazo compatible más pequeño;
   - clasificación de sobrantes con umbral de 250 mm.
3. FUZZ determinista:
   - todas las recetas de `RECETAS_BASE` y `RECETAS_EXTRA`;
   - 500 combinaciones W/H por receta;
   - rango 600–4000 mm;
   - todos los cortes son finitos y mayores que cero;
   - ninguna barra supera 6100 mm considerando kerf;
   - ningún resultado contiene `NaN` o `Infinity`.

## Resultado

Ejecutado en la rama `core-engine`:

```text
Test Files  1 passed (1)
Tests       10 passed (10)
Duration    1.18s
```

El FUZZ ejecutó 500 combinaciones para cada una de las seis recetas:

- `cor2`
- `cor20`
- `fija`
- `puerta`
- `proy`
- `guill`

Total: 3,000 combinaciones W/H verificadas.

Validaciones adicionales:

- `node --check core/engine.js`: correcto.
- Carga UMD en un contexto browser simulado: correcto.
- Globals históricos disponibles: `F`, `optimizar`, `kitItems`,
  `itemSubtotal`, `recost`, `priceOf`, `RECETAS_BASE`, `RECETAS_EXTRA`,
  `PROFW` y `SWAP`.
- Ninguna de las definiciones extraídas permanece duplicada en `index.html`.