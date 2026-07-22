(function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  document.querySelectorAll(".reveal").forEach(function (el) {
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "80px 0px" });
    io.observe(el);
  });
  setTimeout(function () {
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      el.classList.add("in");
    });
  }, 800);

  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var ok = true;
      required.forEach(function (field) {
        if (!String(field.value || "").trim()) ok = false;
      });
      if (!ok) {
        alert("Please fill in all required fields.");
        return;
      }
      form.reset();
      var success = document.getElementById("formSuccess");
      if (success) success.classList.add("show");
    });
  }

  document.querySelectorAll("#newsletterForm, .newsletter-form").forEach(function(nf){
    nf.addEventListener("submit", function(e){
      e.preventDefault();
      var email = nf.querySelector('input[type="email"]');
      if(!email || !email.value.trim()){ alert("Please enter your email."); return; }
      nf.reset();
      var note = nf.parentElement.querySelector(".nl-success") || document.getElementById("nlSuccess");
      if(note){ note.style.display="block"; }
      else { alert("Thanks, you're on the list."); }
    });
  });


  // Plan deep-link (Insurely / Homera-style)
  (function(){
    var plan = document.getElementById("plan");
    if(!plan) return;
    var q = new URLSearchParams(location.search).get("plan");
    if(!q) return;
    var map = { essentials:"Essentials", growth:"Growth", enterprise:"Enterprise", starter:"Starter", pro:"Pro", brokerage:"Brokerage", demo:"Demo only" };
    var want = map[String(q).toLowerCase()] || q;
    Array.prototype.forEach.call(plan.options, function(opt){
      if(opt.value.toLowerCase()===String(q).toLowerCase() || opt.text.trim().toLowerCase()===String(want).toLowerCase()){
        plan.value = opt.value || opt.text;
        opt.selected = true;
      }
    });
  })();

  // Nouvel / shop filters
  (function(){
    var groups = document.querySelectorAll(".filter-group");
    groups.forEach(function(g){
      var btn = g.querySelector("button[data-filter-toggle]");
      if(!btn) return;
      btn.addEventListener("click", function(){
        g.classList.toggle("open");
        var sp = btn.querySelector("span");
        if(sp) sp.textContent = g.classList.contains("open") ? "-" : "+";
      });
    });

    function applyFilters(){
      var checks = document.querySelectorAll(".filter-panel input[type=checkbox]:checked");
      var active = { fit:[], color:[], size:[], cat:[] };
      checks.forEach(function(c){
        var k = c.getAttribute("data-key");
        if(active[k]) active[k].push(c.value);
      });
      var params = new URLSearchParams(location.search);
      var cat = params.get("cat");
      if(cat) active.cat = [cat];

      var chips = document.querySelectorAll(".filter-chip[data-cat]");
      chips.forEach(function(ch){
        ch.classList.toggle("active", !cat ? ch.getAttribute("data-cat")==="all" : ch.getAttribute("data-cat")===cat);
      });

      var items = document.querySelectorAll("[data-product]");
      if(!items.length) return;
      var shown = 0;
      items.forEach(function(el){
        var ok = true;
        ["fit","color","size","cat"].forEach(function(k){
          if(!active[k].length) return;
          var vals = (el.getAttribute("data-"+k) || "").split(/\s+/);
          if(!active[k].some(function(v){ return vals.indexOf(v) !== -1; })) ok = false;
        });
        el.classList.toggle("is-hidden", !ok);
        if(ok) shown++;
      });
      var empty = document.querySelector(".filter-empty");
      if(empty) empty.classList.toggle("show", shown === 0);
    }

    document.querySelectorAll(".filter-panel input[type=checkbox]").forEach(function(c){
      c.addEventListener("change", applyFilters);
    });
    document.querySelectorAll(".filter-chip[data-cat]").forEach(function(ch){
      ch.addEventListener("click", function(){
        var cat = ch.getAttribute("data-cat");
        var url = new URL(location.href);
        if(cat === "all") url.searchParams.delete("cat");
        else url.searchParams.set("cat", cat);
        // stay on same page path
        history.replaceState(null, "", url.pathname.split("/").pop() + url.search + url.hash);
        applyFilters();
      });
    });
    applyFilters();
  })();


  // a11y: mobile nav aria
  if(t&&l){
    t.setAttribute("aria-expanded","false");
    t.setAttribute("aria-controls", l.id || "navLinks");
    t.addEventListener("click", function(){
      var open = l.classList.contains("open");
      t.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // cookie notice
  (function(){
    var key = "mm_cookie_ok";
    try { if(localStorage.getItem(key)) return; } catch(e){}
    var bar = document.getElementById("cookieBar");
    if(!bar) return;
    bar.classList.add("show");
    var btn = document.getElementById("cookieAccept");
    if(btn) btn.addEventListener("click", function(){
      try { localStorage.setItem(key, "1"); } catch(e){}
      bar.classList.remove("show");
    });
  })();

  // back to top
  (function(){
    var btn = document.getElementById("toTop");
    if(!btn) return;
    window.addEventListener("scroll", function(){
      if(window.scrollY > 500) btn.classList.add("show"); else btn.classList.remove("show");
    }, {passive:true});
    btn.addEventListener("click", function(){ window.scrollTo({top:0, behavior:"smooth"}); });
  })();

})();
