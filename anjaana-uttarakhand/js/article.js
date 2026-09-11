// लेख पेज: URL से id पढ़ना, सही बैच फाइल से डेटा लाना, पेज भरना
(function () {
  var SITE_NAME = 'अनजाना उत्तराखंड';
  var SITE_URL = 'https://anjaana-uttarakhand.example.com'; // GitHub Pages/कस्टम डोमेन जोड़ने पर अपडेट करें

  var root = document.getElementById('article-root');
  if (!root) return;

  var params = new URLSearchParams(window.location.search);
  var articleId = params.get('id');

  function formatDate(iso) {
    var months = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    var parts = iso.split('-');
    var y = parts[0], m = parseInt(parts[1], 10) - 1, d = parseInt(parts[2], 10);
    return d + ' ' + months[m] + ' ' + y;
  }

  function showNotFound() {
    root.innerHTML =
      '<div class="article-not-found container">' +
        '<h1>लेख नहीं मिला</h1>' +
        '<p>यह लेख उपलब्ध नहीं है या हटा दिया गया है।</p>' +
        '<a class="btn btn-primary" href="index.html">होमपेज पर लौटें</a>' +
      '</div>';
  }

  function setMeta(name, content, attr) {
    attr = attr || 'name';
    var el = document.querySelector('meta[' + attr + '="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function setCanonical(url) {
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  function setSEO(article) {
    var pageUrl = SITE_URL + '/article.html?id=' + encodeURIComponent(article.id);
    var imageUrl = SITE_URL + '/' + article.image;

    document.title = article.title + ' | ' + SITE_NAME;
    setMeta('description', article.excerpt);
    setCanonical(pageUrl);

    setMeta('og:title', article.title, 'property');
    setMeta('og:description', article.excerpt, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:image', imageUrl, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', article.title);
    setMeta('twitter:description', article.excerpt);
    setMeta('twitter:image', imageUrl);

    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': article.title,
      'description': article.excerpt,
      'image': [imageUrl],
      'datePublished': article.date,
      'inLanguage': 'hi',
      'publisher': {
        '@type': 'Organization',
        'name': SITE_NAME
      },
      'mainEntityOfPage': pageUrl
    });
    document.head.appendChild(ld);
  }

  function wireShareButtons(article) {
    var pageUrl = SITE_URL + '/article.html?id=' + encodeURIComponent(article.id);
    var text = encodeURIComponent(article.title);
    var url = encodeURIComponent(pageUrl);

    var whatsapp = document.getElementById('share-whatsapp');
    var facebook = document.getElementById('share-facebook');
    var twitter = document.getElementById('share-twitter');
    var copyBtn = document.getElementById('share-copy');
    var feedback = document.getElementById('copy-feedback');

    if (whatsapp) whatsapp.href = 'https://api.whatsapp.com/send?text=' + text + '%20' + url;
    if (facebook) facebook.href = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
    if (twitter) twitter.href = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url;

    if (copyBtn) {
      copyBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var doCopyFallback = function () {
          var temp = document.createElement('input');
          temp.value = pageUrl;
          document.body.appendChild(temp);
          temp.select();
          try { document.execCommand('copy'); } catch (err) {}
          document.body.removeChild(temp);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(pageUrl).catch(doCopyFallback);
        } else {
          doCopyFallback();
        }

        if (feedback) {
          feedback.classList.add('show');
          window.setTimeout(function () { feedback.classList.remove('show'); }, 2000);
        }
      });
    }
  }

  function renderArticle(article) {
    setSEO(article);

    root.innerHTML =
      '<div class="article-hero">' +
        '<div class="article-hero-media"><img src="' + article.image + '" alt="' + article.title + '"></div>' +
        '<div class="article-hero-text container">' +
          '<span class="card-date">' + formatDate(article.date) + '</span>' +
          '<h1>' + article.title + '</h1>' +
          '<p class="excerpt">' + article.excerpt + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="article-body container">' +
        article.content +
        '<div class="share-bar">' +
          '<span>यह लेख साझा करें:</span>' +
          '<a class="share-btn" id="share-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp पर साझा करें">' +
            '<svg viewBox="0 0 24 24"><path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm5.79 14.24c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.15-4.94-4.34-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.2-.15.31-.3.48-.15.17-.31.38-.45.51-.15.14-.3.3-.13.59.17.29.75 1.24 1.62 2 .11.11.51.99.14 1.28.2.19.43.31.68.19.25-.12.65-.31.87-.54.22-.24.44-.19.74-.09.3.1.48.2.55.31.07.11.07.2.05.29z"/></svg>' +
          '</a>' +
          '<a class="share-btn" id="share-facebook" target="_blank" rel="noopener" aria-label="Facebook पर साझा करें">' +
            '<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>' +
          '</a>' +
          '<a class="share-btn" id="share-twitter" target="_blank" rel="noopener" aria-label="X (Twitter) पर साझा करें">' +
            '<svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.9L4.4 22H1.3l8.1-9.3L1 2h7.1l4.9 6.3L18.9 2zm-1.2 18h1.9L7 4H5l12.7 16z"/></svg>' +
          '</a>' +
          '<a class="share-btn copy-link" id="share-copy" href="#" aria-label="लिंक कॉपी करें">' +
            '<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>' +
          '</a>' +
          '<span class="copy-feedback" id="copy-feedback">लिंक कॉपी हो गया!</span>' +
        '</div>' +
      '</div>';

    wireShareButtons(article);
  }

  if (!articleId) {
    showNotFound();
    return;
  }

  // batch-1.json, batch-2.json ... क्रम से खोजता है, जिस फाइल में id मिल जाए
  // वहीं से आर्टिकल उठा लेता है। नई batch फाइल जोड़ने पर कुछ और बदलने की
  // ज़रूरत नहीं पड़ती।
  function findArticle(id, n) {
    n = n || 1;
    return fetch('data/batch-' + n + '.json')
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data) return null;
        var found = data.find(function (a) { return a.id === id; });
        if (found) return found;
        return findArticle(id, n + 1);
      })
      .catch(function () { return null; });
  }

  findArticle(articleId).then(function (article) {
    if (!article) { showNotFound(); return; }
    renderArticle(article);
  });
})();
