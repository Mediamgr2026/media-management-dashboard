/* Media Management Dashboard - Code.gs
   Run setupApplication() once. Vendors from your TXT list are loaded into the Vendors sheet
   and drive every "Vendor Name" dropdown. */

var WRITE = ['Super Admin', 'Admin', 'Manager', 'Data Entry'];
var DEL = ['Super Admin', 'Admin', 'Manager'];

function B(auto) {
  return [['billNo', 'Bill Number', 'text'], ['billDate', 'Bill Date', 'date'], ['dueDate', 'Due Date', 'date'],
    ['amount', 'Bill Amount', auto ? 'auto' : 'num', auto ? 0 : 1], ['paid', 'Paid Amount', 'num'],
    ['payDate', 'Payment Date', 'date'], ['attachment', 'Attachment', 'file'], ['notes', 'Notes', 'area']];
}
var T = function (k, l, r) { return [k, l, 'text', r || 0]; };
var D = function (k, l, r) { return [k, l, 'date', r || 0]; };
var NM = function (k, l, r) { return [k, l, 'num', r || 0]; };
var V = ['vendor', 'Vendor Name', 'vendor', 1];

var MODS = {
  fm: { sheet: 'FM_Ads', title: 'FM / Radio', f: [D('date', 'Advertisement Date', 1), V, T('channel', 'FM Channel'), T('campaign', 'Campaign Name'), T('adType', 'Advertisement Type'), NM('spots', 'Number of Spots'), NM('spotSec', 'Spot Duration (sec)')].concat(B()) },
  tv: { sheet: 'TV_Ads', title: 'TV', f: [D('date', 'Advertisement Date', 1), V, T('channel', 'TV Channel'), T('program', 'Program Name'), T('campaign', 'Campaign Name'), NM('spots', 'Number of Spots'), NM('spotSec', 'Spot Duration (sec)'), T('slot', 'Time Slot')].concat(B()) },
  hoarding: { sheet: 'Hoardings', title: 'Hoarding', f: [V, T('location', 'Location', 1), T('zone', 'Area'), T('size', 'Hoarding Size'), D('start', 'Start Date', 1), D('end', 'End Date', 1), ['duration', 'Duration', 'auto'], D('dueDate', 'Due Date', 1), NM('amount', 'Amount', 1), NM('paid', 'Paid Amount'), T('billNo', 'Bill Number'), D('billDate', 'Bill Date'), ['cancelled', 'Cancelled', 'select', 0, ['No', 'Yes']], ['attachment', 'Photo', 'file'], ['notes', 'Notes', 'area']] },
  cable: { sheet: 'Local_Cable', title: 'Local Cable', f: [D('date', 'Date', 1), V, T('operator', 'Cable Operator'), T('zone', 'Area'), T('campaign', 'Campaign'), D('start', 'Start Date'), D('end', 'End Date'), ['duration', 'Number of Days', 'auto'], NM('adSec', 'Advertisement Duration (sec)')].concat(B()) },
  pamphlet: { sheet: 'Pamphlets', title: 'Pamphlet', f: [D('date', 'Date', 1), V, T('zone', 'Distribution Area'), T('campaign', 'Campaign Name'), NM('qty', 'Number of Pamphlets', 1), NM('rate', 'Cost Per Pamphlet', 1), D('distDate', 'Distribution Date')].concat(B(true)) },
  showroom: { sheet: 'Showroom_Display', title: 'Showroom Display', f: [D('date', 'Date', 1), V, T('showroom', 'Showroom Name'), T('location', 'Location'), T('displayType', 'Display Type'), T('campaign', 'Campaign Name'), D('start', 'Start Date'), D('end', 'End Date'), ['duration', 'Duration', 'auto']].concat(B()) },
  sms: { sheet: 'SMS_Charges', title: 'SMS Charges', f: [D('date', 'Date', 1), V, T('provider', 'SMS Provider'), T('campaign', 'Campaign Name'), T('audience', 'Target Audience'), NM('qty', 'Number of SMS', 1), NM('rate', 'Cost Per SMS', 1), D('start', 'Campaign Start Date'), D('end', 'Campaign End Date')].concat(B(true)) },
  sponsor: { sheet: 'Sponsors', title: 'Sponsor', f: [D('date', 'Date', 1), V, T('sponsor', 'Sponsor Name', 1), T('organizer', 'Vendor / Organizer'), T('campaign', 'Campaign / Program'), T('sponsorType', 'Sponsorship Type'), D('start', 'Start Date'), D('end', 'End Date')].concat(B()) },
  vinyl: { sheet: 'Vinyl_Flex', title: 'Vinyl / Flex Print', f: [D('date', 'Date', 1), V, T('campaign', 'Campaign Name'), T('material', 'Material Type'), NM('width', 'Width (ft)', 1), NM('height', 'Height (ft)', 1), NM('qty', 'Quantity', 1), ['sqft', 'Area (sq.ft)', 'auto'], NM('rate', 'Rate Per Sq.Ft', 1), ['printAmt', 'Printing Amount', 'auto'], NM('install', 'Installation Amount')].concat(B(true)) },
  wall: { sheet: 'Wall_Painting', title: 'Wall Painting', f: [D('date', 'Date', 1), V, T('location', 'Location'), NM('width', 'Width (ft)', 1), NM('height', 'Height (ft)', 1), ['sqft', 'Area (sq.ft)', 'auto'], D('start', 'Start Date'), D('end', 'End Date'), ['duration', 'Duration', 'auto'], NM('paintAmt', 'Painting Amount'), NM('matAmt', 'Material Amount'), NM('labAmt', 'Labour Amount'), D('dueDate', 'Due Date'), T('billNo', 'Bill Number'), D('billDate', 'Bill Date'), NM('paid', 'Paid Amount'), D('payDate', 'Payment Date'), ['amount', 'Total Amount', 'auto'], ['attachment', 'Photo', 'file'], ['notes', 'Notes', 'area']] },
  events: { sheet: 'Sponsored_Events', title: 'Sponsored Events', f: [T('name', 'Event Name', 1), D('date', 'Event Date', 1), ['startTime', 'Start Time', 'time'], ['endTime', 'End Time', 'time'], T('venue', 'Venue'), T('location', 'Location'), T('organizer', 'Organizer'), T('contact', 'Contact Person'), T('phone', 'Contact Number'), T('sponsor', 'Sponsor Name', 1), T('sponsorType', 'Sponsor Type'), ['vendor', 'Vendor Name', 'vendor', 0], NM('amount', 'Sponsor Amount', 1), NM('paid', 'Paid Amount'), D('dueDate', 'Due Date'), D('payDate', 'Payment Date'), NM('audience', 'Expected Audience'), ['attachment', 'Photo / Document', 'file'], ['notes', 'Notes', 'area']] }
};
var EXTRA = ['duration', 'sqft', 'printAmt', 'balance', 'payStatus', 'hStatus', 'createdBy', 'updatedAt'];
var VH = ['id', 'name', 'company', 'category', 'contact', 'phone', 'email', 'address', 'gst', 'status', 'createdAt', 'updatedAt'];
var UH = ['id', 'name', 'email', 'phone', 'role', 'department', 'status', 'createdAt', 'lastLogin'];
var AH = ['id', 'time', 'user', 'action', 'module', 'recordId', 'prev', 'next'];

