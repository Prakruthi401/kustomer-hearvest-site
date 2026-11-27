(function () {
  var API = "https://kustomer-hearvest-api.prakruthigowda2005.workers.dev/";
  var KEY = "kh_form";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  // Step 1: save the form when the user continues
  var form = document.querySelector("form.formcard");
  var go = form && form.querySelector('a[href="checkout.html"]');
  if (go) {
    go.addEventListener("click", function () {
      var sel = form.querySelectorAll("select");
      var areas = form.querySelectorAll("textarea");
      var labels = {};
      form.querySelectorAll("label.fld").forEach(function (l) {
        var lab = l.querySelector(".lab"), f = l.querySelector("input[type=text],textarea");
        if (lab && f && f.value.trim()) labels[lab.textContent.replace("*", "").trim()] = f.value.trim();
      });
      var main = [];
      for (var i = 0; i < 5 && i < areas.length; i++) {
        var q = areas[i].closest("label").querySelector(".lab").textContent.replace("*", "").trim();
        main.push(q + " " + areas[i].value.trim());
      }
      var rest = Object.keys(labels).filter(function (k) { return !/^[1-5]\./.test(k) && !/name|email/i.test(k); }).map(function (k) { return k + ": " + labels[k]; });
      var data = {
        category: sel[0] ? sel[0].value : "", stage: sel[1] ? sel[1].value : "",
        answers: main, competitors: rest.slice(0, 3).join(" | "), links: rest.slice(3, 5).join(" | "), plan: rest.slice(5).join(" | ")
      };
      try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    });
  }
  // Step 3: build the real report
  var rep = document.querySelector("article.report");
  if (!rep) return;
  var raw; try { raw = sessionStorage.getItem(KEY); } catch (e) {}
  if (!raw) return;
  var hd = document.querySelector(".fl-head"); if (hd) { hd.querySelector("h1").textContent = "Your Brand Diagnostic"; hd.querySelector("p").textContent = "Written by AI from your answers. Test mode: no payment is taken."; }
  var keep = [rep.querySelector(".reach"), rep.querySelector(".upsell")];
  var box = document.createElement("div");
  box.innerHTML = '<header><h2>Writing your Brand Diagnostic...</h2><p class="fine">This takes about 20 seconds. Please keep this page open.</p></header>';
  rep.innerHTML = ""; rep.appendChild(box);
  function done(html) { box.innerHTML = html; keep.forEach(function (k) { if (k) rep.appendChild(k); }); }
  fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: raw })
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
    .then(function (x) {
      if (!x.ok) { done('<header><h2>We could not write your report just now</h2><p>' + esc(x.j.error || "Please try again in a few minutes.") + '</p><a class="btn btn-red" href="diagnostic.html">Back to the form</a></header>'); return; }
      var d = x.j, sc = d.scores || {};
      var names = { product: "Product", brand: "Brand", pricing: "Price", reach: "Reach", trust: "Trust", differentiation: "Stands out" };
      var li = function (a) { return (a || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join(""); };
      var comps = (d.competitors || []).map(function (c) { return '<div class="cmp"><b>' + esc(c.type) + "</b><small>" + esc(c.how_you_stand_out) + "</small></div>"; }).join("");
      done(
        '<header><span class="eg">AI-written from your answers</span><h2>Your Brand Diagnostic</h2><p class="fine">Test mode: no payment was checked.</p></header>' +
        '<div class="verdict"><span class="tag">Verdict</span><p>' + esc(d.verdict) + "</p></div>" +
        '<div class="planbox"><span class="tag">Your actual problem</span><p>' + esc(d.actual_problem) + "</p></div>" +
        '<div class="rwgrid"><div><h3 class="rh">Doing right</h3><ul class="rw good">' + li(d.doing_right) + '</ul></div><div><h3 class="rh">Doing wrong</h3><ul class="rw bad">' + li(d.doing_wrong) + "</ul></div></div>" +
        '<h3 class="rh">Scores</h3><div class="mini-scores">' + Object.keys(names).map(function (k) { return "<div><span>" + names[k] + "</span><b>" + esc(sc[k]) + "/10</b></div>"; }).join("") + "</div>" +
        '<h3 class="rh">Who to target</h3><div class="compbox"><div class="cmp"><b>Best fit</b><small>' + esc(d.best_fit_customer) + '</small></div><div class="cmp"><b>Avoid for now</b><small>' + esc(d.avoid_customer) + "</small></div></div>" +
        '<h3 class="rh">Competitors and how you stand out</h3><div class="compbox">' + comps + "</div>" +
        '<h3 class="rh">Ask your customers</h3><ul class="checks">' + li(d.customer_questions) + "</ul>" +
        '<p class="fine">' + esc(d.limits || "The AI works from your answers. It cannot verify that people will buy.") + "</p>"
      );
    })
    .catch(function () { done('<header><h2>We could not reach the report service</h2><p>Please try again in a few minutes.</p><a class="btn btn-red" href="diagnostic.html">Back to the form</a></header>'); });
})();
