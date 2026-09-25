(function () {
  document.querySelectorAll('.carousel').forEach((car) => {
    const slides = car.querySelectorAll('img');
    const cap = car.nextElementSibling;
    if (slides.length < 2) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
      cap.textContent = slides[i].dataset.cap;
    }, 4000);
  });
})();

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  document.getElementById("themebtn").innerHTML =
    t === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  try { localStorage.setItem("theme", t); } catch (e) { }
}

function toggleTheme() {
  var cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
}

function toggleAbs(id) {
  document.getElementById(id).classList.toggle("open");
}

/* ===== figure rotation: a new frame of reference on each refresh ===== */
function figsOf(thumb) {
  var d = thumb.getAttribute("data-figs");
  return d ? d.split(",") : [thumb.querySelector("img").getAttribute("src")];
}

function rotateFigs() {
  var n = 0;
  try {
    n = (parseInt(localStorage.getItem("figrot"), 10) || 0) + 1;
    localStorage.setItem("figrot", n);
  } catch (e) {
    n = Math.floor(Math.random() * 1000);
  }
  var thumbs = document.querySelectorAll(".item .thumb[data-figs]");
  for (var i = 0; i < thumbs.length; i++) {
    var figs = figsOf(thumbs[i]);
    thumbs[i].querySelector("img").src = figs[n % figs.length];
  }
}

/* ===== lightbox ===== */
var lbFigs = [], lbIdx = 0, lbAlt = "", lbCaps = null;

function lbShow() {
  document.getElementById("lb-img").src = lbFigs[lbIdx];
  var cap = lbCaps ? lbCaps[lbIdx] : lbAlt;
  document.getElementById("lb-img").alt = cap;
  document.getElementById("lb-cap").textContent = cap;
  document.getElementById("lb-count").textContent = (lbIdx + 1) + " / " + lbFigs.length;
  document.getElementById("lb-nav").classList.toggle("on", lbFigs.length > 1);
}

function lbStep(d) {
  lbIdx = (lbIdx + d + lbFigs.length) % lbFigs.length;
  lbShow();
}

function openLightbox(thumb, img) {
  lbFigs = figsOf(thumb);
  lbAlt = img.alt;
  lbCaps = null;
  var cur = img.getAttribute("src");
  lbIdx = Math.max(0, lbFigs.indexOf(cur));
  lbShow();
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.getElementById("lb-img").src = "";
  document.body.style.overflow = "";
}

function lbOpen() {
  return document.getElementById("lightbox").classList.contains("open");
}

document.addEventListener("click", function (e) {
  var t = e.target;
  var thumb = t.closest ? t.closest(".item .thumb") : null;
  var car = t.closest ? t.closest(".carousel") : null;
  if (thumb && t.tagName === "IMG") {
    openLightbox(thumb, t);
  } else if (car) {
    var imgs = Array.prototype.slice.call(car.querySelectorAll("img"));
    lbFigs = imgs.map(function (im) { return im.getAttribute("src"); });
    lbCaps = imgs.map(function (im) { return im.dataset.cap; });
    lbIdx = Math.max(0, imgs.indexOf(car.querySelector("img.active")));
    lbShow();
    document.getElementById("lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
  } else if (t.id === "lightbox") {
    closeLightbox();
  }
});

document.addEventListener("keydown", function (e) {
  if (!lbOpen()) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowRight") lbStep(1);
  else if (e.key === "ArrowLeft") lbStep(-1);
});

rotateFigs();
applyTheme(document.documentElement.getAttribute("data-theme") || "light");