/* ---------- entry + setup ---------- */
function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Media Management Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function setupApplication() { setupDatabase(); setupDriveFolders(); Logger.log('Setup complete. Vendors loaded: ' + importVendors_(VENDOR_SEED).added); }

function setupDatabase() {
  var p = PropertiesService.getScriptProperties(), s;
  if (p.getProperty('SSID')) s = SpreadsheetApp.openById(p.getProperty('SSID'));
  else { s = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Media Management DB'); p.setProperty('SSID', s.getId()); }
  var defs = { Users: UH, Vendors: VH, Audit_Log: AH, Settings: ['key', 'value'] };
  Object.keys(MODS).forEach(function (k) { defs[MODS[k].sheet] = hdr_(k); });
  Object.keys(defs).forEach(function (n) {
    var sh = s.getSheetByName(n) || s.insertSheet(n), h = defs[n];
    sh.getRange(1, 1, sh.getMaxRows(), h.length).setNumberFormat('@'); // text: no date/timezone shifts
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#1e3a8a').setFontColor('#fff');
    sh.setFrozenRows(1);
  });
}
function setupDriveFolders() {
  var root = folder_('Media Management', DriveApp.getRootFolder());
  ['Event Photos', 'Hoarding Photos', 'Bills', 'Sponsor Documents', 'Flex Designs', 'Wall Painting'].forEach(function (n) { folder_(n, root); });
}
function folder_(n, parent) { var i = parent.getFoldersByName(n); return i.hasNext() ? i.next() : parent.createFolder(n); }
function ss_() { return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SSID')); }
function hdr_(k) { var h = ['id']; MODS[k].f.forEach(function (f) { h.push(f[0]); }); EXTRA.forEach(function (e) { if (h.indexOf(e) < 0) h.push(e); }); return h; }
function today_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'); }
function now_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'); }
function wrap_(fn) { try { return { success: true, data: fn() }; } catch (e) { return { success: false, message: e.message }; } }

function read_(name) {
  var v = ss_().getSheetByName(name).getDataRange().getValues(), h = v[0];
  return v.slice(1).filter(function (r) { return r[0] !== ''; }).map(function (r) { var o = {}; h.forEach(function (k, i) { o[k] = r[i]; }); return o; });
}
function append_(name, hd, objs) {
  if (!objs.length) return;
  var sh = ss_().getSheetByName(name);
  sh.getRange(sh.getLastRow() + 1, 1, objs.length, hd.length).setValues(objs.map(function (o) { return hd.map(function (k) { return o[k] == null ? '' : o[k]; }); }));
}

/* ---------- users & permissions ---------- */
function getCurrentUser() {
  var email = (Session.getActiveUser().getEmail() || '').toLowerCase();
  var users = read_('Users');
  if (!users.length && email) { // first person to open the app becomes Super Admin
    var u = { id: 'U-001', name: email.split('@')[0], email: email, phone: '', role: 'Super Admin', department: 'Management', status: 'Active', createdAt: now_(), lastLogin: now_() };
    append_('Users', UH, [u]); return u;
  }
  var me = users.filter(function (u) { return String(u.email).toLowerCase() === email && u.status === 'Active'; })[0];
  if (!me) throw new Error('Access denied for ' + (email || 'unknown user') + '. Ask a Super Admin to add you in the Users sheet.');
  return me;
}
function checkPermission(roles) { var u = getCurrentUser(); if (roles && roles.indexOf(u.role) < 0) throw new Error('Your role (' + u.role + ') cannot do this.'); return u; }

/* ---------- shared compute (also sent to browser so the form previews live) ---------- */
function compute(k, r, today) {
  var N = function (x) { return Number(x) || 0; }, o = {}, x;
  for (x in r) o[x] = r[x];
  var D = function (s) { return new Date(s + 'T00:00:00Z').getTime(); };
  if (o.start && o.end) o.duration = Math.round((D(o.end) - D(o.start)) / 864e5) + 1;
  if (k == 'pamphlet' || k == 'sms') o.amount = N(o.qty) * N(o.rate);
  if (k == 'vinyl') { o.sqft = N(o.width) * N(o.height) * N(o.qty); o.printAmt = o.sqft * N(o.rate); o.amount = o.printAmt + N(o.install); }
  if (k == 'wall') { o.sqft = N(o.width) * N(o.height); o.amount = N(o.paintAmt) + N(o.matAmt) + N(o.labAmt); }
  o.balance = N(o.amount) - N(o.paid);
  o.payStatus = N(o.amount) > 0 && N(o.paid) >= N(o.amount) ? 'PAID' : N(o.paid) > 0 ? 'PARTIALLY PAID' : (o.dueDate && today > o.dueDate ? 'OVERDUE' : 'PENDING');
  if (k == 'hoarding' && o.start && o.end) o.hStatus = o.cancelled == 'Yes' ? 'Cancelled' : today < o.start ? 'Upcoming' : today > o.end ? 'Expired' : (D(o.end) - D(today)) / 864e5 <= 7 ? 'Expiring Soon' : 'Active';
  return o;
}
function validate_(k, o) {
  var e = [], N = Number;
  MODS[k].f.forEach(function (f) { if (f[3] && (o[f[0]] === '' || o[f[0]] == null || o[f[0]] === 0 && f[2] !== 'num')) e.push(f[1] + ' is required'); });
  ['amount', 'paid', 'rate', 'install', 'paintAmt', 'matAmt', 'labAmt'].forEach(function (x) { if (o[x] !== '' && o[x] != null && N(o[x]) < 0) e.push('Amounts cannot be negative'); });
  ['qty', 'width', 'height'].forEach(function (x) { if (o[x] !== '' && o[x] != null && N(o[x]) <= 0) e.push(x + ' must be positive'); });
  if (o.start && o.end && o.start > o.end) e.push('Start Date cannot be after End Date');
  if (N(o.paid) > N(o.amount)) e.push('Paid Amount cannot exceed Bill Amount');
  return e.filter(function (v, i) { return e.indexOf(v) == i; });
}

/* ---------- vendors (dropdown source) ---------- */
function getVendorsRaw_() {
  var c = CacheService.getScriptCache(), hit = c.get('vendors');
  if (hit) return JSON.parse(hit);
  var v = read_('Vendors'); try { c.put('vendors', JSON.stringify(v), 600); } catch (e) {}
  return v;
}
function getVendors() { return wrap_(function () { checkPermission(); return getVendorsRaw_(); }); }
function getActiveVendors() { return wrap_(function () { checkPermission(); return getVendorsRaw_().filter(function (v) { return v.status !== 'Inactive'; }); }); }
function norm_(s) { return String(s).replace(/\s+/g, ' ').trim().toLowerCase(); }
function importVendors_(names) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var ex = read_('Vendors'), seen = {}, max = 0, add = [], dup = 0, blank = 0;
    ex.forEach(function (v) { seen[norm_(v.name)] = 1; max = Math.max(max, parseInt(String(v.id).replace(/\D/g, ''), 10) || 0); });
    names.forEach(function (n) {
      n = String(n).replace(/\s+/g, ' ').trim();
      if (!n) { blank++; return; }
      if (seen[norm_(n)]) { dup++; return; }
      seen[norm_(n)] = 1; max++;
      add.push({ id: 'V' + ('0000' + max).slice(-4), name: n, status: 'Active', createdAt: now_(), updatedAt: now_() });
    });
    append_('Vendors', VH, add); CacheService.getScriptCache().remove('vendors');
    return { added: add.length, duplicatesSkipped: dup, blankSkipped: blank, total: names.length };
  } finally { lock.releaseLock(); }
}
function importVendorsFromTxt(text) { return wrap_(function () { var u = checkPermission(WRITE); var r = importVendors_(String(text).split(/\r?\n/)); writeAuditLog('Import', 'Vendors', '-', '', r); return r; }); }
function saveVendor(d) {
  return wrap_(function () {
    checkPermission(WRITE);
    if (!d.name || !String(d.name).trim()) throw new Error('Vendor Name is required');
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) throw new Error('Invalid email');
    if (d.phone && !/^[0-9+\-\s()]{7,15}$/.test(d.phone)) throw new Error('Invalid phone');
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var all = read_('Vendors'), sh = ss_().getSheetByName('Vendors');
      if (all.some(function (v) { return v.id !== d.id && norm_(v.name) === norm_(d.name); })) throw new Error('Vendor already exists');
      if (d.id) {
        var i = all.map(function (v) { return v.id; }).indexOf(d.id); if (i < 0) throw new Error('Vendor not found');
        var o = {}; VH.forEach(function (k) { o[k] = d[k] != null ? d[k] : all[i][k]; }); o.updatedAt = now_();
        sh.getRange(i + 2, 1, 1, VH.length).setValues([VH.map(function (k) { return o[k]; })]);
      } else {
        var m = 0; all.forEach(function (v) { m = Math.max(m, parseInt(String(v.id).replace(/\D/g, ''), 10) || 0); });
        d.id = 'V' + ('0000' + (m + 1)).slice(-4); d.createdAt = d.updatedAt = now_(); d.status = d.status || 'Active'; append_('Vendors', VH, [d]);
      }
      CacheService.getScriptCache().remove('vendors'); writeAuditLog('Save', 'Vendors', d.id, '', d); return d;
    } finally { lock.releaseLock(); }
  });
}

