(() => {
  const defaultThemeConfig = {
    radiusPx: 10,
    shadowStrength: 0.4
  };

  const documentElement = document.documentElement;

  function computeShadow(strength) {
    const clamped = Math.max(0, Math.min(1, Number(strength) || 0));
    const blurPx = Math.round(14 + 10 * clamped);
    const yOffsetPx = Math.round(4 + 4 * clamped);
    const opacity = (0.04 + 0.05 * clamped).toFixed(3);
    return `0 ${yOffsetPx}px ${blurPx}px 0 rgba(0, 0, 0, ${opacity})`;
  }

  function applyTheme(config) {
    const radius = Number(config.radiusPx);
    const strength = Number(config.shadowStrength);
    const shadowCss = computeShadow(strength);

    if (!Number.isNaN(radius)) {
      documentElement.style.setProperty("--yt-theme-radius", `${radius}px`);
    }
    documentElement.style.setProperty("--yt-theme-shadow", shadowCss);
  }

  function init() {
    chrome.storage.sync.get(defaultThemeConfig, (stored) => {
      applyTheme(stored || defaultThemeConfig);
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
      const updated = {};
      if (changes.radiusPx) updated.radiusPx = changes.radiusPx.newValue;
      if (changes.shadowStrength) updated.shadowStrength = changes.shadowStrength.newValue;
      if (Object.keys(updated).length) applyTheme({ ...defaultThemeConfig, ...updated });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();