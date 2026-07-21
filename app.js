(function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  document.querySelectorAll(".reveal").forEach(function (el) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    }, { threshold: 0.12 });
    io.observe(el);
  });

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
      else { alert("Thanks — you're on the list."); }
    });
  });

})();