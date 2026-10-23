# Reglas de armado de estibas (tarimas) — Evena Foods

Este documento describe las reglas que sigue la app ([index.html](index.html)) para armar las tarimas de un pedido, y el orden en que se aplican. Basado en la especificación **PLO-01**.

---

## 1. Conceptos

- **Tarima / estiba**: el pallet completo.
- **Cama**: un nivel (piso) de cajas dentro de la tarima. La cama 1 es la **BASE** (abajo) y la última es la **TAPA** (arriba).
- **Cama pura**: una cama con un solo tipo de caja, llena según su especificación.
- **Cama mixta**: una cama que combina varios tipos de caja (con los sobrantes que no completan una cama pura).
- **Pendientes / sobrantes**: cajas que el algoritmo no pudo acomodar y que el usuario debe colocar a mano.

---

## 2. Clasificación de productos por tipo de caja

Cada producto se clasifica según su nombre, en este orden de revisión:

| Si el nombre contiene… | Tipo de caja |
|---|---|
| `5 LT` o `5L C/4` | **Garrafa 5L** |
| `3.8L` | **Galón 3.8L** |
| `500ML` | **500 ml** |
| `750 GR` | **Limón Desh** |
| `ENDULZANTE`, `CURAZAO`, `GRANADINA` o `BLACKMIX` | **Jarabe 1L** |
| Cualquier otro | **Salsa / Pulpa 1L** |

> Ojo: el orden importa. Por ejemplo, "BLACKMIX 3.8L" es Galón 3.8L y "BLACKMIX 500ML" es 500 ml; solo "BLACKMIX 1L" cae en Jarabe 1L.

---

## 3. Especificaciones por tipo (PLO-01)

| Orden de estiba | Tipo | Cajas por cama | Camas por tarima | Cajas por tarima | Kg por caja | Altura por cama |
|:-:|---|:-:|:-:|:-:|:-:|:-:|
| 1 (abajo) | Galón 3.8L | 14 | 4 | 56 | 16 | 33.6 cm |
| 2 | Garrafa 5L | 9 | 5 | 45 | 25.5 | 33.6 cm |
| 3 | Salsa / Pulpa 1L | 14 | 5 | 70 | 13 | 33.6 cm |
| 4 | Jarabe 1L | 15 | 5 | 75 | 15 | 33.6 cm |
| 5 | 500 ml | 23 | 7 | 161 | 6 | 26 cm |
| 6 (arriba) | Limón Desh | 9 | 5 | 45 | 20 | 33.6 cm |

**Orden de estiba**: dentro de una tarima, los tipos se acomodan de abajo hacia arriba según este número (lo más pesado/resistente abajo, lo más ligero/frágil arriba). También se usa para ordenar los productos dentro de una cama mixta.

### Límites generales

| Regla | Valor |
|---|---|
| Altura máxima por tarima | **184 cm** |
| Peso mínimo recomendado | **900 kg** (debajo se marca alerta amarilla ▼) |
| Peso máximo | **1,250 kg** (arriba se marca alerta roja ▲) |
| Camas máximas en tarimas armadas con sobrantes | **5** (7 si la tarima lleva camas puras de 500 ml) |

La altura de una cama mixta es la de la caja **más alta** que contenga.

### Espacio en cama mixta

Una cama mixta tiene una capacidad de **14.45 unidades de espacio**. Cada caja ocupa:

| Tipo | Espacio por caja | Máx. cajas de ese tipo en una mixta |
|---|:-:|:-:|
| Garrafa 5L | 1.56 | 9 |
| Limón Desh | 1.56 | 9 |
| Galón 3.8L | 1.00 | 14 |
| Salsa / Pulpa 1L | 1.00 | 14 |
| Jarabe 1L | 1.00 | 14 |
| 500 ml | 0.51 | 28 |

---

## 4. Orden del proceso de armado

### Paso 0 — Resumen por tipo
1. Se suman las cajas del pedido por tipo de caja.
2. Para cada tipo: `tarimas puras = cajas ÷ cajas por tarima` (entero) y `sobrantes = el resto`.
3. Se ordenan por orden de estiba.

### Fase 1 — Tarimas puras completas
- Por cada tarima pura completa se arma una tarima con el número de camas de su especificación, todas del mismo tipo.
- **Ajuste por peso**: si la tarima pesa menos de 900 kg, se le agregan camas extra del mismo tipo (tomadas de los sobrantes) mientras:
  - pese menos de 900 kg,
  - tenga menos de 7 camas,
  - haya sobrantes suficientes para una cama completa,
  - no pase de 1,250 kg ni de 184 cm.
  - Ejemplo: Galón 3.8L con 4 camas pesa 896 kg → se le agrega una 5.ª cama si hay 14 cajas sobrantes (queda en 1,120 kg y 168 cm).
- **Excepción 500 ml**: si el pedido es mixto (trae otros tipos además de 500 ml), las tarimas de 500 ml **no** reciben camas extra.

