  const API_BASE = "http://localhost:1704";
  const DEFAULT_VIEW_FILEPATH = "/var/lib/ApiGateway/data/results/view/main_view.json";
  const JSON_FILES_LIST_FILEPATH = "/var/lib/ApiGateway/data/results/view/json_files_list.json";

  const HIDE_PREFIX = "/var/lib/ApiGateway";

  function displayPath(filepath) {
    if (!filepath) return "";
    return filepath.startsWith(HIDE_PREFIX)
      ? filepath.slice(HIDE_PREFIX.length)
      : filepath;
  }

  function buildDownloadTextUrl(filepath) {
    return `${API_BASE}/file/download-text?filepath=${encodeURIComponent(filepath)}`;
  }

  function detectType(v) {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    if (typeof v === "object") return "object";
    return typeof v;
  }

  function canRenderTable(arr) {
    if (!arr.length) return false;
    if (!arr.every(v => typeof v === "object" && !Array.isArray(v))) return false;
    const keys = Object.keys(arr[0]);
    return arr.every(o =>
      keys.length === Object.keys(o).length &&
      keys.every(k => k in o)
    );
  }

  function summarizeObject(obj) {
    const values = Object.values(obj);
    return {
      objects: values.filter(v => detectType(v) === "object").length,
      arrays: values.filter(v => detectType(v) === "array").length,
      primitives: values.filter(v =>
        ["string","number","boolean"].includes(detectType(v))
      ).length
    };
  }

  function shouldCollapse(size, isRoot) {
    if (isRoot) return false;
    return size > 20;
  }

  function renderValue(value, isRoot = false) {
    const type = detectType(value);
    switch (type) {
      case "string": return value;
      case "number": return `<span class="badge">${value}</span>`;
      case "boolean": return `<span class="badge" style="opacity:${value ? 1 : 0.5}">${value}</span>`;
      case "null": return `<span class="null">null</span>`;
      case "array": return renderArray(value, isRoot);
      case "object": return renderObject(value, isRoot);
    }
  }

  function renderArray(arr, isRoot) {
    const size = arr.length;
    const collapsed = shouldCollapse(size, isRoot);
    const id = crypto.randomUUID();
    const large = size > 30;

    if (canRenderTable(arr)) {
      const keys = Object.keys(arr[0]);
      return `
        <div class="card ${collapsed ? "collapsed" : ""}" id="${id}">
          <div class="collapsible" onclick="toggle('${id}')">
            📊 Table (${size} rows)
            ${large ? `<span class="warn">⚠ large</span>` : ""}
          </div>
          <div class="content">
            <table>
              <thead>
                <tr>${keys.map(k => `<th>${k}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${arr.map(row =>
                  `<tr>${keys.map(k => `<td>${renderValue(row[k])}</td>`).join("")}</tr>`
                ).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    return `
      <div class="card ${collapsed ? "collapsed" : ""}" id="${id}">
        <div class="collapsible" onclick="toggle('${id}')">
          📦 Array (${size})
          ${large ? `<span class="warn">⚠ large</span>` : ""}
        </div>
        <div class="content">
          ${arr.map(v => `<div class="row">${renderValue(v)}</div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderObject(obj, isRoot) {
    const keys = Object.keys(obj);
    const size = keys.length;
    const collapsed = shouldCollapse(size, isRoot);
    const id = crypto.randomUUID();
    const summary = summarizeObject(obj);

    return `
      <div class="card ${collapsed ? "collapsed" : ""}" id="${id}">
        <div class="collapsible" onclick="toggle('${id}')">
          🧩 Object (${size} keys)
          <span class="muted">
            · ${summary.arrays} arrays · ${summary.objects} objects · ${summary.primitives} values
          </span>
          ${size > 30 ? `<span class="warn">⚠ complex</span>` : ""}
        </div>
        <div class="content">
          ${keys.map(k => `
            <div class="row">
              <span class="key">${k}</span>: ${renderValue(obj[k])}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function toggle(id) {
    document.getElementById(id).classList.toggle("collapsed");
  }

  function basename(p) {
    try {
      const parts = String(p).split("/");
      return parts[parts.length - 1] || p;
    } catch {
      return p;
    }
  }

  function getInitialFilepath() {
    const u = new URL(window.location.href);
    return u.searchParams.get("filepath") || DEFAULT_VIEW_FILEPATH;
  }

  function setUrlFilepath(filepath) {
    const u = new URL(window.location.href);
    u.searchParams.set("filepath", filepath);
    window.history.replaceState({}, "", u.toString());
  }

  async function loadData(filepath) {
    const res = await fetch(buildDownloadTextUrl(filepath));
    const raw = await res.json();
    if (!raw.ok) throw new Error("Load json failed");

    const data = JSON.parse(raw.data);
    document.getElementById("app").innerHTML = renderValue(data, true);
    document.getElementById("currentFile").textContent = displayPath(filepath);
    setUrlFilepath(filepath);
  }

  async function loadDropdownListAndInit() {
    const selectEl = document.getElementById("jsonFileSelect");
    selectEl.disabled = true;
    selectEl.innerHTML = `<option>Loading...</option>`;

    const res = await fetch(buildDownloadTextUrl(JSON_FILES_LIST_FILEPATH));
    const raw = await res.json();
    if (!raw.ok) throw new Error("Load json_files_list.json failed");

    const filepaths = Array.from(new Set(JSON.parse(raw.data))).filter(Boolean);
    const initial = getInitialFilepath();

    selectEl.innerHTML = filepaths.map(fp => {
      const label = `${basename(fp)} — ${displayPath(fp)}`;
      return `<option value="${fp.replaceAll('"', "&quot;")}" ${fp === initial ? "selected" : ""}>${label}</option>`;
    }).join("");

    selectEl.disabled = false;
    selectEl.addEventListener("change", e => loadData(e.target.value));
    await loadData(initial);
  }

  loadDropdownListAndInit();
