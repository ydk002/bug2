var foglalasok = JSON.parse(localStorage.getItem('foglalasok') || '[]');
var MAX_NAPI = 8;

function ment() {
  localStorage.setItem('foglalasok', JSON.stringify(foglalasok));
}

function uzen(szoveg) {
  document.getElementById('uzenet').textContent = szoveg;
}

function foglalt(ido) {
  // Javítás #1: Objektumok tömbjében a .some() metódussal keressük az időpontot
  return foglalasok.some(function (f) {
    return f.ido === ido;
  });
}

function rendezes() {
  // Javítás #3: Stringek időrendi összehasonlítása localeCompare segítségével
  foglalasok.sort(function (a, b) {
    return a.ido.localeCompare(b.ido);
  });
}

function render() {
  var lista = document.getElementById('lista');
  lista.innerHTML = '';

  // Javítás #6: DocumentFragment a memóriában történő építéshez (O(n^2) lassulás elkerülésére)
  var fragment = document.createDocumentFragment();

  foglalasok.forEach(function (f, i) {
    var sor = document.createElement('div');
    sor.className = 'sor';

    var szoveg = document.createElement('span');
    // Javítás #4: textContent használata innerHTML helyett (XSS sebezhetőség megszüntetése)
    szoveg.textContent = f.ido + ' – ' + f.nev;

    // Javítás #5: span helyett valódi <button> az akadálymentes billentyűzetkezelésért (Tab + Enter)
    var torloGomb = document.createElement('button');
    torloGomb.className = 'torol';
    torloGomb.textContent = 'Törlés';
    torloGomb.setAttribute('type', 'button');
    torloGomb.dataset.i = i;

    torloGomb.addEventListener('click', function () {
      foglalasok.splice(i, 1);
      ment();
      render();
    });

    sor.appendChild(szoveg);
    sor.appendChild(torloGomb);
    fragment.appendChild(sor);
  });

  // Egyetlen DOM-művelettel fűzzük hozzá a kész elemeket
  lista.appendChild(fragment);
}

document.getElementById('f').addEventListener('submit', function (e) {
  e.preventDefault();
  var nev = document.getElementById('nev').value.trim();
  var ido = document.getElementById('ido').value;

  // Javítás #2: '>= MAX_NAPI' használata a '> MAX_NAPI' helyett (a 8. foglalás után nem enged többet)
  if (foglalasok.length >= MAX_NAPI) {
    uzen('Ma már nincs szabad hely.');
    return;
  }

  if (foglalt(ido)) {
    uzen('Ez az időpont már foglalt.');
    return;
  }

  foglalasok.push({ nev: nev, ido: ido });
  rendezes();
  ment();
  render();
  uzen('Foglalás rögzítve: ' + ido);
  this.reset();
});

render();