"use strict";

document.addEventListener('DOMContentLoaded', () => {

  const search = document.querySelector('.search'),
    cartBtn = document.getElementById('cart'),
    wishlistBtn = document.getElementById('wishlist'),
    goodsWrapper = document.querySelector('.goods-wrapper'),
    cart = document.querySelector('.cart'),
    category = document.querySelector('.category');

  // spinner
  const loading = () => {
    goodsWrapper.innerHTML = `
          <div id="spinner"><div class="spinner-loading">
          <div><div><div></div></div><div><div></div></div>
          <div><div></div></div><div><div></div></div></div></div></div>
          `
  }

  // Формирование карточки товара

  const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = `
      <div class="card">
        <div class="card-img-wrapper">
          <img class="card-img-top" src="${img}" alt="${title}">
          <button class="card-add-wishlist" data-goods-id="${id}"></button>
        </div>
        <div class="card-body justify-content-between">
          <a href="#" class="card-title">${title}</a>
          <div class="card-price">${price} ₽</div>
          <div>
            <button class="card-add-cart" data-goods-id="${id}>Добавить в корзину</button>
          </div>
        </div>
      </div>
    `;
    return card;
  };

  // Перебор и создание всех карточек

  const renderCard = items => {
    goodsWrapper.textContent = '';
    items.forEach(({ id, title, price, imgMin }) => {
      goodsWrapper.append(createCardGoods(id, title, price, imgMin));
    });
  };

  // Открытие и закрытие модального окна корзины покупок
  const openCart = event => {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
  };

  const closeCart = event => {
    const target = event.target;
    if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeCart);
    }
  };

  // Получение информации о товарах из базы данных
  const getGoods = (handler, filter) => {
    loading();
    fetch('db/db.json')
      .then(response => response.json())
      .then(filter)
      .then(handler);
  };

  const randomSort = item => item.sort(() => Math.random() - 0.5);

  const choiceCategory = event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('category-item')) {
      const category = target.dataset.category;
      getGoods(renderCard, goods => goods.filter(item => item.category.includes(category)));
    }
  };

  // Реализация поиска товара
  const searchGoods = event => {
    event.preventDefault();

    const input = event.target.elements.searchGoods;
    const inputValue = input.value.trim();
    if (inputValue !== '') {
      const searchString = new RegExp(inputValue, 'i')
      getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
    }

  };

  cartBtn.addEventListener('click', openCart);
  cart.addEventListener('click', closeCart);
  category.addEventListener('click', choiceCategory);
  search.addEventListener('submit', searchGoods)

  getGoods(renderCard, randomSort);






});