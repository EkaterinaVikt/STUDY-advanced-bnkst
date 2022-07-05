'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Модальное окно
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////
// Кнопка скроллинга
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect(); //определяем координаты, нахождение элемента на странице
  console.log(e.target.getBoundingClientRect()); //покажем координаты кнопки btnScrollTo

  console.log('Current scroll (X/Y', window.pageXOffset, window.pageYOffset); //показывает текущий скролл (например, если находишься на главной странице и ещё никуда не крутил, то будет 0 и 0)
  // получить размер окна просмотра (например, если он сузил браузер, это отобразится)
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////
// Навигация по странице

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //не даёт сразу при клике прыгать на ссылку, чтобы мы сделали механику плавного скроллинга
//     console.log('LINK');
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// 1. Добавляем eventListener к общему родительскому элементу
// 2. Определяем, какой элемент вызвал событие

// Делегация ивента

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Стратегия совпадений
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Переключение вкладок

// Вот этот вариант может загружать память, если вкладок будет много, поэтому лучше использовать event delegation -- назначить слушатель событий родительскому элементу, общему для всех кнопок
// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

tabsContainer.addEventListener('click', function (e) {
  // находит ближайший элемент с этим классом, так мы будем находить кнопку в любом случае -- и при клике на кнопку, и на цифру-строчку.
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //если clicked не существует и это null, то немедленно заканчиваем эту функцию
  if (!clicked) return;
  // Удаление активных классов у неактивныъ элементов, чтобы скрыть их или опустить вниз
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  // Активация вкладки
  clicked.classList.add('operations__tab--active');

  // Активация контента
  // dataset.tab считывает атрибут data-tab и выдаёт его число
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const hadnleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    //записываем текущую цель в переменную
    const link = e.target;
    // снова находим ближайшего родителя и у него определяем всех детей
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this; //оно может быть равно opacity, но this и так ссылает его на переданный opacity, который мы передали, используя bind при вызове функции
  }
};

//можно сделать так, но если использовать bind-метод, то будет ещё "чище"
/*
nav.addEventListener('mouseover', function (e) {
  hadnleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  hadnleHover(e, 1);
});
*/

// Передаём аргумент в хэндлер. Метод bind позволяет "прибиндить" определённое значение и НЕ ВЫЗЫВАЕТ функцию, а всегда возвращает новую функцию.
nav.addEventListener('mouseover', hadnleHover.bind(0.5));
nav.addEventListener('mouseout', hadnleHover.bind(1));

// Sticky navigation

// Не лучший способ, потому что постоянный захват скроллинга перегружает операционку
/*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
else nav.classList.remove('sticky');

window.addEventListener('scroll', function (e) {
  console.log(window.scrollY); //показ текущей позиции скролла
  // когда мы достигаем начала первой секции, мы добавляем класс sticky
});
*/