/* ---------- generic CRUD ---------- */
function vmap_() { var m = {}; getVendorsRaw_().forEach(function (v) { m[v.id] = v.name; }); return m; }
function getRecords(k) {
  return wrap_(function () {
    checkPermission(); var vm = vmap_(), t = today_();
    return read_(MODS[k].sheet).map(function (r) { var c = compute(k, r, t); c.vendorName = vm[r.vendor] || ''; return c; });
  });
}
function saveRecord(k, d) {
  return wrap_(function () {
    var user = checkPermission(WRITE), M = MODS[k], lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var o = {};
      M.f.forEach(function (f) { if (f[2] != 'auto' && d[f[0]] != null) o[f[0]] = d[f[0]]; });
      if (M.f.some(function (f) { return f[0] == 'vendor'; })) { // vendor name -> Vendor ID (must exist in master list)
        var name = String(d.vendor || '').trim();
        if (name) {
          var v = getVendorsRaw_().filter(function (x) { return norm_(x.name) === norm_(name) && x.status !== 'Inactive'; })[0];
          if (!v) throw new Error('Select a vendor from the list (or add it in Vendors first).');
          o.vendor = v.id;
        } else o.vendor = '';
      }
      var c = compute(k, o, today_()), err = validate_(k, c); if (err.length) throw new Error(err.join('; '));
      var all = read_(M.sheet), sh = ss_().getSheetByName(M.sheet), h = hdr_(k), warn = '';
      if (c.billNo && all.some(function (r) { return r.id !== d.id && String(r.billNo) === String(c.billNo); })) warn = ' (Warning: duplicate Bill Number)';
      c.updatedAt = now_(); c.createdBy = user.email;
      if (d.id) {
        var i = all.map(function (r) { return r.id; }).indexOf(d.id); if (i < 0) throw new Error('Record not found');
        c.id = d.id; c.createdBy = all[i].createdBy;
        sh.getRange(i + 2, 1, 1, h.length).setValues([h.map(function (x) { return c[x] == null ? '' : c[x]; })]);
        writeAuditLog('Edit', M.title, c.id, all[i], c);
      } else {
        c.id = k.slice(0, 3).toUpperCase() + '-' + Date.now().toString(36).toUpperCase(); append_(M.sheet, h, [c]); writeAuditLog('Create', M.title, c.id, '', c);
      }
      return { id: c.id, warning: warn };
    } finally { lock.releaseLock(); }
  });
}
function deleteRecord(k, id) {
  return wrap_(function () {
    checkPermission(DEL); var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var all = read_(MODS[k].sheet), i = all.map(function (r) { return r.id; }).indexOf(id); if (i < 0) throw new Error('Record not found');
      ss_().getSheetByName(MODS[k].sheet).deleteRow(i + 2); writeAuditLog('Delete', MODS[k].title, id, all[i], ''); return id;
    } finally { lock.releaseLock(); }
  });
}
function writeAuditLog(action, module, recordId, prev, next) {
  var u = (Session.getActiveUser().getEmail() || 'unknown');
  append_('Audit_Log', AH, [{ id: 'L' + Date.now(), time: now_(), user: u, action: action, module: module, recordId: recordId, prev: JSON.stringify(prev || '').slice(0, 4000), next: JSON.stringify(next || '').slice(0, 4000) }]);
}

