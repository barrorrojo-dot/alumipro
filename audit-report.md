# Auditoría estática de AlumiPro

**Rama base revisada:** `main`  
**Commit base:** `b0bb517b8ed6a0bfe0b9a1a3d5dfc983f5c89413`  
**Alcance:** `index.html`, `hermana.html`, `m3.js`–`m12.js`  
**Método:** análisis estático, sin modificar código ni datos.

## Resumen ejecutivo

Hallazgos principales:

1. Hay **siete sobrescrituras silenciosas** de funciones globales. Cinco cambian
   comportamiento de forma relevante según el orden de carga: `save`,
   `cargarRoles`, `verEventos`, `renderRep` y `priceOf`.
2. No se confirmó una colección amplia de globales sin uso. El código muerto
   verificable está concentrado en las implementaciones reemplazadas por
   declaraciones posteriores.
3. No existe una función central de escape o sanitización. Se identificaron
   múltiples sinks `innerHTML` persistentes, varios alimentados por
   `localStorage`, Supabase, formularios, `prompt()` y eventos enviados por
   clientes anónimos.
4. El repositorio no contiene migraciones, funciones SQL ni políticas RLS.
   Por tanto, **no es posible confirmar el estado real de RLS**. El cliente
   contiene operaciones que sólo son seguras si existen políticas estrictas
   no versionadas.

---

## 1. Funciones sobrescritas y riesgos de orden de carga

Los scripts se cargan al final de `index.html` en este orden:
`m3.js`, `m4.js`, `m5.js`, `m6.js`, `m7.js`, `m8.js`, `m9.js`, `m10.js`,
`m11.js`, `m12.js` (`index.html:999-1008`).

Como todo se ejecuta en el ámbito global, la última declaración con el mismo
nombre reemplaza a las anteriores.

| Función | Primera definición | Definición efectiva | Diferencia/riesgo |
|---|---:|---:|---|
| `formProduct` | `index.html:598` | `m5.js:5` | La versión de `m5.js` añade `mosq`. Cambiar sólo la versión inline no cambia el comportamiento final. |
| `kitItems` | `index.html:601` | `m5.js:9` | La versión de `m5.js` añade sustitución de zócalos, configuración de hojas y mosquitero. La implementación inline queda muerta. |
| `save` | `index.html:416` | `m9.js:8` | **Alto.** Cambia la clave de persistencia de `alumiproV10` a `alumipro_<tenant>`. Si cambia el orden o falla `m9.js`, se puede leer/escribir otro almacén local. |
| `cargarRoles` | `m7.js:8` | `m9.js:9` | La última versión añade el estado `nuevo` y llama `aplicarNav`. Una ejecución temprana puede usar reglas distintas. |
| `verEventos` | `m8.js:19` | `m8.js:33` | **Alto.** La segunda declaración del mismo archivo elimina el guard de `shareToken` y cambia la consulta a una lista de tokens. |
| `renderRep` | `index.html:982` | `m11.js:1` | Sustituye por completo el reporte simple por el reporte de proyectos. La versión inline nunca es efectiva al terminar la carga. |
| `priceOf` | `index.html:629` | `m12.js:1` | La versión final aplica `DB.desc.factorAluminio`. Si `m12.js` no carga, el recosteo usa precios sin factor. |

### Riesgos generales

- No hay módulos, imports ni namespace que hagan explícita la dependencia.
- Un error de sintaxis o red en un archivo intermedio deja activa una versión
  anterior con otra semántica.
- Las pruebas o cambios sobre la primera definición pueden dar una falsa
  sensación de cobertura.
- El comportamiento depende del orden físico de etiquetas `<script>`.
- `save` y `priceOf` afectan persistencia y precios, por lo que una regresión
  de carga puede producir pérdida aparente de datos o importes incorrectos.

---

## 2. Código muerto y globales no usados

### Código muerto confirmado por sobrescritura

Los siguientes cuerpos quedan inaccesibles después de completar la carga:

- `formProduct` de `index.html:598`.
- `kitItems` de `index.html:601`.
- `save` de `index.html:416`.
- `cargarRoles` de `m7.js:8`.
- La primera `verEventos` de `m8.js:19`.
- `renderRep` de `index.html:982`.
- `priceOf` de `index.html:629`.

Las referencias posteriores al nombre global resuelven a la última definición,
no a estos cuerpos.

### Globales definitivamente no usados

No se confirmó ninguno mediante búsqueda exhaustiva de declaraciones y
referencias en `index.html`, HTML inline y `m3.js`–`m12.js`.

Esto incluye funciones que parecen no tener llamadas JavaScript directas pero
son usadas desde atributos `onclick`, `onchange`, `oninput` o HTML generado.
Ejemplos: `login`, `signup`, `abrirMemb`, `calc`, `guardarCot`, `setEstado`,
`convertirOrden`, `exportarPDF`, `toggleCheck` y `setFactor`.

