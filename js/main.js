// Charba — nav toggle, scroll reveal, RFID odometer, scroll-hide header, hero tilt, scroll progress

(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero tag barcode (real Code128, encodes the RFID number)
  var barcodeEl = document.getElementById('tagBarcode');
  if(barcodeEl && window.JsBarcode){
    JsBarcode(barcodeEl, '41710000123456', {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      width: 1.4,
      height: 18,
      background: 'transparent',
      lineColor: '#1A2118'
    });
  }

  // mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if(navToggle && navLinks){
    navToggle.addEventListener('click', function(){
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // scroll reveal
  var els = document.querySelectorAll('.reveal');
  if(reduced || !('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el){ io.observe(el); });
  }

  // odometer id digits
  var host = document.getElementById('odometer');
  if(host){
    var digitsCount = 5;
    var tracks = [];
    for(var i=0;i<digitsCount;i++){
      var d = document.createElement('span');
      d.className = 'digit';
      var t = document.createElement('span');
      t.className = 'digit-track';
      for(var n=0;n<10;n++){
        var s = document.createElement('span');
        s.textContent = n;
        t.appendChild(s);
      }
      d.appendChild(t);
      host.appendChild(d);
      tracks.push(t);
    }
    function setValue(str){
      for(var i=0;i<digitsCount;i++){
        var digit = parseInt(str[i],10) || 0;
        tracks[i].style.setProperty('--d', digit);
      }
    }
    var base = 12340;
    setValue(String(base).padStart(5,'0'));
    if(!reduced){
      setInterval(function(){
        base = (base + Math.floor(Math.random()*7) + 1) % 100000;
        setValue(String(base).padStart(5,'0'));
      }, 2600);
    }
  }

  // scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    bar.style.width = (height > 0 ? (scrolled / height * 100) : 0) + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // site-header: visible only at the very top, hidden as soon as the page scrolls
  var header = document.querySelector('.site-header');
  if(header){
    var updateHeaderVisibility = function(){
      var atTop = window.scrollY <= 10;
      var open = navLinks && navLinks.classList.contains('is-open');
      if(atTop || open){
        header.classList.remove('header-hidden');
      } else {
        header.classList.add('header-hidden');
      }
    };
    document.addEventListener('scroll', updateHeaderVisibility, { passive: true });
    updateHeaderVisibility();
  }

  // interactive pointer tilt on hero card (mouse/trackpad only)
  var tiltCard = document.getElementById('tiltCard');
  if(tiltCard && !reduced && window.matchMedia('(pointer:fine)').matches){
    tiltCard.style.willChange = 'transform';
    tiltCard.addEventListener('mousemove', function(e){
      var r = tiltCard.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tiltCard.style.transform = 'perspective(900px) rotateY(' + (px * 10).toFixed(2) + 'deg) rotateX(' + (py * -10).toFixed(2) + 'deg) translateY(-4px)';
    });
    tiltCard.addEventListener('mouseleave', function(){
      tiltCard.style.transform = '';
    });
  }
})();
