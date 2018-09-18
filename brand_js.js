
/**
 * Находит элемент c идентификаторами товара, который покупает пользователь.
 * @param {HTMLElement} elem - Кнопка покупки товара, на которую кликнул пользователь. 
 */
function findElem(elem) {
  var buttonCart = elem.closest('.addToCartWrap');
if (!buttonCart) return;
  var targetElem = elem.closest('.oneProductWrap');
  if (!targetElem) {
    return;
  } else {
  checkProduct(targetElem);
  }
}

/**
 * Проверяет наличие товара в корзине.
 * @param {*} elem 
 */
function checkProduct(elem) {
  var elemid = +elem.id;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/basket?product-id=' + elemid);
  xhr.send();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if(xhr.status !== 200) {
        // getMessage ('Произошла ошибка');
      } 
      var result = JSON.parse(xhr.responseText);
      if (result.length === 0) {
        putNewProduct(elem);
      } else {
        var goods = result[0];
        addQuantityOfProduct(goods);
      }
    }
  };
}

/**
 * Добавляет новый товар в корзину.
 * @param {HTMLElement} elem 
 */
function putNewProduct(elem) {
  var product = JSON.stringify({
   'product-id': +elem.id,
    name: elem.dataset.name,
    price: elem.dataset.price,
    image_min_url: elem.dataset.image_min_url,
    quantity: 1
  });
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/basket');
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) return;
  };
  xhr.send(product);
}

/**
 * Увеличивает количество уже имеющегося товара в корзине.
 * @param {Object} goods - Объект товара в корзине.
 */
function addQuantityOfProduct(goods) {
  var id = goods.id;
  var quantity = +goods.quantity + 1;
  var goodsQuantity = JSON.stringify({
     quantity: quantity
   });
  var xhr = new XMLHttpRequest();
  xhr.open('PATCH', 'http://localhost:3000/basket/' + id);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) return;
  };
  xhr.send(goodsQuantity);
}

/**
 * Считает количество товаров в корзине и создает DOM-элемент - счетчик количества товаров в корзине.
 */
function makeCounter() {
  var quantityAll = 1;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:3000/basket');
  xhr.send();
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response.getAllResponseHeader);
      var result = JSON.parse(xhr.responseText);

      result.forEach(function(item) {
      quantityAll = quantityAll + item.quantity; 
      });

      var elem = document.querySelector('#quantityProduct');
      elem.classList.add('active');
      elem.textContent = quantityAll;
    }
  };
}

window.onload = function() {

    document.querySelector(".products").addEventListener('click', function(event) {
      findElem(event.target);
      makeCounter();


    event.preventDefault();
  });
};


/**
 * Возможность перемещения товаров в корзину мышью.
 */
(function($){
  $(function(){

    $('.imageOneProduct').draggable({
      helper: 'clone',
      revert: 'invalide',
      opacity: 0.6,
      stack: '.imageOneProduct',
      zIndex: 100,
      drag: function() {
        $('.ui-draggable-dragging').css(
          {'width': '120px'},
          {'height': '200px'}
        );
      }
    });

    $('.userBasket').droppable({
      activeClass: "ui-state-highlight",
    });


  });  
})(jQuery);