### Elementos que no deben clasificarse como muertos sin instrumentación

- Funciones invocadas desde atributos de evento generados con strings.
- Globals consumidos indirectamente por elementos con `id`, que el navegador
  expone como propiedades de `window`.
- Inicializadores diferidos con `setInterval`, como `_m9` (`m9.js:13`).

**Conclusión:** el problema demostrable no es una gran cantidad de símbolos sin
referencias, sino los cuerpos reemplazados y el acoplamiento global implícito.

---

## 3. Riesgos XSS por `innerHTML`

### Condición general

No se encontró helper de escape HTML, escape de atributos ni sanitizador.
`DB` puede provenir de `localStorage` y de `tenant_state.data` en Supabase
(`index.html:411-416`). Los datos guardados desde formularios y `prompt()`
deben considerarse no confiables.

### Sinks vulnerables en `index.html`

| Línea | Sink/datos interpolados | Contexto | Severidad |
|---:|---|---|---|
| 425, 436 | `obLogoPrev.innerHTML`; `DB.taller.logo` o valor persistido | `img src` sin validar protocolo ni escapar atributo | Alta |
| 505 | `provList.innerHTML`; nombres, unidades y precios de proveedores | Texto HTML | Alta |
| 507 | `prProv.innerHTML`; `p.n` | Texto y `option value` | Alta |
| 512 | `priceHist.innerHTML`; nombre/proveedor/historial | Texto y posibles atributos | Alta |
| 527-528 | `logoLogin`/`homeLogo`; salida de `logoH()`/`brandH()` | Nombre/logo del taller persistido | Alta |
| 566 | `listaClientes.innerHTML`; `DB.clientes[].n` | `option value` y texto | Alta |
| 567 | `cVid.innerHTML`; `v.id`, `v.n`, `v.p` | Atributo y texto | Alta |
| 572, 576 | `ultCots`; cliente, estado y datos de cotización | Texto + HTML generado | Alta |
| 585 | `catProds.innerHTML`; recetas, nombres y descripciones | Texto HTML | Alta |
| 587 | `cliList.innerHTML`; nombre, teléfono y dirección | Texto y handlers inline | Alta |
| 655 | `kitTabla.innerHTML`; nombres/detalles de receta e inventario | Texto y controles generados | Alta |
| 659 | `prodList.innerHTML`; productos, notas y datos de cotización | Texto y atributos | Alta |
| 856, 876 | `tDespiece.innerHTML`; nombres y detalles de materiales | Texto HTML | Alta |
| 862 | `el.innerHTML`; filas de cotización/proyecto | Texto HTML | Alta |
| 909 | `optHead.innerHTML`; marca, cliente, color y cotización | Texto/logo | Alta |
| 911 | `planoSel.innerHTML`; nombre del producto y medidas | Texto de `option` | Alta |
| 921 | `optBody.innerHTML`; orden, perfiles y materiales | Texto, estilos y atributos | Alta |
| 933 | `pdfCliente.innerHTML`; marca, cliente, productos y firma | Texto e `img src` | Alta/Crítica |
| 966 | `pedLista.innerHTML`; cliente, estado y orden | Texto + handlers inline | Alta |
| 978 | `invTabla.innerHTML`; nombres, acabados y retazos | Texto, atributos y handlers inline | Alta |
| 988 / `m12.js:15` | `ajForm.innerHTML`; keys/valores de `DB.precios` y `DB.desc` a través de `campos()` | `label`, `value` y `onchange` | Crítica si `DB` es manipulable |

### Sinks vulnerables en módulos

| Archivo/línea | Datos interpolados | Severidad |
|---|---|---|
| `m3.js:18` | `p.estado` en `ordEstado` | Alta |
| `m3.js:29` | perfil y tareas de orden en `corteCont` | Alta |
| `m3.js:55` | nombres de perfiles/herrajes en `desgCont` | Alta |
| `m3.js:64` | perfil de tramo en `tramoCont` | Alta |
| `m3.js:73` | perfil en `pmodCont` | Alta |
| `m4.js:23` | cliente y estado en `instInfo` | Alta |
| `m4.js:25` | texto de checklist en `instCheck` | Alta |
| `m4.js:26` | URLs de fotos en `img src` | Alta/Crítica |
| `m4.js:27` | firma en `img src` | Alta/Crítica |
| `m4.js:45-50` | marca, cliente y firma en recibo | Alta/Crítica |
| `m6.js:16-18` | nombre/proveedor del libro de precios | Alta |
| `m7.js:35-36` | IDs, roles y códigos de invitación de Supabase | Crítica |
| `m10.js:14-20` | `client_events`: `tipo`, `monto` y JSON con nombre, notas, medidas y acabado | **Crítica; origen anónimo/Supabase** |
| `m11.js:23` | cliente y estado en reporte | Alta |
| `m12.js:15` | valores y propiedades persistidas de ajustes | Crítica |

