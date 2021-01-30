const swiper = new Swiper('.swiper-container', {
  direction: 'horizontal',
  loop: true,

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  grabCursor: true,
  paginationClickable: true,
  breakpoints: {
    576: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
  },
});

const btnClose = document.querySelector('#btnClose');

btnClose.onclick = closeAnnouncement;

function closeAnnouncement() {
  const element = document.getElementById('announcement');
  element.classList.remove('active');
}
