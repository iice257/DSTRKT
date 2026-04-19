document.addEventListener("DOMContentLoaded", () => {
  const markets = {
    NG: {
      nav: "NG",
      label: "Nigeria (NGN)",
      currency: "NGN",
      locale: "en-NG",
      rate: 1.12,
    },
    KR: {
      nav: "KR",
      label: "Korea (KRW)",
      currency: "KRW",
      locale: "ko-KR",
      rate: 1,
    },
    US: {
      nav: "US",
      label: "United States (USD)",
      currency: "USD",
      locale: "en-US",
      rate: 0.00073,
    },
    UK: {
      nav: "UK",
      label: "United Kingdom (GBP)",
      currency: "GBP",
      locale: "en-GB",
      rate: 0.00058,
    },
  };
  const localeKey = "dstrkt-market";
  const getStoredMarket = () => localStorage.getItem(localeKey) || "NG";
  const getMarket = () => markets[getStoredMarket()] || markets.NG;
  const formatPrice = (krwValue, market) => {
    if (market.currency === "KRW") {
      return `${new Intl.NumberFormat(market.locale).format(krwValue)} KRW`;
    }
    const converted = Math.round(krwValue * market.rate * 100) / 100;
    return new Intl.NumberFormat(market.locale, {
      style: "currency",
      currency: market.currency,
      maximumFractionDigits: market.currency === "NGN" ? 0 : 2,
    }).format(converted);
  };
  const applyMarketToPage = () => {
    const market = getMarket();
    document.querySelectorAll('.utility-nav a[href="./locale.html"]').forEach((link) => {
      link.innerHTML = `${market.nav} &#9662;`;
    });
    document.querySelectorAll('.site-footer a[href="./locale.html"]').forEach((link) => {
      link.textContent = `Region (${market.nav})`;
    });
    document.querySelectorAll(".price, .price-row span:first-child").forEach((node) => {
      if (!node.dataset.krw) {
        const digits = (node.textContent || "").replace(/[^\d]/g, "");
        if (!digits) return;
        node.dataset.krw = digits;
      }
      node.textContent = formatPrice(Number(node.dataset.krw), market);
    });
    const marketSelect = document.getElementById("market");
    if (marketSelect) {
      marketSelect.value = getStoredMarket();
    }
  };

  document.body.classList.add("page-ready");
  applyMarketToPage();

  const marketSelect = document.getElementById("market");
  if (marketSelect) {
    marketSelect.addEventListener("change", () => {
      localStorage.setItem(localeKey, marketSelect.value);
      applyMarketToPage();
    });
  }

  const localLinks = Array.from(document.querySelectorAll("a[href]")).filter((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return false;
    if (link.target && link.target !== "_self") return false;
    if (link.hasAttribute("download")) return false;
    return href.endsWith(".html") || href.startsWith("./");
  });

  localLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === window.location.pathname.split("/").pop()) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });

  const slides = [
    { src: "./assets/hero-slide-1.jpg", alt: "Model in DSTRKT hero outfit, frame 1" },
    { src: "./assets/hero-slide-2.jpg", alt: "Model in DSTRKT hero outfit, frame 2" },
    { src: "./assets/hero-slide-3.jpg", alt: "Model in DSTRKT hero outfit, frame 3" },
  ];

  const image = document.getElementById("hero-slide-image");
  const current = document.getElementById("hero-slide-current");
  const total = document.getElementById("hero-slide-total");
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");

  if (!image || !current || !total || !prevBtn || !nextBtn) return;

  let index = 0;
  let timer = null;
  total.textContent = String(slides.length).padStart(2, "0");

  const render = () => {
    const slide = slides[index];
    image.classList.add("is-fading");
    window.setTimeout(() => {
      image.src = slide.src;
      image.alt = slide.alt;
      current.textContent = String(index + 1).padStart(2, "0");
      image.classList.remove("is-fading");
    }, 180);
  };

  const next = () => {
    index = (index + 1) % slides.length;
    render();
  };

  const prev = () => {
    index = (index - 1 + slides.length) % slides.length;
    render();
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    timer = window.setInterval(next, 4800);
  };

  nextBtn.addEventListener("click", () => {
    next();
    start();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    start();
  });

  image.addEventListener("mouseenter", stop);
  image.addEventListener("mouseleave", start);
  start();
});
