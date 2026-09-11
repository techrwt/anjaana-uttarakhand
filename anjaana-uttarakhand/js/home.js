// होमपेज: articles-index.json से कार्ड बनाना
(function () {
  var feedEl = document.getElementById('article-feed');
  if (!feedEl) return;

  function formatDate(iso) {
    var months = ['जनवरी','फरवरी','मार्च','अप्रैल','मई','जून','जुलाई','अगस्त','सितंबर','अक्टूबर','नवंबर','दिसंबर'];
    var parts = iso.split('-');
    var y = parts[0], m = parseInt(parts[1], 10) - 1, d = parseInt(parts[2], 10);
    return d + ' ' + months[m] + ' ' + y;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderCards(articles) {
    if (!articles.length) {
      feedEl.innerHTML = '<p class="feed-empty">फिलहाल कोई लेख उपलब्ध नहीं है। जल्द ही नई कहानियां जोड़ी जाएंगी।</p>';
      return;
    }

    var sorted = articles.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var html = sorted.map(function (a) {
      return (
        '<a class="article-card" href="article.html?id=' + encodeURIComponent(a.id) + '">' +
          '<div class="thumb"><img src="' + a.image + '" alt="' + escapeHtml(a.title) + '" loading="lazy"></div>' +
          '<div class="card-body">' +
            '<span class="card-date">' + formatDate(a.date) + '</span>' +
            '<h3>' + escapeHtml(a.title) + '</h3>' +
            '<p class="excerpt">' + escapeHtml(a.excerpt) + '</p>' +
            '<span class="read-more">पूरा लेख पढ़ें</span>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    feedEl.innerHTML = html;
  }

  // batch-1.json, batch-2.json, batch-3.json ... जितनी फाइलें data/ में मिलेंगी,
  // सबको अपने आप ढूंढ कर पढ़ लेता है। नया आर्टिकल जोड़ने के लिए बस अगले नंबर की
  // batch फाइल (जैसे batch-2.json) data/ फोल्डर में डाल दें — कुछ और बदलने की
  // ज़रूरत नहीं। नंबरिंग लगातार होनी चाहिए (1, 2, 3...), बीच में गैप न छोड़ें।
  function loadAllBatches() {
    var articles = [];
    function tryBatch(n) {
      return fetch('data/batch-' + n + '.json')
        .then(function (res) {
          if (!res.ok) return null;
          return res.json();
        })
        .then(function (data) {
          if (!data) return;
          articles = articles.concat(data);
          return tryBatch(n + 1);
        })
        .catch(function () { /* आगे कोई फाइल नहीं मिली, यहीं रुक जाओ */ });
    }
    return tryBatch(1).then(function () { return articles; });
  }

  loadAllBatches()
    .then(renderCards)
    .catch(function () {
      feedEl.innerHTML = '<p class="feed-error">लेख लोड करने में समस्या आई। कृपया पेज को रीफ्रेश करें।</p>';
    });
})();
