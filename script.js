/*
 * Лёгкие скрипты для сайта: анимации появления элементов при прокрутке
 * и плавный переход по якорям.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Создаём наблюдатель, который будет реагировать, когда элементы появляются в зоне видимости
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-show');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Помечаем все элементы с классом .scroll-hidden для наблюдения
  document.querySelectorAll('.scroll-hidden').forEach(el => {
    observer.observe(el);
  });

  // Плавный скролл по якорным ссылкам
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Лайтбокс для галереи
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(img => {
      img.addEventListener('click', () => {
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
      });
    });
    lightbox.addEventListener('click', () => {
      lightbox.style.display = 'none';
    });
  }

  /*
   * Пользовательская реализация прилипающего скролла.
   *
   * Хотя в CSS включён scroll‑snap, в некоторых браузерах с длинными
   * секциями он может вести себя нестабильно. Чтобы гарантировать, что
   * при прокрутке колёсиком страницы будут останавливаться на начале
   * следующего или предыдущего блока, отслеживаем wheel‑события и
   * принудительно вызываем scrollIntoView() для соседних секций.
   */
  const scrollSections = Array.from(document.querySelectorAll('header, section'));
  let autoScrolling = false;

  // Функция определяет индекс секции, которая ближе всего к верхней границе окна
  function getCurrentSectionIndex() {
    const scrollY = window.scrollY;
    let currentIndex = 0;
    for (let i = 0; i < scrollSections.length; i++) {
      const sectionTop = scrollSections[i].offsetTop;
      if (scrollY >= sectionTop - 10) {
        currentIndex = i;
      } else {
        break;
      }
    }
    return currentIndex;
  }

  // window.addEventListener('wheel', (e) => {
  //   // Если уже выполняется автоматическая прокрутка — игнорируем событие
  //   if (autoScrolling) return;
  //   const delta = e.deltaY;
  //   // Определяем направление прокрутки
  //   const direction = delta > 0 ? 1 : -1;
  //   const currentIndex = getCurrentSectionIndex();
  //   let targetIndex = currentIndex + direction;
  //   // Ограничиваем индекс допустимым диапазоном
  //   targetIndex = Math.max(0, Math.min(targetIndex, scrollSections.length - 1));
  //   // Если следующая секция отличается от текущей, блокируем стандартный scroll и запускаем плавный переход
  //   if (targetIndex !== currentIndex) {
  //     e.preventDefault();
  //     autoScrolling = true;
  //     scrollSections[targetIndex].scrollIntoView({ behavior: 'smooth' });
  //     // Разрешаем новые события после завершения анимации
  //     setTimeout(() => {
  //       autoScrolling = false;
  //     }, 800);
  //   }
  // }, { passive: false });
});