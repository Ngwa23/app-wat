/* =========================================================================
   WAT Admin dashboard — talks to /admin/api/**
   ========================================================================= */
(function () {
  "use strict";

  var LANGS = ["en", "fr", "es", "de"];
  var state = { content: null, base: null, overrides: null, submissions: [], role: "VIEWER", readOnly: false, username: "" };

  /* ---------- tiny helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function cap(l) { return l.charAt(0).toUpperCase() + l.slice(1); }
  function escH(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var toastEl = $("#toast"), toastT;
  function toast(msg, kind) {
    toastEl.textContent = msg;
    toastEl.className = "toast show " + (kind || "");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.className = "toast " + (kind || ""); }, 2600);
  }

  function api(path, opts) {
    opts = opts || {};
    opts.credentials = "same-origin";
    opts.headers = opts.headers || {};
    if (opts.json !== undefined) {
      opts.body = JSON.stringify(opts.json);
      opts.headers["Content-Type"] = "application/json";
      delete opts.json;
    }
    opts.headers["Accept"] = "application/json";
    return fetch("/admin/api" + path, opts).then(function (r) {
      if (r.status === 401 || r.status === 403) { location.href = "/admin/login.html"; throw new Error("auth"); }
      return r.text().then(function (txt) {
        var body = {};
        try { body = txt ? JSON.parse(txt) : {}; } catch (e) { body = {}; }
        if (!r.ok) throw new Error(body.message || ("Request failed (" + r.status + ")"));
        return body;
      });
    });
  }

  /* ---------- tab switching ---------- */
  $all(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      $all(".tab").forEach(function (x) { x.classList.remove("active"); });
      $all(".panel").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var id = t.getAttribute("data-tab");
      $("#panel-" + id).classList.add("active");
      if (id === "inbox") loadInbox();
      if (id === "backup") loadBackups();
      if (id === "users") loadUsers();
      if (id === "spotlight") loadSpotlight();
      if (id === "reviews") loadReviews();
      if (id === "stats") loadStats();
    });
  });

  /* ========================================================================
     VISIBILITY
     ===================================================================== */
  var SECTION_LABELS = {
    about: "About", services: "Services", voip: "VoIP", work: "Work",
    team: "Team", spotlight: "Employee of the Month", testimonials: "Testimonials",
    reviews: "Reviews & Feedback", cta: "Call-to-action band",
    payment: "Payment", careers: "Careers — “We Are Hiring”", contact: "Contact"
  };
  function renderVisibility() {
    var wrap = $("#visibilityList");
    wrap.innerHTML = "";
    var vis = state.content.visibility || {};
    Object.keys(SECTION_LABELS).forEach(function (id) {
      var on = vis[id] !== false;
      var row = document.createElement("div");
      row.className = "toggle-row";
      row.innerHTML =
        '<div><b>' + escH(SECTION_LABELS[id]) + '</b><small>Section id: ' + id + '</small></div>' +
        '<label class="switch"><input type="checkbox" ' + (on ? "checked" : "") + '><span class="slider"></span></label>';
      row.querySelector("input").addEventListener("change", function () {
        var v = this.checked;
        api("/visibility", { method: "POST", json: { section: id, visible: v } })
          .then(function () { state.content.visibility[id] = v; toast(SECTION_LABELS[id] + (v ? " shown" : " hidden"), "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
  }

  /* ========================================================================
     TEXT & LABELS
     ===================================================================== */
  function effectiveText(key, lang) {
    var ov = state.overrides[lang] && state.overrides[lang][key];
    if (ov != null && ov !== "") return ov;
    var b = state.base[lang] && state.base[lang][key];
    return b != null ? b : "";
  }
  function renderText(filter) {
    var wrap = $("#textList");
    wrap.innerHTML = "";
    var keys = Object.keys(state.base.en || {});
    filter = (filter || "").toLowerCase();
    var shown = 0;
    keys.forEach(function (key) {
      var en = state.base.en[key] || "";
      if (filter && key.toLowerCase().indexOf(filter) < 0 && en.toLowerCase().indexOf(filter) < 0) return;
      if (shown++ > 400) return;
      var row = document.createElement("div");
      row.className = "text-row";
      var grid = '<div class="text-grid">';
      LANGS.forEach(function (l) {
        var ov = (state.overrides[l] && state.overrides[l][key] != null) ? state.overrides[l][key] : "";
        var ph = state.base[l] && state.base[l][key] != null ? state.base[l][key] : "";
        grid += '<label>' + l.toUpperCase() +
          '<textarea data-lang="' + l + '" placeholder="' + escH(ph) + '">' + escH(ov) + '</textarea></label>';
      });
      grid += '</div>';
      row.innerHTML = '<div class="key">' + escH(key) + '</div>' + grid +
        '<div class="save-row"><button class="btn gold sm">Save</button></div>';
      row.querySelector("button").addEventListener("click", function () {
        var values = {};
        $all("textarea", row).forEach(function (ta) { values[ta.getAttribute("data-lang")] = ta.value; });
        api("/overrides", { method: "PUT", json: { key: key, values: values } })
          .then(function () {
            LANGS.forEach(function (l) {
              if (!state.overrides[l]) state.overrides[l] = {};
              if (values[l] && values[l].trim()) state.overrides[l][key] = values[l];
              else delete state.overrides[l][key];
            });
            toast("Saved “" + key + "”", "ok");
          })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
    if (!shown) wrap.innerHTML = '<p class="hint">No matching text.</p>';
  }

  /* ========================================================================
     COLLECTIONS (services / team / work / jobs)
     ===================================================================== */
  function expand(target, base, map) {
    LANGS.forEach(function (l) { target[base + cap(l)] = (map && map[l] != null) ? map[l] : ""; });
  }
  function loc(map, l) { return (map && map[l] != null) ? map[l] : ""; }

  // state item (nested) -> flat entity for the form/save payload
  function toEntity(kind, it) {
    var e = { id: it.id, sortOrder: it.order || 0 };
    if (kind === "services") {
      e.iconSvg = it.icon || ""; e.ctaType = it.cta || "contact"; e.visible = it.visible !== false;
      expand(e, "title", it.title); expand(e, "desc", it.desc); expand(e, "details", it.details);
    } else if (kind === "team") {
      e.name = it.name || ""; e.lead = !!it.lead; e.badge = it.badge || ""; e.visible = it.visible !== false;
      e.imagePath = it.image || ""; expand(e, "role", it.role);
    } else if (kind === "work") {
      e.visible = it.visible !== false; e.thumbPath = it.thumb || ""; e.fullPath = it.full || "";
      expand(e, "title", it.title); expand(e, "category", it.cat);
    } else if (kind === "jobs") {
      e.active = it.active !== false; e.location = it.location || ""; e.type = it.type || "";
      expand(e, "title", it.title);
    }
    return e;
  }
  function blankEntity(kind) {
    if (kind === "services") return { sortOrder: nextOrder("services"), ctaType: "contact", visible: true };
    if (kind === "team") return { sortOrder: nextOrder("team"), lead: false, visible: true };
    if (kind === "work") return { sortOrder: nextOrder("work"), visible: true };
    if (kind === "jobs") return { sortOrder: nextOrder("jobs"), active: true };
    return {};
  }
  function nextOrder(kind) {
    var list = state.content[kind] || [];
    var max = -1;
    list.forEach(function (x) { if ((x.order || 0) > max) max = x.order || 0; });
    return max + 1;
  }

  var COLLECTIONS = {
    services: {
      title: "Service",
      card: function (it) {
        return '<div class="ic">' + (it.icon || "") + '</div>' +
          '<div class="meta"><b>' + escH(loc(it.title, "en")) + '</b>' +
          '<small>' + escH((loc(it.desc, "en") || "").slice(0, 80)) + '…</small></div>' +
          tags([it.visible === false ? ["Hidden", "off"] : ["Visible", "on"], ["CTA: " + (it.cta || "contact")]]);
      },
      form: function (e) {
        return numField("Order", "sortOrder", e) +
          selField("Call-to-action", "ctaType", e, [["contact", "Learn More → Contact"], ["voip", "See VoIP → VoIP section"]]) +
          checkField("Visible on site", "visible", e) +
          areaField("Icon (SVG markup)", "iconSvg", e) +
          locArea("Title", "title", e) +
          locArea("Short description", "desc", e) +
          locArea("Details (separate bullets with “|”)", "details", e);
      }
    },
    team: {
      title: "Team member",
      card: function (it) {
        return '<img src="' + escH(it.image || "") + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
          '<div class="meta"><b>' + escH(it.name) + '</b><small>' + escH(loc(it.role, "en")) + '</small></div>' +
          tags([it.visible === false ? ["Hidden", "off"] : ["Visible", "on"], it.lead ? ["Lead"] : ["Developer"], it.badge ? [it.badge] : null]);
      },
      form: function (e) {
        return numField("Order", "sortOrder", e) +
          textField("Name", "name", e) +
          checkField("Leadership row", "lead", e) +
          textField("Badge (e.g. CEO, LEAD) — leads only", "badge", e) +
          checkField("Visible on site", "visible", e) +
          uploadField("Photo", "imagePath", e) +
          locArea("Role / title", "role", e);
      }
    },
    work: {
      title: "Work item",
      card: function (it) {
        return '<img src="' + escH(it.thumb || "") + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
          '<div class="meta"><b>' + escH(loc(it.title, "en")) + '</b><small>' + escH(loc(it.cat, "en")) + '</small></div>' +
          tags([it.visible === false ? ["Hidden", "off"] : ["Visible", "on"]]);
      },
      form: function (e) {
        return numField("Order", "sortOrder", e) +
          checkField("Visible on site", "visible", e) +
          uploadField("Thumbnail image", "thumbPath", e) +
          uploadField("Full-size image (lightbox)", "fullPath", e) +
          locArea("Title", "title", e) +
          locArea("Category", "category", e);
      }
    },
    jobs: {
      title: "Job opening",
      card: function (it) {
        return '<div class="meta"><b>' + escH(loc(it.title, "en")) + '</b><small>' +
          escH([it.location, it.type].filter(Boolean).join(" · ")) + '</small></div>' +
          tags([it.active === false ? ["Inactive", "off"] : ["Active", "on"]]);
      },
      form: function (e) {
        return numField("Order", "sortOrder", e) +
          checkField("Active (shown in Hiring)", "active", e) +
          textField("Location", "location", e) +
          textField("Type (e.g. Full-time)", "type", e) +
          locArea("Job title", "title", e);
      }
    }
  };

  function tags(arr) {
    var h = '<div class="acts-tags" style="display:flex;gap:6px;margin-left:auto;align-items:center">';
    arr.forEach(function (t) {
      if (!t) return;
      h += '<span class="tag ' + (t[1] || "") + '">' + escH(t[0]) + '</span>';
    });
    return h + '</div>';
  }

  function renderCollection(kind) {
    var wrap = $("#" + kind + "Table");
    wrap.innerHTML = "";
    var list = (state.content[kind] || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    if (!list.length) { wrap.innerHTML = '<p class="hint">Nothing yet. Use “Add” above.</p>'; return; }
    list.forEach(function (it) {
      var card = document.createElement("div");
      card.className = "item";
      var acts = state.readOnly ? '' :
        '<div class="acts"><button class="btn sm" data-edit>Edit</button>' +
        '<button class="btn sm" data-dup>Duplicate</button>' +
        '<button class="btn sm danger" data-del>Delete</button></div>';
      card.innerHTML = COLLECTIONS[kind].card(it) + acts;
      if (!state.readOnly) {
        card.querySelector("[data-edit]").addEventListener("click", function () { openEditor(kind, it); });
        card.querySelector("[data-dup]").addEventListener("click", function () { duplicateItem(kind, it); });
        card.querySelector("[data-del]").addEventListener("click", function () { deleteItem(kind, it); });
      }
      wrap.appendChild(card);
    });
  }

  /* ---- field builders (tagged with data-key / data-type) ---- */
  function textField(label, key, e) {
    return '<div class="field"><label>' + escH(label) + '</label>' +
      '<input data-key="' + key + '" data-type="text" value="' + escH(e[key] == null ? "" : e[key]) + '"></div>';
  }
  function numField(label, key, e) {
    return '<div class="field"><label>' + escH(label) + '</label>' +
      '<input type="number" data-key="' + key + '" data-type="number" value="' + (e[key] == null ? 0 : e[key]) + '"></div>';
  }
  function areaField(label, key, e) {
    return '<div class="field"><label>' + escH(label) + '</label>' +
      '<textarea data-key="' + key + '" data-type="text">' + escH(e[key] == null ? "" : e[key]) + '</textarea></div>';
  }
  function checkField(label, key, e) {
    return '<div class="field inline"><input type="checkbox" data-key="' + key + '" data-type="checkbox" ' +
      (e[key] ? "checked" : "") + '><label style="margin:0">' + escH(label) + '</label></div>';
  }
  function selField(label, key, e, opts) {
    var h = '<div class="field"><label>' + escH(label) + '</label><select data-key="' + key + '" data-type="text">';
    opts.forEach(function (o) {
      h += '<option value="' + escH(o[0]) + '"' + (e[key] === o[0] ? " selected" : "") + '>' + escH(o[1]) + '</option>';
    });
    return h + '</select></div>';
  }
  function locArea(label, base, e) {
    var h = '<div class="field"><div class="subhead">' + escH(label) + '</div><div class="grid4">';
    LANGS.forEach(function (l) {
      var k = base + cap(l);
      h += '<label>' + l.toUpperCase() + '<textarea data-key="' + k + '" data-type="text">' +
        escH(e[k] == null ? "" : e[k]) + '</textarea></label>';
    });
    return h + '</div></div>';
  }
  function uploadField(label, key, e) {
    var v = e[key] || "";
    return '<div class="field"><label>' + escH(label) + '</label><div class="uploader">' +
      '<img class="up-prev" src="' + escH(v) + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
      '<div style="flex:1"><input type="file" accept="image/*" class="up-file">' +
      '<input type="hidden" data-key="' + key + '" data-type="text" value="' + escH(v) + '">' +
      '<small class="up-path" style="color:var(--muted)">' + escH(v || "No image — upload one") + '</small></div></div></div>';
  }

  /* ---- modal editor ---- */
  var modal = $("#modal"), modalForm = $("#modalForm"), modalBody = $("#modalBody");
  var editorCtx = null;
  var modalMode = "collection";     // "collection" | "user"
  var userCtx = null;               // { id } when editing a user
  function openEditor(kind, item) {
    modalMode = "collection";
    var isNew = !item;
    var e = isNew ? blankEntity(kind) : toEntity(kind, item);
    editorCtx = { kind: kind, id: isNew ? null : item.id };
    $("#modalTitle").textContent = (isNew ? "Add " : "Edit ") + COLLECTIONS[kind].title;
    modalBody.innerHTML = COLLECTIONS[kind].form(e);
    wireUploaders();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); editorCtx = null; }
  $("#modalClose").addEventListener("click", closeModal);
  $("#modalCancel").addEventListener("click", closeModal);
  modal.addEventListener("click", function (ev) { if (ev.target === modal) closeModal(); });

  function collectFields(scope) {
    var payload = {};
    $all("[data-key]", scope).forEach(function (inp) {
      var k = inp.getAttribute("data-key"), type = inp.getAttribute("data-type"), v;
      if (type === "checkbox") v = inp.checked;
      else if (type === "number") v = parseInt(inp.value, 10) || 0;
      else v = inp.value;
      payload[k] = v;
    });
    return payload;
  }

  function wireUploaders(scope) {
    $all(".uploader", scope || modalBody).forEach(function (u) {
      var file = u.querySelector(".up-file");
      var hidden = u.querySelector("input[type=hidden]");
      var prev = u.querySelector(".up-prev");
      var pathEl = u.querySelector(".up-path");
      file.addEventListener("change", function () {
        if (!file.files || !file.files[0]) return;
        var fd = new FormData(); fd.append("file", file.files[0]);
        pathEl.textContent = "Uploading…";
        api("/uploads", { method: "POST", body: fd })
          .then(function (res) {
            hidden.value = res.path; prev.src = res.path; prev.style.visibility = "visible";
            pathEl.textContent = res.path;
            toast("Image uploaded", "ok");
          })
          .catch(function (e) { pathEl.textContent = "Upload failed"; toast(e.message, "err"); });
      });
    });
  }

  modalForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var payload = collectFields(modalBody);

    if (modalMode === "user") {
      var ureq = userCtx && userCtx.id
        ? api("/users/" + userCtx.id, { method: "PUT", json: payload })
        : api("/users", { method: "POST", json: payload });
      ureq.then(function () { closeModal(); loadUsers(); toast("User saved", "ok"); })
        .catch(function (e) { toast(e.message, "err"); });
      return;
    }

    if (!editorCtx) return;
    var kind = editorCtx.kind, id = editorCtx.id;
    var req = id
      ? api("/" + kind + "/" + id, { method: "PUT", json: payload })
      : api("/" + kind, { method: "POST", json: payload });
    req.then(function () { return refreshState(); })
      .then(function () { renderCollection(kind); closeModal(); toast("Saved", "ok"); })
      .catch(function (e) { toast(e.message, "err"); });
  });

  function deleteItem(kind, it) {
    if (!confirm("Delete “" + (loc(it.title, "en") || it.name || "this item") + "”? You can restore from a backup.")) return;
    api("/" + kind + "/" + it.id, { method: "DELETE" })
      .then(function () { return refreshState(); })
      .then(function () { renderCollection(kind); toast("Deleted", "ok"); })
      .catch(function (e) { toast(e.message, "err"); });
  }

  function duplicateItem(kind, it) {
    var e = toEntity(kind, it);
    e.id = null;
    // mark the copy so it's easy to spot
    if (e.titleEn != null) e.titleEn = (e.titleEn || "") + " (copy)";
    if (kind === "team" && e.name != null) e.name = (e.name || "") + " (copy)";
    if (e.visible !== undefined) e.visible = false; // start hidden so it isn't published half-edited
    if (e.active !== undefined) e.active = false;
    api("/" + kind, { method: "POST", json: e })
      .then(function () { return refreshState(); })
      .then(function () { renderCollection(kind); toast("Duplicated (hidden — edit then show it)", "ok"); })
      .catch(function (er) { toast(er.message, "err"); });
  }

  /* ========================================================================
     INBOX
     ===================================================================== */
  function fmtDate(iso) { try { return new Date(iso).toLocaleString(); } catch (e) { return iso; } }
  function loadInbox() {
    api("/submissions").then(function (list) {
      state.submissions = list || [];
      renderInbox();
      updateInboxCount();
    }).catch(function (e) { toast(e.message, "err"); });
  }
  function updateInboxCount() {
    var unread = state.submissions.filter(function (s) { return !s.read; }).length;
    $("#inboxCount").textContent = unread ? unread : "";
  }
  function renderInbox() {
    var wrap = $("#inboxTable");
    wrap.innerHTML = "";
    if (!state.submissions.length) { wrap.innerHTML = '<p class="hint">No submissions yet.</p>'; return; }
    state.submissions.forEach(function (s) {
      var row = document.createElement("div");
      row.className = "row" + (s.read ? "" : " unread");
      var kind = s.type === "APPLICATION" ? "Application" : "Contact";
      var subtitle = (s.subjectOrPosition || "") + (s.extra ? " · " + s.extra : "");
      var cvLink = (s.type === "APPLICATION" && s.cvFile)
        ? '<a class="btn sm" href="/admin/api/submissions/' + s.id + '/cv">Download CV</a>' : '';
      row.innerHTML =
        '<div class="row-top"><div class="info" style="display:flex;gap:10px;align-items:center">' +
          (s.read ? "" : '<span class="dot"></span>') +
          '<div><b>' + escH(kind) + ": " + escH(s.name || "") + '</b>' +
          '<small>' + escH(s.email || "") + (s.phone ? " · " + escH(s.phone) : "") + " · " + fmtDate(s.createdAt) + '</small>' +
          '<small>' + escH(subtitle) + '</small></div></div>' +
          '<div class="acts">' + cvLink +
          '<button class="btn sm" data-copy>Copy</button>' +
          '<button class="btn sm" data-read>' + (s.read ? "Mark unread" : "Mark read") + '</button>' +
          '<button class="btn sm danger" data-del>Delete</button></div></div>' +
        '<div class="body">' + escH(s.message || "") + '</div>';
      row.querySelector(".row-top").addEventListener("click", function (ev) {
        if (ev.target.closest(".acts")) return;
        row.classList.toggle("open");
      });
      row.querySelector("[data-copy]").addEventListener("click", function () {
        var text = kind + "\nName: " + (s.name || "") + "\nEmail: " + (s.email || "") +
          "\nPhone: " + (s.phone || "") + "\n" + (s.type === "APPLICATION" ? "Position" : "Subject") +
          ": " + (s.subjectOrPosition || "") + "\n" + (s.extra ? (s.type === "APPLICATION" ? "Experience: " : "Service: ") + s.extra + "\n" : "") +
          "Date: " + fmtDate(s.createdAt) + "\n\n" + (s.message || "");
        copyText(text);
      });
      row.querySelector("[data-read]").addEventListener("click", function () {
        api("/submissions/" + s.id + "/read", { method: "POST", json: { read: !s.read } })
          .then(function () { s.read = !s.read; renderInbox(); updateInboxCount(); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      row.querySelector("[data-del]").addEventListener("click", function () {
        if (!confirm("Delete this submission?")) return;
        api("/submissions/" + s.id, { method: "DELETE" })
          .then(function () { state.submissions = state.submissions.filter(function (x) { return x.id !== s.id; }); renderInbox(); updateInboxCount(); toast("Deleted", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
  }
  $("#refreshInbox").addEventListener("click", loadInbox);

  /* ========================================================================
     BACKUP & RESTORE
     ===================================================================== */
  function loadBackups() {
    api("/backups").then(function (list) { renderBackups(list || []); }).catch(function (e) { toast(e.message, "err"); });
  }
  function renderBackups(list) {
    var wrap = $("#backupTable");
    wrap.innerHTML = "";
    if (!list.length) { wrap.innerHTML = '<p class="hint">No backups yet. Create one above.</p>'; return; }
    list.forEach(function (b) {
      var row = document.createElement("div");
      row.className = "row";
      var kb = Math.max(1, Math.round((b.size || 0) / 1024));
      row.innerHTML =
        '<div class="row-top"><div class="info"><b>' + escH(b.name) + '</b>' +
        '<small>' + kb + ' KB · ' + fmtDate(b.modified) + '</small></div>' +
        '<div class="acts">' +
          '<a class="btn sm" href="/admin/api/backups/' + encodeURIComponent(b.name) + '/download">Download</a>' +
          '<button class="btn sm" data-restore>Restore</button>' +
          '<button class="btn sm danger" data-del>Delete</button></div></div>';
      row.querySelector("[data-restore]").addEventListener("click", function () {
        if (!confirm("Restore “" + b.name + "”? This replaces current content (a safety backup is taken first).")) return;
        api("/backups/" + encodeURIComponent(b.name) + "/restore", { method: "POST" })
          .then(function () { return refreshState(); })
          .then(function () { renderAllContent(); loadBackups(); toast("Content restored", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      row.querySelector("[data-del]").addEventListener("click", function () {
        if (!confirm("Delete backup “" + b.name + "”?")) return;
        api("/backups/" + encodeURIComponent(b.name), { method: "DELETE" })
          .then(function () { loadBackups(); toast("Backup deleted", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
  }
  $("#createBackup").addEventListener("click", function () {
    api("/backups", { method: "POST" }).then(function (r) { loadBackups(); toast("Backup created: " + r.name, "ok"); })
      .catch(function (e) { toast(e.message, "err"); });
  });

  /* ========================================================================
     ACCOUNT
     ===================================================================== */
  $("#pwForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var f = ev.target;
    if (f.next.value !== f.confirm.value) { toast("New passwords do not match", "err"); return; }
    api("/account/password", { method: "POST", json: { current: f.current.value, next: f.next.value } })
      .then(function (r) {
        toast(r.message || "Password updated", "ok");
        setTimeout(function () {
          fetch("/admin/logout", { method: "POST", credentials: "same-origin" })
            .finally(function () { location.href = "/admin/login.html?logout"; });
        }, 1200);
      })
      .catch(function (e) { toast(e.message, "err"); });
  });

  /* ========================================================================
     COPY TO CLIPBOARD
     ===================================================================== */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard", "ok"); }, fallbackCopy.bind(null, text));
    } else { fallbackCopy(text); }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
      toast("Copied to clipboard", "ok");
    } catch (e) { toast("Copy failed", "err"); }
  }

  /* ========================================================================
     USERS  (ADMIN only)
     ===================================================================== */
  function loadUsers() {
    api("/users").then(renderUsers).catch(function (e) { if (e.message !== "auth") toast(e.message, "err"); });
  }
  function renderUsers(list) {
    var wrap = $("#usersTable");
    wrap.innerHTML = "";
    if (!list || !list.length) { wrap.innerHTML = '<p class="hint">No users.</p>'; return; }
    list.forEach(function (u) {
      var row = document.createElement("div");
      row.className = "row";
      row.innerHTML =
        '<div class="row-top"><div class="info"><b>' + escH(u.username) +
          ' <span class="role-badge ' + escH(u.role) + '">' + escH(u.role) + '</span></b>' +
          '<small>' + escH(u.displayName || "") + '</small></div>' +
          '<div class="acts"><button class="btn sm" data-edit>Edit</button>' +
          '<button class="btn sm danger" data-del>Delete</button></div></div>';
      row.querySelector("[data-edit]").addEventListener("click", function () { openUserEditor(u); });
      row.querySelector("[data-del]").addEventListener("click", function () {
        if (!confirm("Delete user “" + u.username + "”?")) return;
        api("/users/" + u.id, { method: "DELETE" })
          .then(function () { loadUsers(); toast("User deleted", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
  }
  function openUserEditor(u) {
    modalMode = "user";
    userCtx = { id: u ? u.id : null };
    var isNew = !u;
    $("#modalTitle").textContent = isNew ? "Add user" : "Edit user: " + u.username;
    var roles = ["ADMIN", "EDITOR", "VIEWER"];
    var roleOpts = roles.map(function (r) {
      return '<option value="' + r + '"' + (((u && u.role) || "VIEWER") === r ? " selected" : "") + '>' + r + '</option>';
    }).join("");
    var html = "";
    if (isNew) {
      html += '<div class="field"><label>Username</label><input data-key="username" data-type="text" autocomplete="off"></div>';
      html += '<div class="field"><label>Password (min 8 characters)</label><input data-key="password" data-type="text" type="password" autocomplete="new-password"></div>';
    } else {
      html += '<div class="field"><label>Username</label><input value="' + escH(u.username) + '" disabled></div>';
      html += '<div class="field"><label>Reset password (leave blank to keep current)</label><input data-key="password" data-type="text" type="password" autocomplete="new-password"></div>';
    }
    html += '<div class="field"><label>Display name</label><input data-key="displayName" data-type="text" value="' + escH((u && u.displayName) || "") + '"></div>';
    html += '<div class="field"><label>Role</label><select data-key="role" data-type="text">' + roleOpts + '</select></div>';
    modalBody.innerHTML = html;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  /* ========================================================================
     EMPLOYEE SPOTLIGHT
     ===================================================================== */
  function loadSpotlight() {
    api("/spotlight").then(renderSpotForm).catch(function (e) { toast(e.message, "err"); });
  }
  function renderSpotForm(s) {
    s = s || {};
    function locA(label, base) {
      var h = '<div class="field"><div class="subhead">' + label + '</div><div class="grid4">';
      LANGS.forEach(function (l) {
        var k = base + cap(l);
        h += '<label>' + l.toUpperCase() + '<textarea data-key="' + k + '" data-type="text">' + escH(s[k] == null ? "" : s[k]) + '</textarea></label>';
      });
      return h + '</div></div>';
    }
    var f = $("#spotForm");
    f.innerHTML =
      '<div class="field inline"><input type="checkbox" data-key="enabled" data-type="checkbox" ' + (s.enabled ? "checked" : "") + '><label style="margin:0">Show on public site</label></div>' +
      '<div class="field"><label>Period</label><select data-key="period" data-type="text"><option value="MONTH"' + (s.period !== "WEEK" ? " selected" : "") + '>Month</option><option value="WEEK"' + (s.period === "WEEK" ? " selected" : "") + '>Week</option></select></div>' +
      '<div class="field"><label>Employee name</label><input data-key="name" data-type="text" value="' + escH(s.name || "") + '"></div>' +
      uploadField("Photo", "imagePath", { imagePath: s.imagePath }) +
      locA("Role / position", "role") +
      locA("Citation / reason", "citation") +
      '<div><button class="btn gold" type="submit">Save spotlight</button></div>';
    wireUploaders(f);
  }
  $("#spotForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var payload = collectFields(this);
    api("/spotlight", { method: "PUT", json: payload })
      .then(function () { toast("Spotlight saved — live on the site", "ok"); })
      .catch(function (e) { toast(e.message, "err"); });
  });

  /* ========================================================================
     REVIEWS (moderation)
     ===================================================================== */
  function starStr(n) { n = Math.round(n || 0); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  function loadReviews() {
    api("/reviews").then(renderReviews).catch(function (e) { if (e.message !== "auth") toast(e.message, "err"); });
  }
  function renderReviews(list) {
    list = list || [];
    var pending = list.filter(function (r) { return !r.approved; }).length;
    $("#reviewCount").textContent = pending ? pending : "";
    var wrap = $("#reviewsTable");
    wrap.innerHTML = "";
    if (!list.length) { wrap.innerHTML = '<p class="hint">No reviews yet.</p>'; return; }
    list.forEach(function (r) {
      var row = document.createElement("div");
      row.className = "row" + (r.approved ? "" : " unread");
      var date = ""; try { date = new Date(r.createdAt).toLocaleString(); } catch (e) {}
      row.innerHTML =
        '<div class="row-top"><div class="info">' +
          '<b>' + escH(r.name || "Anonymous") + ' <span class="rev-stars-admin">' + starStr(r.rating) + '</span> ' +
          '<span class="tag ' + (r.approved ? "on" : "off") + '">' + (r.approved ? "Approved" : "Pending") + '</span></b>' +
          '<small>' + escH(date) + '</small></div>' +
          '<div class="acts">' +
          '<button class="btn sm" data-approve>' + (r.approved ? "Unapprove" : "Approve") + '</button>' +
          '<button class="btn sm danger" data-del>Delete</button></div></div>' +
        '<div class="body" style="display:block">' + escH(r.comment || "") + '</div>';
      row.querySelector("[data-approve]").addEventListener("click", function () {
        api("/reviews/" + r.id + "/approve", { method: "POST", json: { approved: !r.approved } })
          .then(function () { loadReviews(); toast(r.approved ? "Hidden" : "Approved — now live", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      row.querySelector("[data-del]").addEventListener("click", function () {
        if (!confirm("Delete this review?")) return;
        api("/reviews/" + r.id, { method: "DELETE" })
          .then(function () { loadReviews(); toast("Deleted", "ok"); })
          .catch(function (e) { toast(e.message, "err"); });
      });
      wrap.appendChild(row);
    });
  }
  $("#refreshReviews").addEventListener("click", loadReviews);

  /* ========================================================================
     STATISTICS
     ===================================================================== */
  function loadStats() {
    api("/stats").then(renderStats).catch(function (e) { toast(e.message, "err"); });
  }
  function renderStats(s) {
    var cards = $("#statCards");
    function card(n, l) { return '<div class="stat-card"><div class="n">' + n + '</div><div class="l">' + l + '</div></div>'; }
    cards.innerHTML =
      card(s.totalViews || 0, "Total page views") +
      card(s.totalVisitors || 0, "Unique visitors") +
      card(s.todayViews || 0, "Views today") +
      card(s.todayVisitors || 0, "Visitors today") +
      card(s.daysTracked || 0, "Days tracked");
    var daily = s.daily || [];
    var max = 1;
    daily.forEach(function (d) { max = Math.max(max, d.views); });
    var chart = $("#statChart");
    chart.innerHTML = daily.map(function (d) {
      var vh = Math.round((d.views / max) * 120);
      var uh = Math.round((d.visitors / max) * 120);
      var label = d.day.slice(5); // MM-DD
      return '<div class="stat-bar" title="' + d.day + ': ' + d.views + ' views, ' + d.visitors + ' visitors">' +
        '<div class="bar" style="height:' + vh + 'px"></div>' +
        '<div class="bar v" style="height:' + uh + 'px"></div>' +
        '<div class="d">' + label + '</div></div>';
    }).join("");
    if (!$("#statLegend")) {
      var leg = document.createElement("div");
      leg.id = "statLegend"; leg.className = "stat-legend";
      leg.innerHTML = '<span><span class="sw" style="background:var(--gold)"></span>Views</span>' +
        '<span><span class="sw" style="background:#3b82f6"></span>Unique visitors</span>';
      chart.parentNode.appendChild(leg);
    }
  }
  $("#refreshStats").addEventListener("click", loadStats);

  /* ========================================================================
     BOOTSTRAP
     ===================================================================== */
  function refreshState() {
    return api("/state").then(function (c) { state.content = c; return c; });
  }
  function renderAllContent() {
    renderVisibility();
    renderCollection("services");
    renderCollection("team");
    renderCollection("work");
    renderCollection("jobs");
  }

  $("#textSearch").addEventListener("input", function () { renderText(this.value); });
  $all("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () { openEditor(b.getAttribute("data-add"), null); });
  });
  $("#addUser").addEventListener("click", function () { openUserEditor(null); });

  function applyRole() {
    $("#who").textContent = state.username ? ("· " + state.username + " · " + state.role) : "";
    if (state.role === "ADMIN") document.body.classList.add("role-admin");
    if (state.readOnly) {
      // Viewers: hide the controls that would be rejected anyway.
      $all("[data-add]").forEach(function (b) { b.style.display = "none"; });
      var cb = $("#createBackup"); if (cb) cb.style.display = "none";
    }
  }

  Promise.all([
    api("/me"),
    api("/state"),
    api("/overrides"),
    fetch("/assets/i18n/base.json", { credentials: "same-origin" }).then(function (r) { return r.json(); })
  ]).then(function (res) {
    state.username = res[0].username || "";
    state.role = res[0].role || "VIEWER";
    state.readOnly = state.role === "VIEWER";
    applyRole();
    state.content = res[1];
    state.overrides = res[2] || { en: {}, fr: {}, es: {}, de: {} };
    state.base = res[3] || { en: {} };
    LANGS.forEach(function (l) { if (!state.overrides[l]) state.overrides[l] = {}; });
    renderAllContent();
    renderText("");
    loadInbox();
    loadReviews();
  }).catch(function (e) {
    if (e.message !== "auth") toast("Failed to load: " + e.message, "err");
  });
})();
