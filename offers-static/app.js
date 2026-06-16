(function () {
  "use strict";
  if (!window.PARTNER_MODE) { document.body.innerHTML = "<p style=\"padding:40px;font-family:sans-serif\">Ошибка сборки: ожидается партнёрский каталог данных.</p>"; return; }
  var OFFERS = window.OFFERS || [];
  var META = window.OFFERS_META || {};
  var PARTNER = !!window.PARTNER_MODE;  // партнёрская сборка: без источников и прямых ссылок (build_partner.py)
  var CHUNK = 60;

  var SOURCE_LABEL = { revroute: "RevRoute" };
  var MODEL_LABEL = { revshare: "RevShare", cpa: "CPA", cps: "CPS", cpc: "CPC", cpl: "CPL", fixed: "Fixed", recurring: "Recurring", hybrid: "Hybrid", "invite-only": "Invite-only", unknown: "—" };
  var LANG_LABEL = { ru: "RU", en: "EN" };
  var PERIOD_LABEL = { recurring: "Recurring", lifetime: "Lifetime", monthly: "Monthly", "per-transaction": "Per sale", "one-time": "One-time", "12 months": "12 mo" };
  var RECORD_LABEL = { offer: "Офферы", pipeline: "Pipeline", discovery: "Discovery" };
  var TIER_LABEL = { "топ": "Топ", "высокий": "Высокий", "средний": "Средний", "низкий": "Низкий" };
  var TIER_ORDER = ["топ", "высокий", "средний", "низкий"];
  var ICP_LABEL = { high: "High", medium: "Medium", low: "Low" }, ICP_ORDER = ["high", "medium", "low"];

  var GROUPS = ["source", "category", "language", "icp", "tier", "band", "basis"];
  var REC_N = OFFERS.reduce(function (n, o) { return n + (o.recommended ? 1 : 0); }, 0);
  // подборка «Рекомендуем» включена по умолчанию (если есть в данных); выключается чекбоксом / rec=0 в URL
  function newState() { return { source: new Set(), category: new Set(), language: new Set(), icp: new Set(), tier: new Set(), band: new Set(), basis: new Set(), q: "", sort: "income", fav: false, wip: false, rec: REC_N > 0 }; }
  var state = newState();
  var filtered = [], rendered = 0;
  var BYID = {}; OFFERS.forEach(function (o) { BYID[o.id] = o; });

  // ---- избранное (localStorage) ----
  var FAVS = (function () { try { return new Set(JSON.parse(localStorage.getItem("rr_favs") || "[]")); } catch (e) { return new Set(); } })();
  function saveFavs() { try { localStorage.setItem("rr_favs", JSON.stringify(Array.from(FAVS))); } catch (e) {} }
  function toggleFav(id) { if (FAVS.has(id)) FAVS.delete(id); else FAVS.add(id); saveFavs(); updateFavCount(); updateSelbar(); }
  function updateFavCount() { var el = document.getElementById("favCount"); if (el) el.textContent = FAVS.size ? "(" + FAVS.size + ")" : ""; }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtInt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function fmtRub(n) { return n == null ? null : (fmtInt(n) + " ₽"); }
  function fmtRevenue(v) { if (v == null) return null; var n = +v; if (!isFinite(n) || !n) return String(v); return n >= 1e9 ? (n / 1e9).toFixed(1).replace(".", ",") + " млрд ₽/год" : fmtInt(n / 1e6) + " млн ₽/год"; }
  function fmtOom(n) { if (n == null) return null; var e = Math.pow(10, Math.floor(Math.log10(n))); var v = Math.round(n / e) * e; return v >= 1000 ? Math.round(v / 1000) + "к ₽" : v + " ₽"; }  // порядок величины, 1 значащая
  function econValue(e) { return e && (e.comm_ltv != null ? e.comm_ltv : e.comm_first); }  // приоритет LTV
  var BAND_LABEL = { "низкий": "Низкий чек", "средний": "Средний чек", "высокий": "Высокий чек", "enterprise": "Enterprise" };
  var BAND_ORDER = ["низкий", "средний", "высокий", "enterprise"];
  var BASIS_LABEL = { "тарифы": "✓ проверен", "категория": "оценка" };
  var BASIS_ORDER = ["тарифы", "категория"];

  function counts(getter) { var m = {}; OFFERS.forEach(function (o) { var v = getter(o); if (v == null) return; m[v] = (m[v] || 0) + 1; }); return m; }

  // ---- URL state ----
  function readUrl() {
    var p = new URLSearchParams(location.search);
    GROUPS.forEach(function (g) {
      var v = p.get(g); if (!v) return;
      v.split(",").forEach(function (x) { state[g].add(x); });
    });
    if (p.get("q")) state.q = p.get("q");
    if (p.get("sort")) state.sort = p.get("sort");
    if (p.get("fav") === "1") state.fav = true;
    if (p.get("wip") === "1") state.wip = true;
    if (p.get("rec") === "0") state.rec = false;
    if (p.get("rec") === "1") state.rec = REC_N > 0;
  }
  function writeUrl() {
    var p = new URLSearchParams();
    GROUPS.forEach(function (g) {
      if (state[g].size) p.set(g, Array.from(state[g]).join(","));
    });
    if (state.q) p.set("q", state.q);
    if (state.sort !== "income") p.set("sort", state.sort);
    if (state.fav) p.set("fav", "1");
    if (state.wip) p.set("wip", "1");
    if (REC_N > 0 && !state.rec) p.set("rec", "0");  // default = ON, в URL пишем только выключение
    history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
  }

  // ---- filter chips ----
  function sortedItems(map, order) {
    var arr = Object.keys(map).map(function (k) { return { val: k, n: map[k] }; });
    if (order) arr.sort(function (a, b) { var ia = order.indexOf(a.val), ib = order.indexOf(b.val); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || b.n - a.n; });
    else arr.sort(function (a, b) { return b.n - a.n; });
    return arr;
  }
  function chipGroup(label, key, items, labelMap) {
    var wrap = document.createElement("div"); wrap.className = "fg";
    var lab = document.createElement("div"); lab.className = "fg-label"; lab.textContent = label; wrap.appendChild(lab);
    var chips = document.createElement("div"); chips.className = "fg-chips";
    items.forEach(function (it) {
      var c = document.createElement("button"); c.className = "chip"; c.dataset.key = key; c.dataset.val = it.val;
      if (state[key].has(it.val)) c.classList.add("active");
      c.innerHTML = esc((labelMap && labelMap[it.val]) || it.val) + ' <span class="c">' + it.n + "</span>";
      c.addEventListener("click", function () {
        var s = state[key]; if (s.has(it.val)) s.delete(it.val); else s.add(it.val);
        c.classList.toggle("active"); apply();
      });
      chips.appendChild(c);
    });
    wrap.appendChild(chips); return wrap;
  }
  function buildFilters() {
    var root = document.getElementById("filters");
    // фильтры считаем по реальным офферам (pipeline/discovery скрыты по умолчанию)
    if (!PARTNER) root.appendChild(chipGroup("Источник", "source", sortedItems(counts(function (o) { return o.record_type === "offer" ? o.source : null; }), ["revroute"]), SOURCE_LABEL));
    root.appendChild(chipGroup("Категория", "category", sortedItems(counts(function (o) { return o.record_type === "offer" ? o.primary_category : null; }))));
    root.appendChild(chipGroup("Язык", "language", sortedItems(counts(function (o) { return o.record_type === "offer" ? o.language : null; }), ["ru", "en"]), LANG_LABEL));
    var icpItems = sortedItems(counts(function (o) { return o.record_type === "offer" ? o.icp_band : null; }), ICP_ORDER);
    if (icpItems.length) root.appendChild(chipGroup("ICP-фит", "icp", icpItems, ICP_LABEL));
    root.appendChild(chipGroup("Доход", "tier", sortedItems(counts(function (o) { return o.economics && o.economics.tier !== "—" ? o.economics.tier : null; }), TIER_ORDER), TIER_LABEL));
    root.appendChild(chipGroup("Порог входа", "band", sortedItems(counts(function (o) { return o.record_type === "offer" && o.aov && o.aov.band ? o.aov.band : null; }), BAND_ORDER), BAND_LABEL));
    root.appendChild(chipGroup("Средний чек", "basis", sortedItems(counts(function (o) { return o.record_type === "offer" && o.aov && o.aov.month_rub ? o.aov.basis : null; }), BASIS_ORDER), BASIS_LABEL));
  }

  // ---- filtering & sorting ----
  function matchMulti(set, val) { return set.size === 0 || set.has(val); }
  function passes(o) {
    if (!state.wip && o.record_type !== "offer") return false;   // pipeline/discovery скрыты по умолчанию
    if (state.rec && !o.recommended) return false;               // подборка «Рекомендуем» (default ON)
    if (!matchMulti(state.source, o.source)) return false;
    if (!matchMulti(state.category, o.primary_category)) return false;
    if (!matchMulti(state.language, o.language)) return false;
    if (!matchMulti(state.icp, o.icp_band)) return false;
    if (!matchMulti(state.tier, o.economics && o.economics.tier)) return false;
    if (!matchMulti(state.band, o.aov && o.aov.band)) return false;
    if (!matchMulti(state.basis, o.aov && o.aov.basis)) return false;
    if (state.fav && !FAVS.has(o.id)) return false;
    if (state.q) {
      var q = state.q.toLowerCase();
      var hay = (o.title + " " + (o.vendor_name || "") + " " + (o.primary_category || "") + " " + (o.reward && o.reward.raw_text || "") + " " + (o.keywords || "")).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }
  var PERIOD_RANK = { recurring: 3, lifetime: 3, monthly: 2, "12 months": 1 };
  function sortOffers(arr) {
    if (state.sort === "income") arr.sort(function (a, b) {
      var sa = (a.economics && a.economics.score) || -1, sb = (b.economics && b.economics.score) || -1;
      if (sb !== sa) return sb - sa;
      return (econValue(b.economics) || -1) - (econValue(a.economics) || -1);  // при равном score — по ₽
    });
    else if (state.sort === "reward") arr.sort(function (a, b) { return (b.reward.value || -1) - (a.reward.value || -1); });
    else if (state.sort === "popular") arr.sort(function (a, b) { return ((b.stats && b.stats.partnerships) || -1) - ((a.stats && a.stats.partnerships) || -1); });
    else if (state.sort === "recurring") arr.sort(function (a, b) { return (PERIOD_RANK[b.reward.period] || 0) - (PERIOD_RANK[a.reward.period] || 0); });
    else if (state.sort === "az") arr.sort(function (a, b) { return (a.title || "").localeCompare(b.title || ""); });
    return arr;
  }

  // ---- render ----
  function rewardHtml(r, o) {
    if (!r) return "";
    var label = MODEL_LABEL[r.model] || r.model;
    var txt = r.raw_text || "";
    if (!txt) {
      if (r.value != null) txt = (r.currency ? (r.currency === "USD" ? "$" + r.value : r.value + " " + r.currency) : r.value + "%");
      else txt = "—";
    }
    var head = (r.model && r.model !== "unknown") ? '<span class="model">' + esc(label) + "</span>" : "";
    var per = r.period && PERIOD_LABEL[r.period] ? '<span class="per">' + esc(PERIOD_LABEL[r.period]) + "</span>" : "";
    return '<div class="reward">' + head + per + '<span class="rtxt">' + esc(txt) + "</span></div>";
  }
  function badges(o) {
    var b = "";
    if (o.recommended) b += '<span class="tag rec" title="Кураторская подборка RevRoute: программа перепроверена по сайту вендора">⭐ рекомендуем</span>';
    // внутренняя витрина: бейдж не дублируем — тег источника RevRoute в футере уже несёт этот сигнал;
    // в партнёрской сборке тегов источника нет, бейдж — единственный носитель
    if (PARTNER && o.source === "revroute" && o.record_type === "offer") b += '<span class="tag direct" title="Условия проверены командой RevRoute по программе вендора">проверено RevRoute</span>';
    if (o.record_type === "pipeline") b += '<span class="tag pipe" title="Программы пока нет — кандидат на запуск">кандидат</span>';
    if (o.record_type === "offer" && o.reward && o.reward.model !== "invite-only" && (o.reward.model === "unknown" || o.reward.value == null)) b += '<span class="tag unk" title="Ставка публично не раскрыта — уточняется при подключении">условия уточняются</span>';
    var siteDead = o.site_status && o.site_status.indexOf("dead") === 0;
    if (siteDead) b += '<span class="tag dead" title="Сайт вендора не открывается (проверено браузером ' + esc((o.checked_at || "").slice(0, 10) || "2026-06-12") + '): продукт, вероятно, закрыт">вендор недоступен</span>';
    if (!siteDead && o.promotable === false && o.record_type === "offer") b += '<span class="tag closed" title="Публичной саморегистрации нет: закрытая сеть или партнёрская страница недоступна">закрытая программа</span>';
    // «по данным партнёрки» (researched) перенесён в модалку (решение 2026-06-12)
    if (o.promo && o.promo.indexOf("free_trial") >= 0) b += '<span class="tag promo" title="У продукта есть бесплатный триал — лид конвертится легче">free trial</span>';
    if (o.promo && o.promo.indexOf("discount") >= 0) b += '<span class="tag promo" title="Вендор даёт скидку по партнёрской ссылке">скидка</span>';
    return b;
  }
  function econLine(o) {
    if (o.record_type !== "offer") return "";
    var e = o.economics || {}, parts = "";
    if (e.tier && e.tier !== "—") parts += '<span class="tier t-' + esc(e.tier) + '" title="Тир потенциала дохода (см. методологию)">' + esc(TIER_LABEL[e.tier] || e.tier) + "</span>";
    var v = econValue(e);
    if (v != null) {
      var isLtv = e.comm_ltv != null && e.kind && e.kind.indexOf("recurring") >= 0;
      parts += '<span class="epc" title="' + esc(e.assumptions || "") + " · достоверность: " + esc(e.confidence) + '">≈ ' + esc(fmtRub(v)) + "/клиент" + (isLtv ? " <span class='epc-q'>LTV</span>" : "") + (e.confidence !== "high" ? " <span class='epc-q'>оц.</span>" : "") + "</span>";
    }
    var a = o.aov;
    if (a && a.month_rub) {
      var estim = a.basis === "категория";
      var ttl = "Средний чек ~" + fmtRub(a.month_rub) + "/мес" + (a.currency === "USD" ? " (≈$" + a.month_native + "/мес, междунар.)" : "") + " · " + (estim ? "оценка по категории" : "по тарифам") + (a.cycle ? " · " + a.cycle : "");
      parts += '<span class="chk" title="' + esc(ttl) + '">чек ~' + esc(fmtOom(a.year_rub)) + "/год" + (estim ? " <span class='epc-q'>оц.</span>" : "") + "</span>";
    }
    if (o.stats && o.stats.partnerships) parts += '<span class="chk" title="Активных партнёрств в программе по данным каталога-источника — социальное доказательство спроса">' + esc(fmtInt(o.stats.partnerships)) + " партн.</span>";
    return parts ? '<div class="econ">' + parts + "</div>" : "";
  }
  function cardHtml(o) {
    var showVendor = o.vendor_name && o.vendor_name !== o.title;
    // язык — через фильтр «Язык», тег с карточки убран (решение 2026-06-12)
    var foot = (PARTNER ? "" : '<span class="tag src src-' + o.source + '">' + esc(SOURCE_LABEL[o.source] || o.source) + "</span>") +
      '<span class="tag">' + esc(o.primary_category) + "</span>";
    var fav = (o.logo_path === "assets/placeholder.svg" && o.vendor_website) ?
      "https://www.google.com/s2/favicons?sz=64&domain=" + encodeURIComponent(o.vendor_website.replace(/^https?:\/\//, "").split("/")[0]) : o.logo_path;
    var rew = (o.record_type === "offer") ? rewardHtml(o.reward, o)
      : '<div class="reward pipe-note">' + (o.record_type === "pipeline" ? "Программы пока нет — кандидат на запуск" : "Условия уточняются") + "</div>";
    var isFav = FAVS.has(o.id);
    return '<article class="card" data-id="' + esc(o.id) + '" data-source="' + esc(o.source) + '" data-url="' + esc(o.landing_url || o.source_detail_url || "") + '">' +
      '<button class="fav-btn' + (isFav ? " on" : "") + '" data-fav="' + esc(o.id) + '" title="Сохранить в избранное" aria-label="В избранное">' + (isFav ? "★" : "☆") + "</button>" +
      '<div class="card-top">' +
      '<img class="logo" src="' + esc(fav) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'assets/placeholder.svg\'">' +
      '<div class="card-head"><div class="card-title" title="' + esc(o.title) + '">' + esc(o.title) + "</div>" +
      (showVendor ? '<div class="card-vendor">' + esc(o.vendor_name) + "</div>" : "") + "</div></div>" +
      (o.description_short ? '<div class="card-desc">' + esc(o.description_short) + "</div>" : "") +
      rew + econLine(o) +
      '<div class="card-foot">' + badges(o) + foot + "</div></article>";
  }

  // ---- детальная модалка (только revroute) ----
  function row(label, val) {
    if (val == null || val === "" || val === false) return "";
    return '<div class="m-row"><div class="m-k">' + esc(label) + '</div><div class="m-v">' + esc(val) + "</div></div>";
  }
  function section(title, rowsHtml) {
    if (!rowsHtml || !rowsHtml.replace(/\s/g, "")) return "";
    return '<div class="m-sec"><div class="m-sec-t">' + esc(title) + "</div>" + rowsHtml + "</div>";
  }
  function payoutRows(p) {
    if (!p) return "";
    return row("Порог выплаты", p.threshold) + row("Периодичность", p.frequency) +
      row("Способ", p.method) + row("Окно/закрепление", p.window || p.cookie_window) +
      row("Холд", p.hold) + row("Атрибуция", p.attribution);
  }
  function contactRows(cs) {
    if (!cs || !cs.length) return "";
    return cs.map(function (ct, i) {
      return row("Контакт " + (i + 1), [ct.name, ct.role, ct.telegram, ct.email].filter(Boolean).join(" · "));
    }).join("");
  }
  function rewardSummary(o) {
    var r = o.reward || {};
    var v = r.value != null ? (r.currency === "RUB" ? r.value + " ₽" : (r.currency ? r.value + " " + r.currency : r.value + "%")) : null;
    var parts = [];
    if (r.model && r.model !== "unknown") parts.push((MODEL_LABEL[r.model] || r.model));
    if (v) parts.push(v);
    if (r.value_fixed) parts.push("+ " + r.value_fixed + " " + (r.currency_fixed || "RUB"));
    var head = parts.length ? '<div class="m-reward">' + esc(parts.join(" · ")) + "</div>" : "";
    var tiers = (o.profile && o.profile.tiers && o.profile.tiers.length) ?
      '<div class="m-tiers">' + o.profile.tiers.map(function (t) {
        return '<span class="m-tier">' + esc(t.role) + ": " + (t.note ? esc(t.note) + " " : "") + (t.pct != null ? esc(t.pct) + "%" : "") + "</span>";
      }).join("") + "</div>" : "";
    var raw = r.raw_text ? '<div class="m-raw">' + esc(r.raw_text) + "</div>" : "";
    return head + tiers + raw;
  }
  function econBlock(o) {
    var e = o.economics || {};
    if (!e || (e.tier === "—" && e.comm_first == null && !(o.aov && o.aov.month_rub))) return "";
    var CONF = { high: "высокая", medium: "средняя (оценка)", low: "низкая — показываем только тир" };
    var rows = "";
    if (e.comm_first != null) rows += row("За первую сделку", fmtRub(e.comm_first));
    if (e.comm_ltv != null && e.comm_ltv !== e.comm_first) rows += row("За весь срок (LTV)", fmtRub(e.comm_ltv) + (e.lifetime_basis ? " · " + e.lifetime_basis : ""));
    if (e.comm_first == null) rows += row("Оценка ₽", (o.aov && o.aov.basis === "тарифы") ? "ставка вознаграждения не раскрыта — показываем средний чек и тир" : "цена продукта не раскрыта — считаем только тир (см. ниже)");
    if (o.aov && o.aov.month_rub) rows += row("Средний чек", "~" + fmtRub(o.aov.month_rub) + "/мес · ~" + fmtOom(o.aov.year_rub) + "/год" + (o.aov.currency === "USD" ? " (≈$" + o.aov.month_native + "/мес, междунар.)" : "") + " · " + (o.aov.basis === "категория" ? "оценка по категории (порядок величины)" : "по тарифам сайта"));
    if (o.aov && o.aov.cycle) rows += row("Порог входа / цикл", o.aov.cycle);
    if (e.assumptions) rows += row("Как считаем", e.assumptions);
    if (e.note) rows += row("Заметка", e.note);
    rows += row("Достоверность", CONF[e.confidence] || e.confidence);
    if (o.attribution && o.attribution.label) rows += row("Окно атрибуции", o.attribution.label);
    var head = (e.tier && e.tier !== "—") ? '<div class="m-econ-head"><span class="tier t-' + esc(e.tier) + '">' + esc(TIER_LABEL[e.tier] || e.tier) + " потенциал дохода</span></div>" : "";
    return '<div class="m-sec"><div class="m-sec-t">Бизнес-эффект для партнёра</div>' + head + rows + "</div>";
  }
  function channelsBlock(o) {
    var c = o.channels; if (!c) return "";
    var LBL = { email: "Email/рассылки", ppc: "Контекст (PPC)", brand: "Брендовые ключи", incentive: "Cashback/мотив.", seo: "SEO/контент", social: "Соцсети/SMM" };
    var ST = { allowed: ["разрешён", "ch-ok"], prohibited: ["запрещён", "ch-no"], unknown: ["н/д", "ch-un"] };
    var known = Object.keys(LBL).some(function (k) { return c[k] && c[k] !== "unknown"; });
    if (!known && !c.fraud_banned) return "";
    var items = Object.keys(LBL).map(function (k) { var s = ST[c[k]] || ST.unknown; return '<span class="ch ' + s[1] + '">' + esc(LBL[k]) + ": " + s[0] + "</span>"; }).join("");
    if (c.fraud_banned) items += '<span class="ch ch-no">фрод запрещён</span>';
    return '<div class="m-sec"><div class="m-sec-t">Каналы продвижения</div><div class="m-chans">' + items + "</div></div>";
  }
  function openModal(o) {
    if (!o) return;
    var p = o.profile || {};
    var icpRows = row("ICP-фит", o.icp_band ? (ICP_LABEL[o.icp_band] || o.icp_band) : null);
    var payoutHtml = payoutRows(p.payout);
    var payoutSec = payoutHtml ? section("Выплаты", payoutHtml)
      : (PARTNER ? '<div class="m-sec"><div class="m-sec-t">Выплаты</div><div class="m-note">Условия выплат зависят от вендора — подтверждаем при подключении.</div></div>' : "");
    // ссылки без дублей: «Регистрация» и «Оферта» показываются, только если отличаются
    var linkSignup = (p.signup_url && p.signup_url !== p.partner_page) ? p.signup_url : null;
    var linkTerms = (p.terms_url && p.terms_url !== p.partner_page && p.terms_url !== p.signup_url) ? p.terms_url : null;
    var srcLinks = (p.sources && p.sources.length) ?
      p.sources.map(function (u) { return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(u.replace(/^https?:\/\//, "").slice(0, 48)) + "</a>"; }).join(" · ") : "";
    var body =
      '<div class="m-head">' +
      '<div class="m-title">' + esc(o.title) + ' <span class="tag direct">' + (PARTNER ? "проверено RevRoute" : "прямой источник") + "</span></div>" +
      '<div class="m-sub">' + esc(o.primary_category) + (p.maturity ? " · программа: " + esc(p.maturity) : "") + (p.program_type ? " · " + esc(p.program_type) : "") + ((PARTNER || o.checked_at) ? " · данные от " + esc((o.checked_at || META.generated_at || "").slice(0, 10)) : "") + "</div>" +
      rewardSummary(o) + "</div>" +
      econBlock(o) +
      section("Продукт", row("Что это", p.what) + row("Тарифы", p.pricing) + row("Триал/демо", p.free_trial) + row("Self-serve", p.self_serve) + row("Стадия", p.stage) + icpRows) +
      payoutSec +
      section("Подключение", row("Как подключиться", p.signup) + row("Кабинет партнёра", p.cabinet) + row("Трекинг", p.tracking)) +
      channelsBlock(o) +
      section("Поддержка", row("Партнёр-менеджер", p.partner_manager) + row("Материалы", p.materials)) +
      section("Ограничения", row("Требования", p.requirements) + row("Ограничения", p.restrictions)) +
      section("Юр-лицо и контакт", row("Юрлицо", p.yurlitso) + row("ИНН", p.inn) + row("Регион", p.region) +
        row("Выручка", fmtRevenue(p.revenue)) + row("Размер", p.size_band) + row("Численность", p.headcount) +
        row("ОКВЭД", p.okved) + row("Статус юрлица", p.status_yur) + row("Реестр МСП", p.msp) +
        row("ЛПР", p.lpr) + contactRows(p.contacts)) +
      section("Ссылки", row("Партнёрская страница", p.partner_page) + row("Регистрация", linkSignup) + row("Оферта/условия", linkTerms)) +
      (srcLinks ? section("Источники", '<div class="m-row"><div class="m-v">' + srcLinks + "</div></div>") : "") +
      (!p.enriched ? '<div class="m-note">' + (PARTNER ? "Часть деталей уточняется — финальные условия подтверждаем при подключении." : "Детали профиля дополняются (Pass 2). Сейчас показаны данные первичного исследования RevRoute.") + "</div>" : "") +
      (PARTNER
        ? '<div class="m-cta"><button class="m-btn" data-mfav="' + esc(o.id) + '">' + (FAVS.has(o.id) ? "★ Взято в работу — убрать" : "☆ Беру в работу") + '</button><div class="m-note">Подключение к программе и партнёрские ссылки выдаёт RevRoute — отметьте офферы и отправьте нам список.</div></div>'
        : '<div class="m-cta"><a class="m-btn" href="' + esc(o.landing_url || "") + '" target="_blank" rel="noopener">Перейти к программе →</a></div>');
    document.getElementById("modalBody").innerHTML = body;
    var m = document.getElementById("modal"); m.style.display = "flex"; document.body.style.overflow = "hidden";
  }
  function closeModal() { document.getElementById("modal").style.display = "none"; document.body.style.overflow = ""; }

  // ---- модалка офферов из каталогов-источников (зеркала: секции, метрики, условия) ----
  var SEC_ORDER = [["description", "Описание"], ["why_recommend", "За что рекомендовать"], ["whom_recommend", "Кому рекомендовать"], ["best_recommenders", "Чьи рекомендации результативнее"], ["your_benefit", "Твоя выгода"], ["offer_terms", "Условия предложения"]];
  function host(u) { return String(u || "").replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, ""); }
  function programCta(o) {
    // приоритет CTA: страница программы у ВЕНДОРА (re-верификация) → landing → каталог-посредник
    if (o.vendor_program_url) return { url: o.vendor_program_url, via: false };
    var url = o.landing_url || o.source_detail_url;
    var viaAggregator = !!(url && o.vendor_website && host(url) !== host(o.vendor_website));
    return { url: url, via: viaAggregator };
  }
  function curatedBlock(o) {
    var c = o.curated; if (!c) return "";
    function cv(v) { return (v && !/^(unknown|—|-|···|\.{3})$/i.test(String(v).trim())) ? v : null; }  // сырые «unknown»/«···» не показываем
    var rows = row("Порог выплаты", cv(c.payout_threshold)) + row("Периодичность", cv(c.payout_frequency)) +
      row("Способ", cv(c.payout_method)) + row("Окно атрибуции", cv(c.payout_window)) + row("Холд", cv(c.payout_hold)) +
      row("Трекинг", cv(c.tracking)) + row("Требования", cv(c.requirements)) + row("Ограничения", cv(c.restrictions)) +
      row("Тарифы продукта", cv(c.pricing)) + row("Заметки проверки", cv(c.notes));
    if (!rows) return "";
    return '<div class="m-sec"><div class="m-sec-t">Проверено на сайте вендора' + (c.checked_at ? " · " + esc(c.checked_at) : "") + "</div>" + rows + "</div>";
  }
  function statsBlock(o) {
    var s = o.stats, rows = "";
    if (s) {
      if (s.partnerships) rows += row("Партнёрств в программе", fmtInt(s.partnerships));
      if (s.conv_click_signups) rows += row("Конверсия клик→регистрация", (s.conv_click_signups * 100).toFixed(1) + "%");
      // >60 дн. — сырое значение каталога недостоверно (Webflow «173 дн.»), не показываем
      if (s.review_days != null && s.review_days > 0 && s.review_days <= 60) rows += row("Срок одобрения заявки", s.review_days + " дн.");
    }
    if (o.promo && o.promo.length) rows += row("Промо у вендора", o.promo.indexOf("free_trial") >= 0 && o.promo.indexOf("discount") >= 0 ? "free trial · скидка" : (o.promo.indexOf("free_trial") >= 0 ? "free trial" : "скидка"));
    return section("Метрики каталога", rows);
  }
  function openMirrorModal(o) {
    var secs = o.sections || {};
    var rsd = (o.provenance && o.provenance.indexOf("researched") === 0)
      ? ' <span class="tag rsd" title="Данные реконструированы исследованием по партнёрской странице (' + esc(o.provenance.split(":")[1] || "") + ')">по данным партнёрки</span>' : "";
    var body = '<div class="m-head"><div class="m-title">' + esc(o.title) + rsd + "</div>" +
      '<div class="m-sub">' + esc(o.primary_category) + (o.vendor_name && o.vendor_name !== o.title ? " · " + esc(o.vendor_name) : "") + (o.regions && o.regions.length ? " · " + esc(o.regions.slice(0, 3).join(", ")) : "") + "</div>" +
      rewardSummary(o) + "</div>" + econBlock(o);
    // короткое описание не дублируем, если у источника есть развёрнутая секция «Описание»
    if (o.description_short && !secs.description) body += section("Описание", '<div class="m-row"><div class="m-v">' + esc(o.description_short) +
      (o.description_en ? '<div class="m-orig">Оригинал: ' + esc(o.description_en) + "</div>" : "") + "</div></div>");
    body += curatedBlock(o);
    body += statsBlock(o);
    SEC_ORDER.forEach(function (s) {
      if (secs[s[0]]) body += '<div class="m-sec"><div class="m-sec-t">' + esc(s[1]) + '</div><div class="m-row"><div class="m-v">' + esc(secs[s[0]]) + "</div></div></div>";
    });
    if (o.terms_text) body += '<div class="m-sec"><div class="m-sec-t">Условия программы</div><div class="m-row"><div class="m-v">' + esc(o.terms_text) + "</div></div></div>";
    body += section("Ссылки", row("Программа у вендора", o.vendor_program_url) + row("Сайт вендора", o.vendor_website) + row("Условия у вендора", o.tos_url) + row("Страница в каталоге", o.source_detail_url));
    if (PARTNER) {
      body += '<div class="m-cta"><button class="m-btn" data-mfav="' + esc(o.id) + '">' + (FAVS.has(o.id) ? "★ Взято в работу — убрать" : "☆ Беру в работу") + '</button><div class="m-note">Подключение к программе и партнёрские ссылки выдаёт RevRoute — отметьте офферы и отправьте нам список.</div></div>';
    } else {
      var cta = programCta(o);
      if (cta.url) body += '<div class="m-cta"><a class="m-btn" href="' + esc(cta.url) + '" target="_blank" rel="noopener">Перейти к программе →</a>' +
        (cta.via ? '<div class="m-note">Регистрация ведётся через каталог-агрегатор: своей страницы программы у вендора в данных нет.</div>' : "") + "</div>";
    }
    document.getElementById("modalBody").innerHTML = body;
    var m = document.getElementById("modal"); m.style.display = "flex"; document.body.style.overflow = "hidden";
  }

  // ---- FAQ-модалка (партнёрская версия: кнопка «?» в панели) ----
  var faqBtn = document.getElementById("faqBtn"), faqTpl = document.getElementById("faqTpl");
  if (faqBtn && faqTpl) faqBtn.addEventListener("click", function () {
    document.getElementById("modalBody").innerHTML =
      '<div class="m-head"><div class="m-title">Как это работает</div></div>' + faqTpl.innerHTML;
    var m = document.getElementById("modal"); m.style.display = "flex"; document.body.style.overflow = "hidden";
  });

  var grid = document.getElementById("grid");
  function renderMore() {
    if (rendered >= filtered.length) return;
    var frag = document.createDocumentFragment();
    var end = Math.min(rendered + CHUNK, filtered.length);
    for (var i = rendered; i < end; i++) { var d = document.createElement("div"); d.innerHTML = cardHtml(filtered[i]); frag.appendChild(d.firstChild); }
    grid.appendChild(frag); rendered = end;
  }
  function apply() {
    filtered = sortOffers(OFFERS.filter(passes));
    grid.innerHTML = ""; rendered = 0;
    document.getElementById("empty").style.display = filtered.length ? "none" : "block";
    var denom = OFFERS.reduce(function (n, o) { return n + ((state.wip || o.record_type === "offer") ? 1 : 0); }, 0);
    document.getElementById("count").innerHTML = "Показано <b>" + filtered.length + "</b> из " + denom;
    renderMore(); writeUrl(); updateFtCount();
  }

  // infinite scroll
  var sentinel = document.getElementById("sentinel");
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting) renderMore(); }, { rootMargin: "700px" }).observe(sentinel);
  else window.addEventListener("scroll", function () { if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) renderMore(); });

  // events — ⭐ избранное; revroute → модалка; остальные → прямой переход
  grid.addEventListener("click", function (e) {
    var fb = e.target.closest(".fav-btn");
    if (fb) { e.stopPropagation(); toggleFav(fb.dataset.fav); var on = FAVS.has(fb.dataset.fav); fb.classList.toggle("on", on); fb.textContent = on ? "★" : "☆"; if (state.fav && !on) apply(); return; }
    var c = e.target.closest(".card"); if (!c) return;
    var oo = BYID[c.dataset.id]; if (!oo) return;
    if (oo.source === "revroute") { openModal(oo); return; }
    openMirrorModal(oo);  // зеркала: детали + осознанный переход из CTA (вендор приоритетнее посредника)
  });
  var searchEl = document.getElementById("search"); searchEl.value = state.q;
  var t; searchEl.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { state.q = searchEl.value.trim(); apply(); }, 120); });
  var sortEl = document.getElementById("sort"); sortEl.value = state.sort;
  sortEl.addEventListener("change", function () { state.sort = sortEl.value; apply(); });
  var favEl = document.getElementById("favonly"); if (favEl) { favEl.checked = state.fav; favEl.addEventListener("change", function () { state.fav = favEl.checked; apply(); }); }
  var wipEl = document.getElementById("wip"); if (wipEl) { wipEl.checked = state.wip; wipEl.addEventListener("change", function () { state.wip = wipEl.checked; apply(); }); }
  var recEl = document.getElementById("reconly");
  if (recEl) {
    if (!REC_N) { var rl = recEl.closest("label"); if (rl) rl.style.display = "none"; }
    recEl.checked = state.rec;
    recEl.addEventListener("change", function () { state.rec = recEl.checked; apply(); });
  }
  // ---- сворачиваемые фильтры ----
  var filtersBox = document.getElementById("filters");
  var ftToggle = document.getElementById("filtersToggle");
  var ftCount = document.getElementById("ftCount");
  function activeFilterCount() { return GROUPS.reduce(function (n, g) { return n + state[g].size; }, 0); }
  function updateFtCount() { if (!ftCount) return; var n = activeFilterCount(); ftCount.textContent = n || ""; ftCount.classList.toggle("on", !!n); }
  function setFiltersOpen(open) { if (!filtersBox || !ftToggle) return; filtersBox.classList.toggle("open", open); ftToggle.setAttribute("aria-expanded", open ? "true" : "false"); try { localStorage.setItem("rr_filters_open", open ? "1" : "0"); } catch (e) {} }
  if (ftToggle) ftToggle.addEventListener("click", function () { setFiltersOpen(!filtersBox.classList.contains("open")); });
  document.getElementById("reset").addEventListener("click", function () {
    state = newState();
    searchEl.value = ""; sortEl.value = "income";
    if (favEl) favEl.checked = false; if (wipEl) wipEl.checked = false;
    if (recEl) recEl.checked = state.rec;  // сброс возвращает дефолт подборки (ON)
    document.querySelectorAll(".chip.active").forEach(function (c) { c.classList.remove("active"); });
    apply();
  });

  // модалка: «беру в работу» = то же избранное, синхронно с карточкой
  document.getElementById("modalBody").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-mfav]"); if (!btn) return;
    var id = btn.dataset.mfav; toggleFav(id);
    var on = FAVS.has(id);
    btn.textContent = on ? "★ Взято в работу — убрать" : "☆ Беру в работу";
    var fb = grid.querySelector('.fav-btn[data-fav="' + id + '"]');
    if (fb) { fb.classList.toggle("on", on); fb.textContent = on ? "★" : "☆"; }
    if (state.fav && !on) apply();
  });

  // ---- панель выбранного: список «беру в работу» → буфер обмена ----
  var selbar = document.getElementById("selbar");
  function selectionText() {
    var items = OFFERS.filter(function (o) { return FAVS.has(o.id); });
    var lines = items.map(function (o, i) {
      var r = o.reward && o.reward.raw_text ? " — " + o.reward.raw_text : "";
      return (i + 1) + ". " + o.title + (o.primary_category ? " (" + o.primary_category + ")" : "") + r + " · " + o.id;
    });
    return "Беру в работу — офферы RevRoute (" + items.length + "):\n" + lines.join("\n");
  }
  function updateSelbar() {
    if (!selbar) return;
    selbar.style.display = FAVS.size ? "flex" : "none";
    var ne = document.getElementById("selN"); if (ne) ne.textContent = FAVS.size;
  }
  var selCopy = document.getElementById("selCopy");
  if (selCopy) selCopy.addEventListener("click", function () {
    var txt = selectionText();
    function open(copied) {
      document.getElementById("modalBody").innerHTML =
        '<div class="m-head"><div class="m-title">Список выбранных офферов</div>' +
        '<div class="m-sub">' + (copied
          ? "Скопировано в буфер ✓ — вставьте сообщением менеджеру RevRoute."
          : "Нажмите в поле — текст выделится. Скопируйте (Ctrl+C) и пришлите менеджеру RevRoute.") + "</div></div>" +
        '<textarea class="sel-text" id="selText" readonly spellcheck="false"></textarea>' +
        (window.RR_CONTACT ? '<div class="m-cta"><a class="m-btn" href="' + esc(window.RR_CONTACT) + '" target="_blank" rel="noopener">Написать менеджеру →</a></div>' : "");
      var ta = document.getElementById("selText"); ta.value = txt;
      ta.addEventListener("focus", function () { ta.select(); });
      var m = document.getElementById("modal"); m.style.display = "flex"; document.body.style.overflow = "hidden";
      ta.focus(); try { ta.select(); } catch (e) {}
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { open(true); }, function () { open(false); });
    else open(false);
  });

  // модалка: закрытие по фону / крестику / Esc
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", function (e) { if (e.target.id === "modal") closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // init
  readUrl();
  // синхронизировать контролы с состоянием из URL
  searchEl.value = state.q; sortEl.value = state.sort;
  if (favEl) favEl.checked = state.fav; if (wipEl) wipEl.checked = state.wip;
  if (recEl) recEl.checked = state.rec;
  var offerN = OFFERS.filter(function (o) { return o.record_type === "offer"; }).length;
  var wipN = OFFERS.length - offerN;
  document.getElementById("metaSub").textContent = PARTNER
    ? offerN + " проверенных офферов · обновлено " + (META.generated_at || "").slice(0, 10)
    : offerN + " офферов с программой" + (wipN ? " · " + wipN + " в проработке" : "") + " · " + (META.promotable || 0) + " с открытой партнёркой · обновлено " + (META.generated_at || "").slice(0, 10);
  if (PARTNER) {
    document.title = "RevRoute · Витрина офферов для партнёров";
    var ih = document.querySelector(".intro h1"), ip = document.querySelector(".intro p");
    if (ih) ih.textContent = "Витрина офферов для партнёров";
    if (ip) ip.textContent = "Проверенные партнёрские программы в одном каталоге. Отметьте ★ офферы, которые готовы продвигать, и отправьте нам список — подключение и партнёрские ссылки выдаёт RevRoute.";
    var sh = document.getElementById("selHint"); if (sh) sh.textContent = "— и пришлите его менеджеру RevRoute";
  }
  if (PARTNER || !wipN) { var wl = wipEl && wipEl.closest("label"); if (wl) wl.style.display = "none"; }
  updateSelbar();
  buildFilters();
  var savedOpen = null; try { savedOpen = localStorage.getItem("rr_filters_open"); } catch (e) {}
  setFiltersOpen(activeFilterCount() > 0 || savedOpen === "1");  // раскрыть, если есть активные фильтры или так было выбрано
  updateFavCount();
  apply();
})();