### Fase 2 — Separar sobrantes
Por cada tipo, los sobrantes se dividen en:
- **Camas puras sueltas** (`sobrantes ÷ cajas por cama`).
- **Parciales** (el resto, que no llena una cama). Los parciales forman la **bolsa de parciales**, ordenada de más cajas a menos (empate: por orden de estiba).

### Fase 2a — Tarimas completas con camas puras sueltas
- Si un tipo (que no sea 500 ml en pedido mixto) junta **5 o más camas puras sueltas**, se arma una tarima de 5 camas puras de ese tipo.
- **Garrafa 5L**: la última cama de esa tarima se intenta convertir a cama mixta con 1L (ver *Regla especial Garrafa 5L*).

### Fase 2_500ml — Sobrantes de 500 ml en pedido mixto
- Se arman tarimas con hasta **6 camas puras de 500 ml + 1 cama mixta** llenada con la bolsa de parciales.

### Fase 2b — Agrupar camas puras restantes en bloques
- Las camas puras sueltas que quedan (de distintos tipos) se juntan en bloques:
  - Bloques de **4 camas** si todavía hay parciales (para dejar lugar a una cama mixta).
  - Bloques de **5 camas** si ya no hay parciales.
- Los tipos con más camas van primero; empate por orden de estiba.

### Fase 3 — Armar tarimas con los bloques
- Cada bloque se ordena por orden de estiba (de abajo hacia arriba).
- Cada cama pura de Garrafa 5L se intenta convertir a mixta con 1L.
- Si quedan parciales, se agrega **una cama mixta arriba** llenándola con la bolsa de parciales.

### Fase 4 — Lo que quede de parciales
- Si **no se armó ninguna tarima** (pedido pequeño): los parciales se acomodan en camas mixtas, cada una como tarima nueva (luego la consolidación las junta).
- Si **sí hay tarimas**: lo que sobre se manda a **Pendientes** para acomodo manual.

### Fase 5 — Camas sugeridas con Garrafa 5L
- Con lo que quedó pendiente, se vuelven a intentar las recetas de Garrafa 5L + 1L (6+7, 7+6, 9+3) sobre las cajas sueltas.
- Las camas resultantes **no se asignan solas**: aparecen como "cama sugerida" en Pendientes para que el usuario la arrastre a donde quiera.

### Consolidación final de camas mixtas
- Si una tarima tiene 1 o 2 camas mixtas, se mueven a la tarima que tenga **menos camas** y donde quepan (máx. 5 camas, o 7 si esa tarima lleva 500 ml puras).
- Las tarimas que queden vacías se eliminan y se renumeran.

---

## 5. Cómo se llena una cama mixta

1. Se recorre la bolsa de parciales en su orden (más cajas primero).
2. De cada tipo se toman todas las cajas que quepan en el espacio restante (máx. 14.45).
3. Si un tipo no cabe completo, se toma lo que quepa y el resto se queda en la bolsa.
4. Al final, los productos dentro de la cama se ordenan por orden de estiba.

---

## 6. Regla especial Garrafa 5L

Una cama pura completa de Garrafa 5L (9 cajas) se convierte en cama mixta con cajas de 1L de la bolsa de parciales (se prefiere el tipo de 1L —Salsa/Pulpa o Jarabe— que tenga más cajas):

| Prioridad | Si hay de 1L disponibles | Cama resultante | Garrafas devueltas a la bolsa |
|:-:|:-:|---|:-:|
| 1 | 7 o más | 6 × Garrafa 5L + 7 × 1L | 3 |
| 2 | 6 | 7 × Garrafa 5L + 6 × 1L | 2 |
| 3 | 3 a 5 | 9 × Garrafa 5L + 3 × 1L | 0 |
| — | menos de 3 | Se deja como cama pura | — |

---

## 7. Validaciones y alertas por tarima

Cada tarima muestra su número de camas, cajas, peso y altura:

| Condición | Alerta |
|---|---|
| Peso < 900 kg | ⚠ Naranja — **PESO ▼** |
| Peso > 1,250 kg | ⚠ Roja — **PESO ▲** |
| Altura > 184 cm | ⚠ Roja — **ALTURA ▲** |

Las camas se muestran de arriba (TAPA) hacia abajo (BASE).

---

## 8. Ajustes manuales (después del armado automático)

El usuario puede corregir el armado arrastrando:
- **Camas completas** entre tarimas o a una tarima nueva.
- **Un tipo de caja** de una cama mixta a otra cama mixta.
- **Pendientes** a una cama existente, a una cama nueva dentro de una tarima, o a una tarima nueva.
- **Camas sugeridas** (de Fase 5) a cualquier tarima.
- Botones **−** / **+** en cada producto de una cama mixta: quitar una caja (va a Pendientes) o agregar una desde Pendientes.

Al mover cajas, las camas mixtas se reordenan por orden de estiba y las tarimas vacías se eliminan.
