// स्वागत एनिमेशन — केवल होमपेज पर, हर सेशन में एक बार
(function () {
  var STORAGE_KEY = 'anjaanaUttarakhandIntroSeen';
  var intro = document.getElementById('intro');
  if (!intro) return;

  var alreadySeen = false;
  try {
    alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    alreadySeen = false;
  }

  if (alreadySeen) {
    intro.remove();
    document.documentElement.classList.remove('intro-active');
    return;
  }

  document.documentElement.classList.add('intro-active');

  function hideIntro() {
    if (!intro || intro.dataset.hidden === '1') return;
    intro.dataset.hidden = '1';
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    intro.classList.add('intro-hide');
    document.documentElement.classList.remove('intro-active');
    window.setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 950);
  }

  var skipBtn = document.getElementById('intro-skip');
  if (skipBtn) skipBtn.addEventListener('click', hideIntro);

  // एनिमेशन के स्वाभाविक अंत के बाद स्वतः होमपेज पर पहुंचना
  window.setTimeout(hideIntro, 4200);
})();
