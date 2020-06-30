"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.addEventListener('DOMContentLoaded', function () {
  var search = document.querySelector('.search'),
    cartBtn = document.getElementById('cart'),
    wishlistBtn = document.getElementById('wishlist'),
    goodsWrapper = document.querySelector('.goods-wrapper'),
    cart = document.querySelector('.cart'),
    category = document.querySelector('.category'),
    cardCounter = cartBtn.querySelector('.counter'),
    wishlistCounter = wishlistBtn.querySelector('.counter'),
    cartWrapper = document.querySelector('.cart-wrapper');
  var wishlist = [];
  var goodsBasket = {}; // spinner

  var loading = function loading(nameFunction) {
    var spinner = "\n          <div id=\"spinner\"><div class=\"spinner-loading\">\n          <div><div><div></div></div><div><div></div></div>\n          <div><div></div></div><div><div></div></div></div></div></div>\n          ";

    if (nameFunction === 'renderCard') {
      goodsWrapper.innerHTML = spinner;
    }

    if (nameFunction === 'renderBasket') {
      cartWrapper.innerHTML = spinner;
    }
  }; // Получение информации о товарах из базы данных (запрос на сервер)


  var getGoods = function getGoods(handler, filter) {
    loading(handler.name);
    fetch('db/db.json').then(function (response) {
      return response.json();
    }).then(filter).then(handler);
  }; // Формирование карточек товара


  var createCardGoods = function createCardGoods(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
    card.innerHTML = "\n      <div class=\"card\">\n        <div class=\"card-img-wrapper\">\n          <img class=\"card-img-top\" src=\"".concat(img, "\" alt=\"").concat(title, "\">\n          <button class=\"card-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\"\n            data-goods-id=\"").concat(id, "\">\n          </button>\n        </div>\n        <div class=\"card-body justify-content-between\">\n          <a href=\"#\" class=\"card-title\">").concat(title, "</a>\n          <div class=\"card-price\">").concat(price, " \u20BD</div>\n          <div>\n            <button class=\"card-add-cart\" data-goods-id=\"").concat(id, "\">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443</button>\n          </div>\n        </div>\n      </div>\n    ");
    return card;
  }; // Рендер товаров в корзине


  var createCardGoodsBasket = function createCardGoodsBasket(id, title, price, img) {
    var card = document.createElement('div');
    card.className = 'goods';
    card.innerHTML = "\n      \t\t<div class=\"goods-img-wrapper\">\n\t\t\t\t\t\t<img class=\"goods-img\" src=\"".concat(img, "\" alt=\"").concat(title, "\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-description\">\n\t\t\t\t\t\t<h2 class=\"goods-title\">").concat(title, "</h2>\n\t\t\t\t\t\t<p class=\"goods-price\">").concat(price, " \u20BD</p>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"goods-price-count\">\n\t\t\t\t\t\t<div class=\"goods-trigger\">\n              <button class=\"goods-add-wishlist ").concat(wishlist.includes(id) ? 'active' : '', "\"\n               data-goods-id=\"").concat(id, "\"></button>\n\t\t\t\t\t\t\t<button class=\"goods-delete\" data-goods-id=\"").concat(id, "\"></button>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"goods-count\">").concat(goodsBasket[id], "</div>\n\t\t\t\t\t</div>\n    ");
    return card;
  }; // Перебор и вывод товаров по запросу


  var renderCard = function renderCard(goods) {
    goodsWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref) {
        var id = _ref.id,
          title = _ref.title,
          price = _ref.price,
          imgMin = _ref.imgMin;
        goodsWrapper.append(createCardGoods(id, title, price, imgMin));
      });
    } else {
      goodsWrapper.textContent = '❌ Извините, по Вашему запросу ничего не найдено 😞';
    }
  }; // Вывод товаров в корзине


  var renderBasket = function renderBasket(goods) {
    cartWrapper.textContent = '';

    if (goods.length) {
      goods.forEach(function (_ref2) {
        var id = _ref2.id,
          title = _ref2.title,
          price = _ref2.price,
          imgMin = _ref2.imgMin;
        cartWrapper.append(createCardGoodsBasket(id, title, price, imgMin));
      });
    } else {
      cartWrapper.innerHTML = '<div id="cart-empty">Ваша корзина пока пуста</div >';
    }
  }; // Подсчет суммы товаров в корзине


  var calcTotalPrice = function calcTotalPrice(goods) {
    var sum = goods.reduce(function (accum, item) {
      return accum + item.price * goodsBasket[item.id];
    }, 0); // Вариант подсчета суммы в корзине через цикл for
    // for (const item of goods) {
    //   sum += item.price * goodsBasket[item.id];
    // }

    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
  };

  var checkCount = function checkCount() {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
  }; // Фильтры


  var showCardBasket = function showCardBasket(goods) {
    var basketGoods = goods.filter(function (item) {
      return goodsBasket.hasOwnProperty(item.id);
    });
    calcTotalPrice(basketGoods);
    return basketGoods;
  };

  var randomSort = function randomSort(item) {
    return item.sort(function () {
      return Math.random() - 0.5;
    });
  };

  var showWishlist = function showWishlist() {
    getGoods(renderCard, function (goods) {
      return goods.filter(function (item) {
        return wishlist.includes(item.id);
      });
    });
  }; // Работа с хранилищами


  var getCookie = function getCookie(name) {
    var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  var cookieQuery = function cookieQuery(get) {
    if (get) {
      if (getCookie('goodsBasket')) {
        Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
      }

      checkCount();
    } else {
      document.cookie = "goodsBasket=".concat(JSON.stringify(goodsBasket), "; max-age=86400e3");
    }
  };

  var storageQuery = function storageQuery(get) {
    if (get) {
      if (localStorage.getItem('wishlist')) {
        wishlist.push.apply(wishlist, _toConsumableArray(JSON.parse(localStorage.getItem('wishlist'))));
      }

      checkCount();
    } else {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }; // События
  // Открытие и закрытие модального окна корзины покупок


  var closeBasket = function closeBasket(event) {
    var target = event.target;

    if (target === cart || target.classList.contains('cart-close') || event.keyCode === 27) {
      cart.style.display = '';
      document.removeEventListener('keyup', closeBasket);
    }
  };

  var openBasket = function openBasket(event) {
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeBasket);
    getGoods(renderBasket, showCardBasket);
  }; // Выбор категории


  var choiceCategory = function choiceCategory(event) {
    event.preventDefault();
    var target = event.target;

    if (target.classList.contains('category-item')) {
      var _category = target.dataset.category;
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return item.category.includes(_category);
        });
      });
    }
  }; // Поиск товара


  var searchGoods = function searchGoods(event) {
    event.preventDefault();
    var input = event.target.elements.searchGoods;
    var inputValue = input.value.trim();

    if (inputValue !== '') {
      var searchString = new RegExp(inputValue, 'i');
      getGoods(renderCard, function (goods) {
        return goods.filter(function (item) {
          return searchString.test(item.title);
        });
      });
    } else {
      search.classList.add('error');
      setTimeout(function () {
        search.classList.remove('error');
      }, 2000);
    }

    input.value = '';
  }; // Удаление товаров из корзины


  var removeGoods = function removeGoods(id) {
    delete goodsBasket[id];
    checkCount();
    cookieQuery();
    getGoods(renderBasket, showCardBasket);
  }; // handlers


  var handlerGoods = function handlerGoods(event) {
    var target = event.target;

    if (target.classList.contains('card-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    if (target.classList.contains('card-add-cart')) {
      addBasket(target.dataset.goodsId);
    }
  };

  var handlerBasket = function handlerBasket(event) {
    var target = event.target;

    if (target.classList.contains('goods-add-wishlist')) {
      toggleWishlist(target.dataset.goodsId, target);
    }

    if (target.classList.contains('goods-delete')) {
      removeGoods(target.dataset.goodsId);
    }
  };

  var toggleWishlist = function toggleWishlist(id, elem) {
    if (wishlist.includes(id)) {
      wishlist.splice(wishlist.indexOf(id), 1);
      elem.classList.remove('active');
    } else {
      wishlist.push(id);
      elem.classList.add('active');
    }

    checkCount();
    storageQuery();
  };

  var addBasket = function addBasket(id) {
    if (goodsBasket[id]) {
      goodsBasket[id] += 1;
    } else {
      goodsBasket[id] = 1;
    }

    checkCount();
    cookieQuery();
  }; // Инициализация


  {
    getGoods(renderCard, randomSort);
    storageQuery(true);
    cookieQuery(true);
    cartBtn.addEventListener('click', openBasket);
    cart.addEventListener('click', closeBasket);
    category.addEventListener('click', choiceCategory);
    search.addEventListener('submit', searchGoods);
    goodsWrapper.addEventListener('click', handlerGoods);
    cartWrapper.addEventListener('click', handlerBasket);
    wishlistBtn.addEventListener('click', showWishlist);
  }
  ;
});