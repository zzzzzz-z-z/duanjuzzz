// =============================================================
// 短剧工作台 · 工具页统一皮肤 + 更新入口
// 每个工具页面在 </head> 前引入一行即可：
//   <script src="_skin.js" data-tool="工具名" data-kind="bookmark|plain"></script>
//  - data-tool  ：工具名，用于过滤 updates.js 里该工具的更新记录
//  - data-kind  ：bookmark=书签工具（显示"全部书签"类更新）；plain=普通工具
// 功能：统一页面风格（渐变背景/圆角/按钮/输入框）+ 右上角感叹号查看本工具更新
// =============================================================
(function () {
  'use strict';
  var cur = document.currentScript;
  var TOOL = (cur && cur.getAttribute('data-tool')) || '';
  var KIND = (cur && cur.getAttribute('data-kind')) || 'plain';

  // ---------- 统一皮肤 CSS ----------
  var skin = document.createElement('style');
  skin.id = 'toolhub-skin';
  skin.textContent = [
    /* 页面底色：与集合页同系的浅渐变 */
    'body{background:linear-gradient(160deg,#f7f9ff 0%,#eef3ff 45%,#fdf4ff 100%)!important;background-attachment:fixed!important;color:#2b2b2b!important;font-family:"Microsoft YaHei","PingFang SC",sans-serif!important;}',
    /* 标题：蓝紫渐变字 */
    'h1,h2,h3{background:linear-gradient(90deg,#1565c0,#7c4dff)!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;color:transparent!important;letter-spacing:.3px;}',
    /* 容器：白底圆角卡片 */
    '.wrap,.card,.container,.box{background:#fff!important;border:1px solid #e3e8ee!important;border-radius:14px!important;box-shadow:0 10px 30px rgba(30,60,120,.08)!important;}',
    /* 输入类：圆角 + 聚焦光晕 */
    'input,textarea,select{border-radius:8px!important;border:1px solid #d5dbe3!important;background:#fafbfc!important;font:inherit!important;transition:border-color .15s,box-shadow .15s,background .15s!important;}',
    'input:focus,textarea:focus,select:focus{outline:none!important;border-color:#1976d2!important;box-shadow:0 0 0 3px rgba(25,118,210,.14)!important;background:#fff!important;}',
    /* 按钮：统一形状与悬停，保留各自功能色 */
    'button,.btn,a[class*="btn"],input[type="button"],input[type="submit"]{border-radius:8px!important;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease,filter .12s ease!important;}',
    'button:hover,.btn:hover,a[class*="btn"]:hover,input[type="button"]:hover,input[type="submit"]:hover{transform:translateY(-1px)!important;box-shadow:0 4px 12px rgba(30,60,120,.18)!important;filter:brightness(1.05);}',
    /* 链接与说明文字 */
    'a{color:#1565c0!important;}',
    'p,li,label,.hint,.note,.desc{color:#3a3f4b!important;}',
    /* 表格统一 */
    'table{border-collapse:collapse;}',
    'th{background:#f2f5fb!important;color:#1a5fb4!important;}',
    'td,th{border:1px solid #e3e8ee!important;}'
  ].join('');
  document.head.appendChild(skin);

  // ---------- 感叹号按钮 + 更新弹窗（样式与集合页一致） ----------
  var css2 = document.createElement('style');
  css2.textContent = [
    '.toolhub-upd-btn{position:fixed;top:14px;right:14px;z-index:2147483000;width:38px;height:38px;border-radius:12px;border:1px solid rgba(25,118,210,.25);background:rgba(255,255,255,.85);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1565c0;box-shadow:0 2px 10px rgba(30,60,120,.12);transition:transform .18s ease,box-shadow .18s ease;font-family:"Microsoft YaHei",sans-serif;padding:0;}',
    '.toolhub-upd-btn:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 6px 18px rgba(21,101,192,.2);}',
    '.toolhub-upd-btn svg{width:19px;height:19px;display:block;}',
    '.toolhub-upd-dot{position:absolute;top:-3px;right:-3px;width:11px;height:11px;border-radius:50%;background:#ff3b5c;border:2px solid #fff;animation:toolhubPulse 1.6s ease-in-out infinite;}',
    '@keyframes toolhubPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,59,92,.5);}50%{transform:scale(1.18);box-shadow:0 0 0 6px rgba(255,59,92,0);}}',
    '.toolhub-mask{position:fixed;inset:0;z-index:2147483100;background:rgba(15,23,42,.42);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;}',
    '.toolhub-mask.open{display:flex;}',
    '.toolhub-modal{width:min(620px,100%);max-height:min(80vh,700px);display:flex;flex-direction:column;background:rgba(255,255,255,.95);border:1px solid rgba(255,255,255,.6);border-radius:18px;box-shadow:0 24px 70px rgba(15,40,90,.28);overflow:hidden;font-family:"Microsoft YaHei","PingFang SC",sans-serif;animation:toolhubPop .26s cubic-bezier(.2,1.4,.4,1);}',
    '@keyframes toolhubPop{from{transform:translateY(18px) scale(.97);opacity:0;}to{transform:none;opacity:1;}}',
    '.toolhub-modal-head{flex:none;display:flex;align-items:center;gap:10px;padding:16px 20px 12px;border-bottom:1px solid #eef1f6;}',
    '.toolhub-modal-head .t{font-size:16px;font-weight:bold;background:linear-gradient(90deg,#1565c0,#7c4dff);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}',
    '.toolhub-modal-head .tag{font-size:11.5px;color:#fff;background:#1976d2;border-radius:99px;padding:2px 9px;}',
    '.toolhub-modal-head .close{margin-left:auto;width:30px;height:30px;border:none;border-radius:9px;background:#f2f4f8;color:#667;font-size:15px;cursor:pointer;transition:background .15s,transform .15s;}',
    '.toolhub-modal-head .close:hover{background:#ffe3e8;color:#d32f2f;transform:rotate(90deg);}',
    '.toolhub-modal-body{flex:1;overflow-y:auto;padding:14px 20px 20px;}',
    '.toolhub-upd-group{margin-bottom:20px;}',
    '.toolhub-upd-group:last-child{margin-bottom:4px;}',
    '.toolhub-upd-date{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:bold;color:#2b2b2b;}',
    '.toolhub-upd-date .d{font-size:11px;font-weight:normal;background:#eef5ff;color:#1565c0;border-radius:6px;padding:1px 8px;}',
    '.toolhub-upd-date .ln{flex:1;height:1px;background:linear-gradient(90deg,#dde6f5,transparent);}',
    '.toolhub-upd-items{margin-top:8px;display:flex;flex-direction:column;gap:7px;}',
    '.toolhub-upd-item{display:flex;gap:10px;align-items:baseline;background:#fafbfe;border:1px solid #edf0f6;border-radius:10px;padding:8px 12px;font-size:12.5px;line-height:1.65;transition:border-color .15s,transform .15s;}',
    '.toolhub-upd-item:hover{border-color:#c9d8f0;transform:translateX(2px);}',
    '.toolhub-upd-item .sc{flex:none;font-size:11px;font-weight:bold;background:#e8f0fb;color:#1a5fb4;border-radius:6px;padding:1px 8px;white-space:nowrap;}',
    '.toolhub-upd-item .sc.global{background:#ede9fe;color:#6d28d9;}',
    '.toolhub-upd-item .tx{color:#3a3f4b;}',
    '.toolhub-modal-foot{flex:none;padding:10px 20px;border-top:1px solid #eef1f6;font-size:11.5px;color:#99a;}',
    '@media (prefers-reduced-motion:reduce){.toolhub-upd-dot,.toolhub-modal{animation:none;}}'
  ].join('');
  document.head.appendChild(css2);

  // ---------- 加载更新数据 ----------
  function loadUpdates(cb) {
    if (window.DOUBAO_UPDATES) { cb(); return; }
    var s = document.createElement('script');
    s.src = '../updates.js';
    s.onload = cb;
    s.onerror = function () { window.DOUBAO_UPDATES = { latest: '', list: [] }; cb(); };
    document.head.appendChild(s);
  }

  function matchScope(scope, tool, kind) {
    if (!scope) return false;
    if (tool && scope.indexOf(tool) >= 0) return true;
    if (scope.indexOf('全部工具') === 0) return true;              // 全站工具类更新：人人可见
    if (scope.indexOf('全部') === 0) return kind === 'bookmark';    // 全部书签等：仅书签工具
    if (scope === '工作台' || scope === '打包' || scope === 'README') return true;
    return false;
  }

  function buildUI() {
    var btn = document.createElement('button');
    btn.className = 'toolhub-upd-btn';
    btn.title = '查看本工具更新';
    btn.setAttribute('aria-label', '查看本工具更新');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span class="toolhub-upd-dot" id="toolhubUpdDot"></span>';
    document.body.appendChild(btn);

    var mask = document.createElement('div');
    mask.className = 'toolhub-mask';
    mask.id = 'toolhubMask';
    mask.innerHTML =
      '<div class="toolhub-modal" role="dialog" aria-label="更新日志">' +
      '<div class="toolhub-modal-head"><span class="t">' + (TOOL || '工具') + ' · 更新记录</span><span class="tag" id="toolhubUpdVer"></span><button class="close" id="toolhubUpdClose" aria-label="关闭">✕</button></div>' +
      '<div class="toolhub-modal-body" id="toolhubUpdBody"></div>' +
      '<div class="toolhub-modal-foot">本工具的每次更新都记录在这里；全站性更新也会显示。</div>' +
      '</div>';
    document.body.appendChild(mask);

    var body = mask.querySelector('#toolhubUpdBody');
    var verEl = mask.querySelector('#toolhubUpdVer');
    var dot = btn.querySelector('#toolhubUpdDot');

    loadUpdates(function () {
      var UPD = window.DOUBAO_UPDATES || { latest: '', list: [] };
      if (UPD.latest) verEl.textContent = '最新 ' + UPD.latest;
      var readKey = 'toolhub-upd-read-' + TOOL;
      var readLatest = null;
      try { readLatest = localStorage.getItem(readKey); } catch (e) {}
      if (readLatest === UPD.latest) dot.style.display = 'none';

      function render() {
        body.innerHTML = '';
        var shown = 0;
        UPD.list.forEach(function (g) {
          var mine = (g.items || []).filter(function (it) {
            return matchScope(it.scope, TOOL, KIND);
          });
          if (!mine.length) return;
          shown++;
          var sec = document.createElement('div');
          sec.className = 'toolhub-upd-group';
          var head = document.createElement('div');
          head.className = 'toolhub-upd-date';
          var d = document.createElement('span'); d.className = 'd'; d.textContent = g.date;
          var tt = document.createElement('span'); tt.textContent = g.title;
          var ln = document.createElement('span'); ln.className = 'ln';
          head.appendChild(d); head.appendChild(tt); head.appendChild(ln);
          sec.appendChild(head);
          var items = document.createElement('div');
          items.className = 'toolhub-upd-items';
          mine.forEach(function (it) {
            var row = document.createElement('div');
            row.className = 'toolhub-upd-item';
            var sc = document.createElement('span');
            sc.className = 'sc';
            var scopeTxt = String(it.scope || '');
            if (scopeTxt.indexOf('全部') === 0 || scopeTxt === '工作台' || scopeTxt === '打包' || scopeTxt === 'README') sc.classList.add('global');
            sc.textContent = scopeTxt;
            var tx = document.createElement('span');
            tx.className = 'tx';
            tx.textContent = it.text;
            row.appendChild(sc); row.appendChild(tx);
            items.appendChild(row);
          });
          sec.appendChild(items);
          body.appendChild(sec);
        });
        if (!shown) {
          body.innerHTML = '<div style="color:#99a;font-size:13px;padding:18px 4px;">暂无与本工具相关的更新记录。</div>';
        }
      }

      btn.addEventListener('click', function () {
        render();
        mask.classList.add('open');
        try { localStorage.setItem(readKey, UPD.latest || ''); } catch (e) {}
        dot.style.display = 'none';
      });
      mask.querySelector('#toolhubUpdClose').addEventListener('click', function () { mask.classList.remove('open'); });
      mask.addEventListener('click', function (e) { if (e.target === mask) mask.classList.remove('open'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') mask.classList.remove('open'); });
    });
  }

  if (document.body) buildUI();
  else document.addEventListener('DOMContentLoaded', buildUI);
})();
