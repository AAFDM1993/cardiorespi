/* ═══════════════════════════════════════════════
   FisioResp — Shared UI Utilities
   ═══════════════════════════════════════════════ */

/**
 * Switch active nav tab + panel.
 * Expects: .ntab elements + panels with id="tab-{id}"
 */
function showTab(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  el.classList.add('active');
}

/**
 * Switch active mode button + section.
 * Expects: .mode-btn elements + sections with id="mode-{id}"
 * @param {string} m - mode id
 * @param {string} [btnSel='.mode-btn'] - optional custom button selector
 */
function setMode(m, btnSel) {
  const sel = btnSel || '.mode-btn';
  document.querySelectorAll(sel).forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mode-section').forEach(s => s.classList.remove('active'));
  const btns = document.querySelectorAll(sel);
  const modes = Array.from(btns).map(b => b.dataset.mode);
  const idx = modes.indexOf(m);
  if (idx >= 0) btns[idx].classList.add('active');
  const sec = document.getElementById('mode-' + m);
  if (sec) sec.classList.add('active');
}

/**
 * Animate a result panel into view.
 * @param {string} id - element id
 */
function showResult(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.classList.add('show');
}

/**
 * Map a numeric value to a severity color class.
 * @param {number} val
 * @param {number[]} thresholds - [warn, danger] ascending
 * @returns {'val-ok'|'val-warn'|'val-alert'}
 */
function severityClass(val, thresholds) {
  if (val >= thresholds[1]) return 'val-alert';
  if (val >= thresholds[0]) return 'val-warn';
  return 'val-ok';
}

/**
 * Format a number with fixed decimals, returns '--' for null/NaN.
 */
function fmt(val, decimals) {
  if (val === null || val === undefined || isNaN(val)) return '--';
  return Number(val).toFixed(decimals ?? 1);
}
