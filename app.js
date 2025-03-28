document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const track = document.querySelector(".gallery-track");
  const cards = document.querySelectorAll(".card");
  const nav = document.querySelector("nav");
  

  let startY = 0;
  let endY = 0;
  let raf = null;
  const easing = 0.1;
  let lastScroll = 0;
  const threshold = 10;
  
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function updateScroll() {
    startY = lerp(startY, endY, easing);
    track.style.transform = `translateY(-${startY}px)`;

    if (Math.abs(Math.round(startY) - window.scrollY) < 1) {
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      raf = requestAnimationFrame(updateScroll);
    }
  }

  function startScroll() {
    document.addEventListener("scroll", () => {
      endY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(updateScroll);
    });
  }

  function createOverlay() {
    let overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "999",
      opacity: "0",
      transition: "opacity 0.3s ease-in-out",
      pointerEvents: "none"
    });
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
    }, 10);
    return overlay;
  }

  function zoomImage(img, isMobile = false) {
    const rect = img.getBoundingClientRect();
    const zoomedImg = img.cloneNode();
    zoomedImg.classList.add("zoomed");
    const overlay = createOverlay();

    

    Object.assign(zoomedImg.style, {
      position: "fixed",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: "none",
      transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
      zIndex: "1000",
      objectFit: "cover",
      borderRadius: "20px",
      opacity: "0",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      pointerEvents: "none"
    });

    document.body.appendChild(zoomedImg);

    setTimeout(() => {
      zoomedImg.style.top = "50%";
      zoomedImg.style.left = "50%";
      zoomedImg.style.width = isMobile ? "90vw" : "70vw";
      zoomedImg.style.height = isMobile ? "90vh" : "80vh";
      zoomedImg.style.transform = "translate(-50%, -50%) scale(1.05)";
      zoomedImg.style.opacity = "1";
      zoomedImg.style.pointerEvents = "auto";
    }, 10);

    function closeZoomedImage(zoomedImg, overlay, rect) {
    zoomedImg.style.top = `${rect.top}px`;
    zoomedImg.style.left = `${rect.left}px`;
    zoomedImg.style.width = `${rect.width}px`;
    zoomedImg.style.height = `${rect.height}px`;
    zoomedImg.style.transform = "none";
    zoomedImg.style.opacity = "0";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => {
      zoomedImg.remove();
      overlay.remove();
    }, 600);
  }

  overlay.addEventListener("click", () => closeZoomedImage(zoomedImg, overlay, rect));
  zoomedImg.addEventListener("click", () => closeZoomedImage(zoomedImg, overlay, rect));
  }

  document.querySelectorAll(".card-image-wrapper img").forEach(img => {
    img.addEventListener("click", event => {
      event.preventDefault();
      zoomImage(img, window.matchMedia("(max-width: 768px)").matches);
    });
  });

  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY;
    nav.style.transition = "transform 0.4s ease-in-out";
    if (Math.abs(currentScroll - lastScroll) > threshold) {
      nav.style.transform = currentScroll > lastScroll ? "translateY(-100%)" : "translateY(0)";
    }
    lastScroll = currentScroll;
  });

  function init() {
    track.style.willChange = "transform";
    gallery.style.height = `${track.scrollHeight}px`;
    startScroll();
  }

  init();
});
