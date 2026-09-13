// One reusable meteor, CSS-driven motion, and no per-frame JavaScript work.
(() => {
  const sky = document.querySelector(".home-sky");
  const meteor = sky?.querySelector(".home-sky-meteor");
  if (!meteor) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.matchMedia("(max-width: 575px)");
  let timer;
  let previousPath = -1;
  const random = (min, max) => min + Math.random() * (max - min);
  // Start positions are percentages; travel distances are CSS pixels.
  const desktopPaths = [
    { x: 12, y: 14, dx: -110, dy: 155 },
    { x: 98, y: 22, dx: -95, dy: 175 },
    { x: 10, y: 57, dx: -85, dy: 135 },
    { x: 97, y: 61, dx: -110, dy: 155 },
    { x: 42, y: 12, dx: -135, dy: 125 },
    { x: 66, y: 27, dx: -150, dy: 140 },
    { x: 78, y: 48, dx: -160, dy: 125 },
    { x: 56, y: 63, dx: -145, dy: 130 },
  ];
  const mobilePaths = [
    { x: 8, y: 13, dx: -22, dy: 115 },
    { x: 98, y: 25, dx: -25, dy: 135 },
    { x: 8, y: 60, dx: -20, dy: 105 },
    { x: 98, y: 56, dx: -25, dy: 120 },
    { x: 44, y: 14, dx: -55, dy: 100 },
    { x: 68, y: 28, dx: -65, dy: 110 },
    { x: 78, y: 49, dx: -70, dy: 105 },
    { x: 56, y: 61, dx: -60, dy: 100 },
  ];

  const canAnimate = () => !document.hidden && !reducedMotion.matches;
  const stop = () => {
    window.clearTimeout(timer);
    meteor.classList.remove("is-active");
  };
  const schedule = () => {
    window.clearTimeout(timer);
    if (!canAnimate()) return;
    timer = window.setTimeout(shoot, mobile.matches ? random(10000, 16000) : random(6000, 12000));
  };
  const shoot = () => {
    if (!canAnimate()) return;
    const paths = mobile.matches ? mobilePaths : desktopPaths;
    // Pick a different route each time without retry loops.
    previousPath = (previousPath + 1 + Math.floor(Math.random() * (paths.length - 1))) % paths.length;
    const path = paths[previousPath];
    const variables = {
      x: `${path.x}%`,
      y: `${path.y + random(-3, 3)}%`,
      dx: `${path.dx}px`,
      dy: `${path.dy}px`,
      angle: `${(Math.atan2(path.dy, path.dx) * 180) / Math.PI}deg`,
      length: `${mobile.matches ? random(70, 100) : random(140, 210)}px`,
      duration: `${random(1.7, 2.3)}s`,
    };
    for (const [key, value] of Object.entries(variables)) meteor.style.setProperty(`--meteor-${key}`, value);
    meteor.classList.add("is-active");
  };
  const sync = () => {
    stop();
    sky.classList.toggle("is-paused", !canAnimate());
    schedule();
  };

  meteor.addEventListener("animationend", (event) => {
    if (event.animationName !== "home-meteor-flight") return;
    meteor.classList.remove("is-active");
    schedule();
  });
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  mobile.addEventListener("change", sync);
  window.addEventListener("pagehide", stop);
  window.addEventListener("pageshow", sync);
  sync();
})();