### Sinks vulnerables en `hermana.html`

| Línea | Datos interpolados | Severidad |
|---:|---|---|
| 36 | `shares.data.taller`: logo, nombre y tagline | Alta/Crítica |
| 40-43 | cotización compartida: cliente, estado, items y medidas | Crítica |
| 44-46 | estado de cuenta; mayormente numérico, dentro de bloque dinámico | Media |
| 60-62 | `D.catalog[]` desde Supabase | Alta |

Los bloques estáticos de `hermana.html:31,33,48,50,57` no interpolan datos
externos y no se consideran vulnerables por sí mismos.

### Sinks de bajo riesgo o estáticos

- `index.html:657`: totales formateados numéricamente.
- `index.html:752`, `865`, `903`, `907`, `984`: geometría, contadores o texto
  fijo, siempre que las variables permanezcan estrictamente numéricas.
- `m3.js:47`: porcentaje calculado.
- Estructuras fijas creadas en `m4.js:6`, `m5.js:3`, `m6.js:30`,
  `m7.js:5`, `m8.js:3` y `m10.js:2`.

### Vectores de mayor prioridad

1. `client_events.msg` → `m10.js:14-20`: un cliente anónimo puede enviar JSON
   que después se renderiza sin escapar en la consola del taller.
2. Roles/códigos Supabase → `m7.js:35-36`: valores remotos alcanzan texto,
   atributos y handlers inline.
3. `tenant_state.data` → múltiples renders: convierte una inyección persistida
   en XSS almacenado para miembros del taller.
4. Logos, fotos y firmas → atributos `src` sin whitelist de protocolo/MIME.
5. Handlers inline con IDs/keys concatenados: requieren escape específico para
   contexto JavaScript, no sólo escape HTML.

---

## 4. Revisión de RLS

### Limitación crítica de evidencia

No hay SQL, migraciones, dumps de esquema ni políticas en la rama revisada.
No se puede confirmar:

- si RLS está habilitado;
- qué políticas existen;
- constraints, FKs o checks;
- funciones `SECURITY DEFINER`;
- triggers de validación;
- protección contra cambio de `tenant_id`;
- límites de payload o tipos permitidos.

Las desviaciones siguientes comparan la intención indicada con las operaciones
del cliente. Deben verificarse contra `pg_policies` y el esquema real antes de
considerarlas corregidas.

### Inventario de acceso observado

| Tabla | Operaciones observadas |
|---|---|
| `tenants` | `INSERT` durante bootstrap (`index.html:445-457`). |
| `tenant_users` | Lectura del usuario actual (`index.html:407-410`, `m7.js:8-10`, `m9.js:9-12`); listado sin filtro tenant, insert/update de invitado, edición de roles y delete por `user_id` (`m7.js:21-43`). |
| `tenant_state` | `SELECT` por `tenant_id` y `UPSERT` del objeto DB completo (`index.html:411-415,460-461`). |
| `invites` | Lectura por código; listado activo; insert; desactivación y anulación (`m7.js:17-41`). |
| `shares` | `UPSERT` desde taller (`m8.js:14-28`); lectura anónima por token (`hermana.html:30-34`); lectura de tokens por tenant (`m10.js:9-12`). |
| `client_events` | `INSERT` anónimo (`hermana.html:63-67`); lectura autenticada por token(s) (`m8.js:19-21,33-35`, `m10.js:10-20`). |

### Matriz de intención

| Tabla | anon | miembro | owner |
|---|---|---|---|
| `tenants` | Sin acceso | Leer sólo su tenant | Leer/actualizar su tenant; bootstrap controlado |
| `tenant_users` | Sin acceso | Leer su fila o miembros de su tenant; no administrar | Gestionar miembros del mismo tenant |
| `tenant_state` | Sin acceso | Leer/escribir operación del mismo tenant | Leer/escribir el mismo tenant |
| `invites` | Sin acceso directo | Sin administración | Crear/listar/anular sólo en su tenant |
| `shares` | Leer sólo por token válido | Leer shares de su tenant; no gestionar si “owner gestiona” es estricto | Gestionar shares de su tenant |
| `client_events` | Sólo insertar con token válido | Leer eventos de shares de su tenant | Leer eventos de shares de su tenant |

### Desviaciones y riesgos

#### RLS-1 — Políticas ausentes del repositorio

**Estado:** desviación verificable de gobernanza; enforcement real no
verificable.

