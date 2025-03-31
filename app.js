
// Плавная анимация прокрутки и параллакс для карточек

document.addEventListener("DOMContentLoaded", () => {
  // Получаем основные элементы
  const gallery = document.querySelector(".gallery");
  const track = document.querySelector(".gallery-track");
  const cards = document.querySelectorAll(".card");
  const nav = document.querySelector("nav");
  
  let startY = 0;
  let endY = 0;
  let raf = null;
  const easing = 0.04; // Уменьшено значение для более плавной анимации
  let lastScroll = 0;
  const threshold = 10;
  
  // Функция линейной интерполяции
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Обновление анимации прокрутки
  function updateScroll() {
    startY = lerp(startY, endY, easing);
    gallery.style.height = `${track.clientHeight}px`;
    track.style.transform = `translateY(-${startY}px)`;
    activateParallax();

    if (Math.abs(startY - window.scrollY) < 0.1) {
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      raf = requestAnimationFrame(updateScroll);
    }
  }

  // Запуск анимации прокрутки
  function startScroll() {
    document.addEventListener("scroll", () => {
      endY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(updateScroll);
    });
  }

  // Функция параллакса для карточек
  function parallax(card) {
    const wrapper = card.querySelector('.card-image-wrapper');
    const diff = card.offsetHeight - wrapper.offsetHeight;
    const { top } = card.getBoundingClientRect();
    const progress = top / window.innerHeight;
    const yPos = diff * progress;
    wrapper.style.transform = `translateY(${yPos}px)`;
  }

  // Активация параллакса
  const activateParallax = () => cards.forEach(parallax);

  // Создание оверлея для увеличенного изображения
  function createOverlay() {
    let overlay = document.createElement("div");
    overlay.classList.add("image-overlay");
    Object.assign(overlay.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
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

  // Функция увеличения изображения
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
      transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
      zIndex: "1000",
      objectFit: "cover",
      borderRadius: "20px",
      opacity: "0",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
      pointerEvents: "none",
      cursor: "pointer"
    });

    document.body.appendChild(zoomedImg);

    setTimeout(() => {
      zoomedImg.style.top = "50%";
      zoomedImg.style.left = "50%";
      zoomedImg.style.width = isMobile ? "120vw" : "54vw";
      zoomedImg.style.height = isMobile ? "56vh" : "78vh";
      zoomedImg.style.transform = isMobile 
        ? "translate(-50%, -50%) rotate(90deg)" 
        : "translate(-50%, -50%)";
      zoomedImg.style.opacity = "1";
      zoomedImg.style.pointerEvents = "auto";
    }, 10);

    // Закрытие увеличенного изображения
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

  // Добавление обработчика клика для изображений в карточках
  document.querySelectorAll(".card-image-wrapper img").forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener("click", event => {
      event.preventDefault();
      zoomImage(img, window.matchMedia("(max-width: 768px)").matches);
    });
  });

  // Скрытие/появление навигации при прокрутке
  window.addEventListener("scroll", () => {
    let currentScroll = window.scrollY;
    nav.style.transition = "transform 0.5s ease-in-out";
    if (Math.abs(currentScroll - lastScroll) > threshold) {
      nav.style.transform = currentScroll > lastScroll ? "translateY(-100%)" : "translateY(0)";
    }
    lastScroll = currentScroll;
  });

  // Инициализация галереи
  function init() {
    track.style.willChange = "transform";
    gallery.style.height = `${track.scrollHeight}px`;
    startScroll();
    activateParallax();
  }

  init();
});


function updateScroll() {
  startY = lerp(startY, endY, easing);
  gallery.style.height = `${track.clientHeight}px`;
  track.style.transform = `translateY(-${startY}px)`;

  activateParallax();

  // Остановка анимации, если движение почти прекратилось
  if (Math.abs(startY - endY) < 0.05) {
    cancelAnimationFrame(raf);
    raf = null;
  } else {
    raf = requestAnimationFrame(updateScroll);
  }
}