/* ---------- files ---------- */
function uploadFile(base64Data, fileName, mimeType, folderName) {
  return wrap_(function () {
    checkPermission(WRITE);
    if (['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].indexOf(mimeType) < 0) throw new Error('Only PDF, JPG, PNG, WEBP allowed');
    var root = folder_('Media Management', DriveApp.getRootFolder()), f = folder_(folderName || 'Bills', root);
    var file = f.createFile(Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  });
}

/* ---------- bootstrap + dashboard ---------- */
function init() {
  return wrap_(function () {
    var u = getCurrentUser(), cfg = {};
    Object.keys(MODS).forEach(function (k) { cfg[k] = { title: MODS[k].title, f: MODS[k].f }; });
    return { user: u, cfg: cfg, computeSrc: compute.toString(), vendors: getVendorsRaw_().filter(function (v) { return v.status !== 'Inactive'; }).map(function (v) { return v.name; }) };
  });
}
function getDashboardData() {
  return wrap_(function () {
    checkPermission(); var t = today_(), r = { spend: 0, paid: 0, pending: 0, overdue: 0, records: 0, hoardings: 0, events: 0, cat: {}, status: { PAID: 0, PENDING: 0, 'PARTIALLY PAID': 0, OVERDUE: 0 } };
    Object.keys(MODS).forEach(function (k) {
      var rows = read_(MODS[k].sheet).map(function (x) { return compute(k, x, t); });
      r.cat[MODS[k].title] = 0;
      rows.forEach(function (x) {
        var a = Number(x.amount) || 0, p = Number(x.paid) || 0; r.spend += a; r.paid += p; r.records++; r.cat[MODS[k].title] += a; r.status[x.payStatus]++;
        if (x.payStatus == 'OVERDUE') r.overdue += x.balance; else r.pending += x.balance;
        if (k == 'hoarding' && (x.hStatus == 'Active' || x.hStatus == 'Expiring Soon')) r.hoardings++;
        if (k == 'events' && x.date >= t) r.events++;
      });
    });
    r.vendors = getVendorsRaw_().length; return r;
  });
}

/* Vendors from your TXT list (333 unique names) */
var VENDOR_SEED = ["SAI TV- KUMBAKONAM", "SIGARAM TV", "BHAKTI INDUSTRIES.", "JAYAM TV", "JOTHI TV", "MUTHUKKANNU.S", "RENGA MANSION", "S TV-PATTUKOTTAI", "3D CREATIVE", "YAZHINI TV", "SURYAN FM RADIO", "A1 TV", "AMMA VISION KUMBAKONAM", "APPLLE TV", "CIN TV", "CTN PUDUKOTTAI(NEW)", "GEE TV (NEW PAN)", "GR TV -NEW PAN", "VICTORIA BAG", "VASCO BIO BAG ENTERPRISES", "AZHAKI TV", "TCU", "THE DAILY THANTHI", "THIRUMALAI TV- KARUR", "SRM AGENCY", "SS TV", "SUCESS GRAPIX", "SURIYA COLOUR BAGS", "SRI MAHARAMS SWEETS N BAKES DRINKS", "ASERA TECHNOLOGIES PVT LTD", "SRI VIJAYALAKSHMI AGENCIES", "SRI ARUN AGENCIES", "SRI GANABATHI AGENCIES", "SRI GANAPATHY BAGS", "SHUNMUGA DIGITECH SERVICES", "SI DIGITAL,", "SONA MARKETINGS", "SHALINI CABLE SYSTEM", "ARMAXTER", "SAI TV", "ARASU TV", "SCHINDLER INDIA PRIVATE LIMITED", "SECTORQUBE TECHNOLABS PRIVATE LIMIT", "ROYAL ENTERPRISES (COVER)", "S.M.A. OFFSET PRINTERS.", "RCN TV", "RETAIL SOLUTION AND TECHNOLOGIES", "A. PANDI AGENCIES", "ANNAMALAI STATIONERY", "ANJALI FASHION BAGS", "PROFESSIONAL ELEVATORS PVT LTD", "PUTHU VASANTHAM NETWORK", "R MEDIA", "R R TEX", "R.S. MANUFACTURING", "R.S. MARKETING", "R.YESODHAI", "PAS EXPORTS", "ANBU TV", "ANBU TV PUDUKKOTTAI", "PERUMAL TRADING CORPORATION", "PHOENIX TYRES", "PL.A.MOTORS", "PRANAV ENTERPRISES", "NILA TV", "OM RADHA PERFUMERY", "OM SELVAGANAPATHY GAS AGENCY", "P L A GARMENTS", "MULTITASK COMPUTER SERVISES", "MURARI D-SIGN", "MX-CORPORATION", "NARMADHA TRADER", "NATIONAL INSURANCE COMPANY LIMITED", "MALAR PUBLICATIONS LIMITED", "MARUDHAR MARKETINGS.", "MARUTHI PLASTICS & PACKAGING CHENNA", "MASS MULTIPACK INDUSTRIES.", "MEDIA.COM", "LOYLTY REWARDZ MNGT PVT LTD", "M MEDIA", "M.P.M.MUTHU GENERAL STORES", "MAHA JUTE.", "MAHARAJA SCREEN", "KREATE POLYTECH", "KAL RADIO LIMITED", "KAL RADIO LIMITED.", "KALAI COLOR PRINTERS.", "KALAI COLOUR PRINTERS", "KARUR TV", "KB ASSOCIATE.", "KLAUS MULTIPARKING SYSTEMS", "JAILAXMI AUTO WORKS & AGENCIES (P)", "AIRPRISM TECCH", "JN MACHINERIES PRIVATE LIMITED", "JOHNSON LIFTS PRIVATE LTD", "MALAR PUBLICATION LIMITED", "HI TECH SOLUTIONS", "A D S BAGS", "HILTECH SECURITY SYSTEMS", "ADRENALIN ESYSTEMS LIMITED", "IDEAL CORPORATE SERVICES", "IMPRINTA (AN UNIT SSG GROUP)", "J TV", "ABU COMPUTERS", "GEETHA LAMINATION", "ACME PROTECTIVE SOLUTIONS PVT LTD", "GOUSHIKA CONTRACT WORKS", "GREEN SIGNAL INDIA", "GUPTA PRINTERS", "H HOWDALI @ BABU", "EVEREST FASHIONS", "FLUID CONTROL SPECIALISTS", "ABIRAMI ELECTRICAL", "ABIRAMI ENTERPRISES", "GANESH AGENCY", "CRESTECH SOLUTIONS", "CROSSFIELDS WATER PURIFIERS", "DIA AGENCIES", "DIFFERENT STROKEZ", "DINAMALAR", "DINSEN TRADER", "DIVAS FASHION", "DIVYA BAGS.", "BRITE APPS", "C SARAVANAN INTERIORS", "CHAKKRA PEST MANAGEMENT .", "CHENNAI AQUA PURE SYSTEMS", "OTTO CLOTHING PVT.LTD", "CONSULTING & BEYOND", "ROYAL ENTERPRISES.,", "UMA AGENCIES", "ESSAE-TERAOKA PVT LTD", "AIR MEDIA ADVERTISING", "AMMA VISION-NEW PAN", "ENTERTAINMENT NETWORK(INDIA)LIMITED", "GALAXY FOOD INDUSTRY", "JUPITER AIR SYSTEM", "POOJA SPORTS", "SONA MARKETING", "SRI SAI DECORATORS", "T T TELE SERVICES", "SAIKSHA AGENCIES", "WHEELSEYE TECHNOLOGY INDIA PVT LTD", "GRAND ADVERTISING", "S S SERVICES.", "SAI TV MANNARGUDI", "MASK ENGINEERING", "CHELLAM MOTORS PRIVATE LIMITED", "A.K.K.CHANDIRASEKARAN", "VBK COMPUTERS", "SOCIETY OF ST JOSEPH'S COLLEGE", "C SOUNDRALAKSHMI", "MEENAKSHI ANNAMALAI", "SWAMINATHAN A", "V.VATCHALA", "A. GOMATHI", "G.V.AIRCON SYSTEMS", "SAFE HOME", "SRI KALPANA BATTERY WORKS", "AVATHARAM PUBLICATIONS", "KUN CAPITAL", "PRABALS COMMERCIALS INDIA LLP", "ANVER ELECTRICAL SERVICE", "SRI VIJAYA PLAYWOOD PVT.LTD.,", "SONIYA TRENDZ", "SRI RAM CONSTRUCTION", "EVEREST HARDWARES", "ANNAI ABIRAMI TRADERS", "MANGAL & MANGAL", "SRI BALAJI SPORTS", "K.R.T MOTORS(P) LTD.", "MY SHELTERS", "SRIRAJ AUTO AGENCY PRIVATE LIMITED", "S.S.LABELS", "JAYALAKSHMI AGENCIES", "OM AUTOMOBILES", "LEAF LAND AUTO PARTS", "ANANDA STORES", "DREAMERS", "VASANTH & CO", "KM ENTERPRISES", "KALAI REFRIGRATION", "RAKSHAN EQUIPMENTS", "SARATHI TRADING CO", "CARRIER AIR CONDITIONIING", "NARMATHA ENTERPRISES", "RK WINDOWS", "V J CARS", "R.S.ELECTRONICS", "NAVIIN AGENCY", "STEEL WORLD", "SRM ENTERPRISES - TRICHY", "PIONEER EXPORTS", "MEDWELL LOGIX", "GURU FURNITURE", "SONA FANCY", "SV PLASTICS", "IMAGE HI TECH FURNITURE CO", "BHANU PLASTICS HOUSE", "PRANAV ENTERPRISE", "KALAMASSERY DECORATION", "VIFAA ENGINEERING ENTERPRISES", "JAM JAM TEA & COFEE BAR", "SRI VENNILA", "SCHINDLER INDIA PRIVATE LTD", "KRISHNAA AUTOMOBILE", "NO.1 HIRE VESSEL SHOP", "KARPAGAA KITCHEN METAL WORKS", "NEW SPIDERS FINE SOLUTIONS", "BANNARIYAMMAN AUTOMOBILES (P) LTD", "KREATIVE MEDIA", "I FIT TAILOR", "JUST DIAL", "VSK ENTERPRISES", "PILLAI CERAMICS", "BRIGHT MARBLES AND GRANITES", "SAINI MAARKETING", "OXINA CARS PRIVATE LIMITED", "CLASSIC GYPSUM", "MANI EGG SHOP", "NOBLE ELECTRICALS", "UNIVERSAL SHOPPE", "MITRA BIKE SERVICE", "WATTINDIA ELECTRICAL AND SOLAR", "SVS ENTERPRISES", "JAVID POLICE STORE", "RAJESH THREAD HOUSE", "ALAGAMBAL COACH BUILDERS", "MARUTI SUZUKI", "NEW INDIA ASSURANCE", "SBI GENERAL INSURANCE COMPANY LIMIT", "S.S Ultra Readymix", "INBA RESTO & CAFE", "SRI AMMAN MOTORS", "PLK AGENCIES", "THERMAL ART ENGINEERS", "DINAMALAR NEWS PAPER", "MPM MUTHU ASSOCIATES", "KLEENMART", "ARS AGENCIES", "SAMANTHA LACE HOUSE", "NIVEEDHA IT WORLD", "ACME INTEGRATED MARKETING", "DHINAA'S", "LCA ENTERTAINMENTS", "B.G.NAIDU SWEETS PRIVATE LIMITED", "ESSAR STEEL INDUSTRIES", "THAMBU SHOE COMPANY", "M.A.TYRE CORPORATION", "SRI PALANI ANDAVAR ENTERPRISES", "ARAVIND SANTHANAM", "SINGIRI CHANDRASEKHAR GUPTA SONS", "APPLE TV 4K HD", "OUR TRICHYS DIGITAL MARKETING", "JRR CIVIL TECH PRIVATE LIMITED", "M.PRITHIVIRAJ", "KATHIRAVAN P", "SHAULAHAMED", "MARY S", "ANANAD M", "SUBRAMANIAN M", "VIJAYRAJ GAS APPLIANCES", "NILKAMAL LIMITED", "G R K SCALES SERVICE", "FANGLE FRISK DANCE STUDIO", "ANANTH CYCLE AGENCIES", "KARAL MARX G", "SHALOM FURNITURE AND ELECTRONICS", "KENON LIFTS", "ELITE REXINE", "COLORS AND SIGNAGE SOLUTIONS", "B-FIT FOUNDATION", "SOUTH INDIAN MARTIAL ARTS SPORTS AC", "SIVA DECORATION", "SMART CONCEPTS & SOLUTIONS", "HOLY CROSS COLLEGE (TRICHY)", "ANNAMALAI PAPER STORE", "ADS BRAHMA", "KALANDHAR TRADERS", "NATIONAL ELECTRICALS", "PRAVAAG KRISHNAN'S EDUCATIONAL TRUS", "SIVASAKTHI ACADEMY", "BISHOP HYBER COLLEGE", "MODERN SCALE", "JAYANTHI RAJKUMAR", "MAINETTI (INDIA) PVT. LTD.", "SELVI ALIGNMENT", "SRI ALAGAMBAL COACH BUILDERS", "BINDU SATHYAN", "MOHAMED ABDULLAH", "THENNARASU K", "K V ELECTRICALS & ASSEMBLY", "HITEASE", "FACILE MANAGEMENT SERVICES OPC PVT", "PALANIAPPA HELMETS", "C SIGNS", "SREE KARPAGAMOORTHY MOTORS LLP", "ASERA TECHNOLOGIES", "SND FURNITURE", "ASWIN", "P RAGUPATHI", "V3 EXECUTORS", "TWILIGHT DANCE STUDIO", "MEGA CABLE TV SHOP", "ANNAI LEO AUTO ACCESSORIES", "INNER WHEEL CLUB OF TRIUCHI ROCKFOR", "NOOR MOHAMED U", "SRI VIJAYAA TOUGHENED GLASS PVT LTD", "GLOW MEDIA", "MANASA ACADEMY", "SUCCESS PRINT", "GOPURAM BAGS", "AMIRTHA VASU", "INFINITE ENGINEERING", "GIRI SERVICE CENTRE", "SREE RAAM COACH MOTORS LLP", "RIHA MOBILES", "NETTYFISH SOLUTIONS PVT LTD", "ALAGHU BUILDMAART PRIVATE LIMITED", "MABS ASSOCIATES", "PLAY STORE", "LE ECO GREEN CARE PRIVATE LIMITED", "KUN CAPITAL AUTOMOTIVE PRIVATE LIMI", "SRI KRISHNA REXINE", "SRI AYYAN SUBASH AUTO PARTS", "AGRASEN GLOBAL PVT LTD", "GENWAY CONTRACTORS", "CHIDAMBARANATHAN M", "REHAB CHARITABLE TRUST", "M S CORE TECHNOLOGY", "SMILY MEDIA", "M. SETH AND SONS (ELECTRICALS)", "R.M.H. CORPORATION AGENCIES"];