La seguridad depende de políticas externas no revisables ni reproducibles desde
el repositorio. No hay forma de demostrar que anon y miembros estén limitados
según la intención.

#### RLS-2 — Administración de miembros depende de RLS no visible

`m7.js:31-43` lista `tenant_users` e `invites` sin filtro por `tenant_id`,
actualiza roles por `user_id` y elimina por `user_id`.

**Desviación potencial crítica:** si la policy sólo comprueba que el actor es
miembro, un miembro podría enumerar tenants, promoverse a owner, cambiar roles o
eliminar usuarios de otro tenant. Ocultar la UI con `aplicarNav()` no es un
control de autorización.

#### RLS-3 — Canje de invitación no atómico

`m7.js:17-29`:

1. lee una invitación por código;
2. inserta o mueve `tenant_users`;
3. desactiva la invitación en una operación posterior.

**Desviación:** el flujo requiere permisos amplios de insert/update sobre
`tenant_users` e `invites`, no valida sesión dentro de la función y permite una
carrera de reutilización. Debe resolverse mediante RPC/transacción server-side
que derive tenant y roles de la invitación, no del cliente.

#### RLS-4 — Escritura de `tenant_state` demasiado amplia para separar owner/miembro

`index.html:413-415` guarda el objeto `DB` completo como JSON.

**Desviación de diseño:** aunque RLS limite la fila al tenant correcto, no puede
separar campos administrativos de campos operativos dentro del mismo JSONB. Un
miembro con permiso operativo de update puede modificar configuración que se
pretendía reservar al owner.

#### RLS-5 — Escritura de `shares` accesible desde funciones globales

`m8.js:14-28` hace `upsert` con `tenant_id` enviado por el cliente. `publishLink`
se instala sin gate de owner; `publishPublic` se oculta para no-owner sólo en UI.

**Desviación potencial:** si la intención es “owner gestiona”, miembros no
deberían poder insertar/actualizar shares. La policy debe comprobar owner y
derivar/validar que `tenant_id` pertenece al actor.

#### RLS-6 — Lectura anónima de shares debe evitar enumeración

`hermana.html:32` usa `select('*').eq('token', token)`.

**Riesgo:** la intención permite lectura anon, pero la policy debe exigir token
exacto y evitar scans/listados. Además, los tokens se generan con
`Math.random()` (`m8.js:15,24`), lo que no ofrece entropía criptográfica.

#### RLS-7 — `client_events` anónimo sin validación suficiente

`hermana.html:63-67` inserta `{token,tipo,monto,msg}` sin validación de:

- existencia del share;
- tenant derivado;
- tipos permitidos;
- rango de monto;
- tamaño/formato de mensaje;
- frecuencia.

**Desviación:** “anon sólo inserta `client_events`” no significa insert
irrestricto. La policy debe exigir un share válido mediante `EXISTS`, impedir
select/update/delete anónimo y complementarse con checks, trigger o RPC.

#### RLS-8 — Consultas cross-tenant confían en filtros del cliente

Hay consultas/mutaciones sin filtro tenant explícito en `m7.js:31-43`.
Las lecturas de eventos por token (`m8.js:19-21,33-35`) también dependen de que
la policy relacione token → share → tenant del miembro.

**Desviación potencial alta:** ninguna policy debe confiar en
`TENANT_ID`, `user_id`, token o filtros enviados por el navegador sin validar
las relaciones en servidor.

### Políticas mínimas a comprobar en Supabase

1. RLS habilitado en las seis tablas.
2. Helpers no recursivos para `is_tenant_member()` e `is_tenant_owner()`.
3. `WITH CHECK` además de `USING` para impedir cambio de `tenant_id`.
4. Owner-only para altas/bajas/roles/invitaciones y, si aplica, shares.
5. Miembros limitados al mismo tenant en lectura/escritura operativa.
6. Anon:
   - `shares`: sólo lectura por token exacto;
   - `client_events`: sólo insert con share existente;
   - cero acceso al resto.
7. Canje de invitación y bootstrap como RPCs transaccionales.
8. Checks de tipo/tamaño/rango para `client_events`.
9. Prohibición de promover owner desde el cliente y protección del último owner.

---

## Prioridad recomendada

1. **Crítica:** obtener/exportar políticas reales y compararlas con la matriz.
2. **Crítica:** cerrar XSS almacenado desde `client_events` y `tenant_state`.
3. **Alta:** reemplazar concatenación `innerHTML` por DOM seguro o escape
   contextual.
4. **Alta:** mover bootstrap/canje de invitación a RPC transaccional.
5. **Media:** eliminar overrides globales y hacer explícito el orden/dependencias.

Este documento es únicamente un reporte. No se modificó código de aplicación.