// "Липкая" навигация с помощью intersection observer API
/* //пример
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOption = {
  root: null,
  // threshold: 0.1, //порог 10%
  threshold: [0, 0.2], //вызывается тогда, когда видно 0% section1 и 0.2% во viewport
};

const observer = new IntersectionObserver(obsCallback, obsOption);
observer.observe(section1);
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; //то же самое, что взять entries[0];
  console.log(entry);
  // если isIntersecting -- false, добавляем класс sticky
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, // это viewport
  threshold: 0, // когда видно 0% хедера, что-то происходит
  rootMargin: `-${navHeight}px`, //добавляет сверх отступ в нужное число пикселей, чтобы меню красиво заняло место, вычисляем это из нашего объекта через boundingClient
});
headerObserver.observe(header);

// Появляющие секции (по умолчанию у всех стоит 0)
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // удалили наблюдатель после единоразового выполнения, теперь не выводит в консоль ничего после скроллинга всего экрана
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //класс с видимостью 0 лучше добавлять с помощью js, потому что если у человека браузер без него, он не увидит их, если мы сразу впишем их в html
  // section.classList.add('section--hidden');
});

// Lazy loading images
// Выбираем все img с нужным нам атрибутом
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //Заменяем src на data-src
  entry.target.src = entry.target.dataset.src;
  // используем load event, потому что b.t.s джс находит картинку и загружает её
  // он удалит класс lazy-img, который даёт блёр, только тогда, когда полностью загрузит картинку. Таким образом пользователь не увидит картинку низкого качества.
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //когда остаётся 200 пикселей до картинки, он начинает её грузить
});
// каждой картинке назначаем imgObserver
imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////////
// Слайдер
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Функции
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Переключение на следующий слайд
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    //для каждого элемента берём текущий слайд и вычитаем
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Слушатель события нажатия на стрелочки влево и вправо
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      // то же самое, что и вот это
      //const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/*
//ВЫБОР ЭЛЕМЕНТА
console.log(document.documentElement); //покажет html-код всей страницы
console.log(document.head); //покажет html-код <head>
console.log(document.body); //покажет html-код <body>

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections); // покажет нод лист всех section

document.getElementById('#section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons); //возвращает HTML Collections -- в отличие от нод листа, она обновляется автоматически, если мы вносим изменения через DOM в структуру html

console.log(document.getElementsByClassName('btn'));

// СОЗДАНИЕ И ВСТАВКА ЭЛЕМЕНТОВ
// .insertAdjacentHTML -- вставить соседний элемент

const message = document.createElement('div'); //пока ещё не появится в документе, он есть в DOM
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

// Добавить как дочерний
// header.prepend(message); // добавляет элемент перед первым указанным как дочерний
header.append(message); // добавляет после первого указанного как дочерний. Так же эти методы можно использовать, чтобы двигать элементы между собой

// header.append(message.cloneNode(true)); // добавится ко всем дочерним

// Добавить как сестринский (сиблинг)
header.after(message);
header.before(message);

// Удаление элемента
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //раньше использовали message.parentElement.removeChild(message);
  });
/*
// СТИЛИ
message.style.backgroundColor = '#37383d';
message.style.width = '120%'; // они становятся инлайн-стилями, т.к. вписаны в DOM. Мы не можем вывести стили из листа CSS, это работает только для инлайн-стилей:
console.log(message.style.color); //ничего
console.log(message.style.backgroundColor); // rgb(55,56,61), мы вписали этот цвет выше

// чтобы увидеть стили элемента из css, используем метод getComputedStyle()
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height); // здесь будет высота, которую вычислил браузер

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// АТРИБУТЫ
const logo = document.querySelector('.nav__logo');
// получаем стандартные атрибуты для этого типа, например, для картинки alt -- стд атрибут, и мы его увидим
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beaitiful minimalist logo';

// это не стандарт, поэтому так просто не сработает
console.log(logo.designer);
// а вот так сработает
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');
//Разные адреса
console.log(logo.src); //покажет абсолютный урл
console.log(logo.getAttribute('src')); //покажет относительный урл
// будут одинаковы, потому что абсолютны
const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

// Атрибуты данных
console.log(logo.dataset.versionNumber);

// КЛАССЫ
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // не includes
// Не использовать ниже, потому что оно перезапишет все классы и сделает один -- тот, который ты задал
logo.className = 'Jonas';
*/

// СЛУШАТЕЛИ СОБЫТИЙ
/*
const h1 = document.querySelector('h1');
// Аналог ховера

const alertH1 = function (e) {
  alert('Великолепно! Вы прочитали заголовок');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // удаляет слушатель спустя 3 секунды

// h1.onmouseenter = function (e) {
//   alert('Onmouseenter: Это непосредственное событие');
// };

/*
<h1 onclick="alert('HTML alert')"> */

/*
// Bubbling and capturing of event
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor(); //клик на одну ссылку будет вызывать срабатывание в родителях, если там есть этот слушатель событий
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this); // true

  // Остановить распространение ивента
  // e.stopPropagation(); //вот так клик ивент не распространится на остальные элементы и они не поменяют цвет. Можно использовать, чтобы фиксить проблемы, но лучше не делать это в самом рабочем коде.
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log('LINK');
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
  },
  true //передаем capture, теперь первым делом событие сработает в nav (ниче не поняла), почти не используется
);
*/

// Блуждание по ДОМу
/*
const h1 = document.querySelector('h1');

// Идём вниз и ищем дочерние элементы
console.log(h1.querySelectorAll('.highlight'));
// Ищем прямых потомков
// Находит все узлы (в т.ч. коммент, например)
console.log(h1.childNodes);
// Найдёт только три прямых (!) дочерних тега -- span, br, span.highlight
console.log(h1.children);
h1.firstElementChild.getElementsByClassName.color = 'white';
h1.lastElementChild.getElementsByClassName.color = 'orangered';
*/

/*
// Идём вверх, ищем родителя
console.log(h1.parentNode);
console.log(h1.parentElement);

// Находит ближайший родительский элемент, который имеет этот класс
h1.closest('.header').style.background = 'var( --gradient-secondary)';

// querySelector находит детей, closest находит родителей

// Ищем сиблингов

console.log(h1.previousElementSibling); //null, т.к. он первый
console.log(h1.nextElementSibling); // h4, т.к. это его следующий сиблинг

//Находит узлы, тут будет text
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// Чтобы найти всех сиблингов, запрашиваем родителя, а уже у него -- всех сиблингов
console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  // для всех сиблингов, кроме самого h1, изменим размер на 50%
  if (el !== h1) el.style.transform = 'scale(0.5';
});
*/

//////////////////
// Прочие ДОМ-события

// DOM Content Loaded -- когда загружается html страницы и DOM-дерево точно построено
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// страница полностью загружена
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// то, что сработает перед закрытием страницы -- "Вы точно хотите покинуть страницу?"
/*
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  // возвращает стандартный поп-ап браузера со стандартным сообщением
  e.returnValue = '';
});
*/
