/* variables */
let citylist = [
  "Москва",
  "Караганда",
  "Магадан",
  "Люберцы",
  "Севастополь",
  "Ярославль",
  "Вологда",
  "Владивосток",
  "Барнаул",
  "Петрозаводск",
  "Самара",
  "Саратов",
  "Тверь",
  "Вашингтон",
  "Париж",
  "Пермь",
  "Екатеринбург",
  "Новосибирск",
  "Калининград",
];
let rangemin = 0;
let rangemax = 300000;
let startbasket = [];

/* functions */

function getModalWindow(idname) {
  $("body").append(
    '<div class="screener"></div><div class="modal" id="' +
      idname +
      '"><button type="button" class="close">&times;</button></div>'
  );
  $(".screener, .modal .close").click(dropModalWindow);
}
function dropModalWindow() {
  $(".screener, .modal").remove();
}
function actiontimer() {
  let counter = new Date($(".actiontimer").data("actionend"));
  let today = new Date();
  let delta = counter.getTime() - today.getTime();
  let res = true;
  if (delta < 0) {
    delta = 0;
    res = false;
  }
  delta = Math.round(delta / 1000);
  let seconds = delta % 60;
  delta = Math.floor(delta / 60);
  let minutes = delta % 60;
  delta = Math.floor(delta / 60);
  let hours = delta % 24;
  let days = Math.floor(delta / 24);
  let helpstr = `<span>${days}</span> ${multiple(
    days,
    "день",
    "дня",
    "дней"
  )} <span>${addZero(hours)}</span> ${multiple(
    hours,
    "час",
    "часа",
    "часов"
  )} <span>${addZero(minutes)}</span> ${multiple(
    minutes,
    "минута",
    "минуты",
    "минут"
  )} <span>${addZero(seconds)}</span> ${multiple(
    seconds,
    "секунда",
    "секунды",
    "секунд"
  )}`;
  $(".actiontimer").html(helpstr);
  return res;
}
function addZero(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}
function multiple(num, word1, word2, word3) {
  wnum = num % 100;
  if (wnum % 10 == 1 && wnum != 11) {
    return word1;
  } else if (
    wnum % 10 >= 2 &&
    wnum % 10 <= 4 &&
    wnum != 12 &&
    wnum != 13 &&
    wnum != 14
  ) {
    return word2;
  } else {
    return word3;
  }
}
function orderReCount() {
  let point = $(".table");
  let allsum = 0;
  point.find("tbody tr").each(function () {
    let price = +$(this).find(".price").html();
    let qty = +$(this).find(".qty strong").html();
    let sum = qty * price;
    allsum += sum;
    $(this).find(".sum").html(sum);
  });
  point.find(".allsum span").html(allsum);
}
function changeOrder(line, num) {
  let newnum = +$(line).find(".qty strong").html() + num;
  if (newnum > 0) {
    $(line).find(".qty strong").html(newnum);
    orderReCount();
  }
}

/* on ready */

$(function () {
  $(".topmenu a").each(function () {
    if (this.href == location.href.split("#")[0]) this.className = "current";
  });

  $("#city span").html(localStorage.getItem("city") || "Москва");

  $("#city").click(function () {
    getModalWindow("citymodal");
    $(".modal").append(
      '<h5>Выберите город:</h5><input type="text" id="citysearch" placeholder="Введите часть названия города..."><div class="columns"></div>'
    );
    for (let city of citylist) {
      $(".modal .columns").append("<p>" + city + "</p>");
    }
    $(".modal p").click(function () {
      let city = $(this).html();
      $("#city span").html(city);
      localStorage.setItem("city", city);
      dropModalWindow();
    });
    $("#citysearch").on("input", function () {
      let namepart = $("#citysearch").val().toLowerCase();
      $(".modal p").each(function () {
        if (!this.innerHTML.toLowerCase().includes(namepart)) {
          this.style.display = "none";
        } else {
          this.style.display = "block";
        }
      });
    });
  });

  /*================*/

  if ($(".action").length) {
    actiontimer();
    let timer0 = setInterval(function () {
      if (!actiontimer()) clearInterval(timer0);
    }, 1000);
  }

  $(".slider").each(function () {
    makeSlider(this.id, 4000);
  });

  if ($(".catmenu li li").length) {
    if ($(".catmenu.simple").length) {
      // если мы хотим простейший аккордеон без сложной анимации
      $(".catmenu > ul > li").click(function (e) {
        if (e.target.tagName != "A") {
          $(".open").removeClass("open"); // отнимаем класс open у ранее открытого вложенного списка
          $(this).find("ul").addClass("open"); // добавляем класс open вложенному списку в кликнутом пункте
        }
      });
    } else {
      // если мы хотим аккордеон с более красивой анимацией
      $(".catmenu li li").slideUp(1); // скрываем все пункты второго уровня
      $(".catmenu > ul > li").click(function (e) {
        // ловим клик на пункте первого уровня
        if (e.target.tagName != "A" && !$(this).find(".open").length) {
          // если клик не был по ссылке и вложенный список в этом пункте уже не раскрыт...
          let here = $(this).find("ul"); // сохраняем указатель на вложенный список в кликнутом пункте
          if (here.length) {
            // если в кликнутом пункте есть вложенный список...
            if ($(".catmenu .open").length) {
              // если был раскрытый вложенный список...
              $(".catmenu .open li").slideUp(1000, function () {
                // прячем его пункты
                $(".catmenu .open").removeClass("open"); // затем убираем с него класс open
                here.find("li").slideDown(1000, function () {
                  // затем открываем пункты списка по нашему указателю
                  here.addClass("open"); // и вешаем на него класс open
                });
              });
            } else {
              // если раскрытого вложенного списка не было...
              here.find("li").slideDown(1000, function () {
                // открываем пункты списка по нашему указателю
                here.addClass("open"); // и вешаем на него класс open
              });
            }
          } else {
            if ($(".catmenu .open").length) {
              // если был раскрытый вложенный список...
              $(".catmenu .open li").slideUp(1000, function () {
                // прячем его пункты
                $(".catmenu .open").removeClass("open"); // затем убираем с него класс open
              });
            }
          }
        }
      });
    }
  }

  /*==================*/

  if ($("#slider-range").length) {
    $("#slider-range").slider({
      range: true,
      min: rangemin,
      max: rangemax,
      values: [rangemin, rangemax],
      slide: function (event, ui) {
        $("#amount1").val(ui.values[0]);
        $("#amount2").val(ui.values[1]);
      },
    });
    $("#amount1").on("change", function () {
      let v1 = +$("#amount1").val();
      let v2 = +$("#amount2").val();
      if (v1 > rangemax) {
        v1 = rangemax;
      } else if (v1 < rangemin) {
        v1 = rangemin;
      }
      $("#amount1").val(v1);
      if (v1 > v2) {
        v2 = v1;
        $("#amount2").val(v2);
      }
      $("#slider-range").slider("values", [v1, v2]);
    });
    $("#amount2").on("change", function () {
      let v1 = +$("#amount1").val();
      let v2 = +$("#amount2").val();
      if (v2 > rangemax) {
        v1 = rangemax;
      } else if (v2 < rangemin) {
        v1 = rangemin;
      }
      $("#amount2").val(v2);
      if (v1 > v2) {
        v1 = v2;
        $("#amount1").val(v1);
      }
      $("#slider-range").slider("values", [v1, v2]);
    });
    $("#amount1").val(rangemin);
    $("#amount2").val(rangemax);
  }

  console.log("just loaded");
});
/*============= end sity ==============*/

/*=============== banner-section__slider ==============*/

$(function () {
  $(".banner-section__slider").slick({
    dots: true,
    prevArrow:
      '<button class="banner-section__slider-btn banner-section__slider-btnPrev"><img src="images/arrow-left.svg" alt="arrow-left"></button>',
    nextArrow:
      '<button class="banner-section__slider-btn banner-section__slider-btnNext"><img src="images/arrow-right.svg" alt="arrow-right"></button>',
    responsive: [
      {
        breakpoint: 969,
        settings: {
          arrows: false,
        },
      },
    ],
  });

  $(".tab").on("click", function (e) {
    e.preventDefault();

    $($(this).siblings()).removeClass("tab--active");
    $($(this).closest(".tabs-wrapper").siblings().find("div")).removeClass(
      "tabs-content--active"
    );

    $(this).addClass("tab--active");
    $($(this).attr("href")).addClass("tabs-content--active");

    $(".product-slider").slick("setPosition");
  });

  $(".product-item__favorite").on("click", function () {
    $(".product-item__favorite").toggleClass("product-item__favorite--active");
  });

  $(".product-slider").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow:
      '<button class="product-slider__slider-btn product-slider__slider-btnPrev"><img src="images/arrow-black-left.svg" alt="arrow-black-left"></button>',
    nextArrow:
      '<button class="product-slider__slider-btn product-slider__slider-btnNext"><img src="images/arrow-black-right.svg" alt="arrow-black-right"></button>',
    responsive: [
      {
        breakpoint: 1301,
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 1201,
        settings: {
          slidesToShow: 3,
          dots: true,
        },
      },
      {
        breakpoint: 870,
        settings: {
          slidesToShow: 2,
          dots: true,
        },
      },
      {
        breakpoint: 590,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
    ],
  });

  $(".filter-style").styler();

  $(".filter__item-drop, .filter__extra").on("click", function () {
    $(this).toggleClass("filter__item-drop--active");
    $(this).next().slideToggle("200");
  });

  $(".js-range-slider").ionRangeSlider({
    type: "double",
    min: 100000,
    max: 500000,
  });

  $(".catalog__filter-btnGrid").on("click", function () {
    $(this).addClass("catalog__filter-button--active");
    $(".catalog__filter-btnLine").removeClass("catalog__filter-button--active");
    $(".product-item__wrapper").removeClass("product-item__wrapper--list");
  });

  $(".catalog__filter-btnLine").on("click", function () {
    $(this).addClass("catalog__filter-button--active");
    $(".catalog__filter-btnGrid").removeClass("catalog__filter-button--active");
    $(".product-item__wrapper").addClass("product-item__wrapper--list");
  });

  $(".rate-yo").rateYo({
    ratedFill: "#1C62CD",
    normalFill: "#C4C4C4",
    spacing: "7px",
  });

  $(".menu__btn").on("click", function () {
    $(".menu-mobile__list").toggleClass("menu-mobile__list--active");
  });

  $(".footer__topDrop").on("click", function () {
    $(this).next().slideToggle();
    $(this).toggleClass("footer__topDrop--active");
  });

  $(".aside__btn").on("click", function () {
    $(this).next().slideToggle();
  });
});
/*===============  ang banner-section__slider ==============*/

/*=========== action timer =======*/

$(function () {
  const endtime = new Date(2022, 11, 28, 20, 34, 0);
  /*
  var now = new Date();
  now.setSeconds(now.getSeconds() + 10); // timestamp
  endtime = new Date(now); // Date object
*/
  let header = $("header").offset();
  let ul;

  $(".slider").bxSlider({
    mode: "fade",
    captions: true,
    randomStart: true,
    slideWidth: 1140,
    pause: 6000,
    auto: true,
  });
  $(window).scroll(function () {
    if ($(window).scrollTop() > header.top) {
      $("header").addClass("sticky");
    } else {
      $("header").removeClass("sticky");
    }
  });
  $(window).resize(function () {
    if ($(".footer").css("flex-direction") === "row") {
      $(".footer-item ul").removeAttr("style");
      $(".footer-item h4").removeClass("border-bottom");
    }
  });
  $("#nav").click(function () {
    $(this).toggleClass("open");
    if ($(this).hasClass("open")) {
      $("nav.header").slideDown({
        duration: "slow",
        start: function () {
          $(this).css({
            display: "flex",
          });
        },
      });
    } else {
      $("nav.header").slideUp("slow");
    }
  });
  $("h4").on("click", function () {
    if ($(this).children().css("display") == "block") {
      ul = $(this).next();
      if (ul.css("display") === "none") {
        $(".footer-item ul").slideUp("slow");
        $(".footer-item h4").removeClass("border-bottom");
        $(this).not(".border-bottom").addClass("border-bottom");
      }
      ul.slideToggle("slow", () => {
        if (ul.css("display") === "none") {
          $(this).removeClass("border-bottom");
        }
      });
    }
  });
  if (endtime > new Date()) {
    initializeTimer(endtime);
    $("#sale").slideDown("slow");
  }
  console.log("JQuery is done!");
});

function initializeTimer(endtime) {
  const timeinterval = setInterval(function () {
    const t = getTimeRemaining(endtime);

    updateTimerPair(0, 1, t.days);
    updateTimerPair(2, 3, t.hours);
    updateTimerPair(4, 5, t.minutes);
    updateTimerPair(6, 7, t.seconds);

    if (t.total <= 0) {
      clearInterval(timeinterval);
      $("#sale").slideUp("slow");
    }
  }, 1000);
}

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (2000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}

function updateTimerPair(minor, major, value) {
  switchDigit($(".digit-wrapper").eq(minor), Math.floor(value / 10) % 10);
  switchDigit($(".digit-wrapper").eq(major), value % 10);
}

function switchDigit(wrapper, number) {
  var digit = wrapper.find(".digit");

  if (digit.is(":animated")) {
    return false;
  }

  if (wrapper.data("digit") == number) {
    return false;
  }

  wrapper.data("digit", number);

  var replacement = $("<div>", {
    class: "digit",
    css: {
      top: "-2.1em",
      opacity: 0,
    },
    html: number,
  });

  digit
    .before(replacement)
    .removeClass("static")
    .animate({ top: "2.5em", opacity: 0 }, "fast", function () {
      digit.remove();
    });

  replacement.delay(100).animate({ top: 0, opacity: 1 }, "fast", function () {
    replacement.addClass("static");
  });
}
/*=========== end action timer =============*/

/*======== contacts accord ========*/
const accordions = document.querySelectorAll(".accordion-item");

for (item of accordions) {
  item.addEventListener("click", function () {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
    } else {
      for (el of accordions) {
        el.classList.remove("active");
      }
      this.classList.add("active");
    }
  });
}

/*======== end contacts ========*/

/*========= order galere ========*/

/* on ready */
$(function () {
  $(".topmenu a").each(function () {
    if (this.href == location.href.split("#")[0]) this.className = "current";
  });

  $("#city span").html(localStorage.getItem("city") || "Москва");

  $("#city").click(function () {
    getModalWindow("citymodal");
    $(".modal").append(
      '<h1>Выберите город:</h1><input type="text" id="citysearch" placeholder="Введите часть названия города..."><div class="columns"></div>'
    );
    for (let city of citylist) {
      $(".modal .columns").append("<p>" + city + "</p>");
    }
    $(".modal p").click(function () {
      let city = $(this).html();
      $("#city span").html(city);
      localStorage.setItem("city", city);
      dropModalWindow();
    });
    $("#citysearch").on("input", function () {
      let namepart = $("#citysearch").val().toLowerCase();
      $(".modal p").each(function () {
        if (!this.innerHTML.toLowerCase().includes(namepart)) {
          this.style.display = "none";
        } else {
          this.style.display = "block";
        }
      });
    });
  });

  if ($(".action").length) {
    actiontimer();
    let timer0 = setInterval(function () {
      if (!actiontimer()) clearInterval(timer0);
    }, 1000);
  }

  $(".slider").each(function () {
    makeSlider(this.id, 4000);
  });

  if ($(".catmenu li li").length) {
    if ($(".catmenu.simple").length) {
      // если мы хотим простейший аккордеон без сложной анимации
      $(".catmenu > ul > li").click(function (e) {
        if (e.target.tagName != "A") {
          $(".open").removeClass("open"); // отнимаем класс open у ранее открытого вложенного списка
          $(this).find("ul").addClass("open"); // добавляем класс open вложенному списку в кликнутом пункте
        }
      });
    } else {
      // если мы хотим аккордеон с более красивой анимацией
      $(".catmenu li li").slideUp(1); // скрываем все пункты второго уровня
      $(".catmenu > ul > li").click(function (e) {
        // ловим клик на пункте первого уровня
        if (e.target.tagName != "A" && !$(this).find(".open").length) {
          // если клик не был по ссылке и вложенный список в этом пункте уже не раскрыт...
          let here = $(this).find("ul"); // сохраняем указатель на вложенный список в кликнутом пункте
          if (here.length) {
            // если в кликнутом пункте есть вложенный список...
            if ($(".catmenu .open").length) {
              // если был раскрытый вложенный список...
              $(".catmenu .open li").slideUp(1000, function () {
                // прячем его пункты
                $(".catmenu .open").removeClass("open"); // затем убираем с него класс open
                here.find("li").slideDown(1000, function () {
                  // затем открываем пункты списка по нашему указателю
                  here.addClass("open"); // и вешаем на него класс open
                });
              });
            } else {
              // если раскрытого вложенного списка не было...
              here.find("li").slideDown(1000, function () {
                // открываем пункты списка по нашему указателю
                here.addClass("open"); // и вешаем на него класс open
              });
            }
          } else {
            if ($(".catmenu .open").length) {
              // если был раскрытый вложенный список...
              $(".catmenu .open li").slideUp(1000, function () {
                // прячем его пункты
                $(".catmenu .open").removeClass("open"); // затем убираем с него класс open
              });
            }
          }
        }
      });
    }
  }

  // if ($('.querymenu').length) {
  // $( "#acco" ).accordion({
  // header: ".acco_h",
  // icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" }
  // });
  // $( "#toggle" ).button().on( "click", function() {
  // if ( $( "#acco" ).accordion( "option", "icons" ) ) {
  // $( "#acco" ).accordion( "option", "icons", null );
  // } else {
  // $( "#acco" ).accordion( "option", "icons", icons );
  // }
  // });
  // }

  if ($("#slider-range").length) {
    $("#slider-range").slider({
      range: true,
      min: rangemin,
      max: rangemax,
      values: [rangemin, rangemax],
      slide: function (event, ui) {
        $("#amount1").val(ui.values[0]);
        $("#amount2").val(ui.values[1]);
      },
    });
    $("#amount1").on("change", function () {
      let v1 = +$("#amount1").val();
      let v2 = +$("#amount2").val();
      if (v1 > rangemax) {
        v1 = rangemax;
      } else if (v1 < rangemin) {
        v1 = rangemin;
      }
      $("#amount1").val(v1);
      if (v1 > v2) {
        v2 = v1;
        $("#amount2").val(v2);
      }
      $("#slider-range").slider("values", [v1, v2]);
    });
    $("#amount2").on("change", function () {
      let v1 = +$("#amount1").val();
      let v2 = +$("#amount2").val();
      if (v2 > rangemax) {
        v2 = rangemax;
      } else if (v2 < rangemin) {
        v2 = rangemin;
      }
      $("#amount2").val(v2);
      if (v1 > v2) {
        v1 = v2;
        $("#amount1").val(v1);
      }
      $("#slider-range").slider("values", [v1, v2]);
    });
    $("#amount1").val(rangemin);
    $("#amount2").val(rangemax);
  }

  if ($(".images .gallery").length) {
    $(".bigimage img").click(function () {
      lightbox(this);
    });

    $(".gal_left").click(function () {
      if (!$(this).hasClass("disabled")) galSlide("right");
    });

    $(".gal_right").click(function () {
      if (!$(this).hasClass("disabled")) galSlide("left");
    });

    $(".rail img").click(function () {
      let attr = $(this).attr("src").split("mini_").join("");
      $(".bigimage img").attr("src", attr);
    });
  }

  $(".btn-buy").click(function () {
    let res = {};
    let aim = $(this).parents(".product");
    res.id = aim.data("product-id");
    res.name = aim.find("h1").html();
    /*res.price = aim.find('.price span').html().replace(/\D/g, '');*/
    res.price = aim.find(".price span").html();
    res.quantity = 1;
    res.link = location.href;
    let basket = JSON.parse(localStorage.getItem("basket"));
    /*
        вариант с флагом
        */
    if (basket) {
      let flag = false;
      for (let item of basket) {
        if (item.id == res.id) {
          item.quantity = +item.quantity + +res.quantity;
          flag = true;
          break;
        }
      }
      if (!flag) basket.push(res);
    } else {
      basket = [res];
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    /*
        вариант без флага
        
        if (!basket) basket = [];
        for (let item of basket) {
            if (item.id == res.id) {
                item.quantity = +item.quantity + +res.quantity;
                localStorage.setItem('basket', JSON.stringify(basket));
                return;
            }
        }
        basket.push(res);
        localStorage.setItem('basket', JSON.stringify(basket));
        */
  });

  if (".order") {
    let point = $(".table tbody");
    let count = 1;
    let basket = JSON.parse(localStorage.getItem("basket"));
    if (!basket) basket = [];
    basket.push(...startbasket);
    for (let item of basket) {
      let hlpstr =
        '<tr data-id="' +
        item.id +
        '"><th scope="row" class="index">' +
        count +
        '</th><td class="name"><a href="' +
        item.link +
        '">' +
        item.name +
        '</a></td><td class="qty"><span class="minus">&minus;</span><strong>' +
        item.quantity +
        '</strong><span class="plus">&plus;</span></td><td class="price">' +
        item.price +
        '</td><td class="sum"></td><td class="delete icon">&#xe906;</td></tr>';
      point.append(hlpstr);
      count++;
    }
    orderReCount();
    $(".table .plus").click(function () {
      changeOrder($(this).parents("tr"), 1);
    });
    $(".table .minus").click(function () {
      changeOrder($(this).parents("tr"), -1);
    });
    $(".table .delete").click(function () {
      $(this).parents("tr").remove();
      if ($("tbody tr").length) {
        orderReCount();
      } else {
        $(".order").addClass("empty");
      }
    });
    $(".order form .submit").click(function () {
      $(".is-invalid").removeClass("is-invalid");
      $(".invalid-feedback").remove();
      let form = document.forms[0];
      let valid = true;
      if (!form.name.value) {
        $("form #name")
          .addClass("is-invalid")
          .parents(".mb-3")
          .append(
            '<div class="invalid-feedback">Должно быть указано имя!</div>'
          );
        valid = false;
      }
      if (!form.addr.value) {
        $("form #addr")
          .addClass("is-invalid")
          .parents(".mb-3")
          .append(
            '<div class="invalid-feedback">Должен быть указан адрес!</div>'
          );
        valid = false;
      }
      if (
        !form.phone.value.match(
          /^((\+7)|(8))?\s?\(?\d{3}\)?\s?\d{3}\-?\d{2}\-?\d{2}$/
        )
      ) {
        $("form #phone")
          .addClass("is-invalid")
          .parents(".mb-3")
          .append(
            '<div class="invalid-feedback">Должен быть указан телефон!</div>'
          );
        valid = false;
      }
      if (valid) {
        let products = [];
        $(".table tbody tr").each(function () {
          let res = {
            id: this.dataset.id,
            qty: +$(this).find(".qty strong").html(),
          };
          products.push(res);
        });
        let data = {
          name: form.name.value,
          phone: form.phone.value,
          mail: form.mail.value,
          addr: form.addr.value,
          comm: form.comm.value,
          date: form.date.value,
          order: products,
        };
        fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((response) => response.json())
          .then(function (json) {
            localStorage.removeItem("basket");
            getModalWindow("order");
            $(".modal").append(
              "<p>Ваш заказ оформлен под номером " + json.id + ".</p>"
            );
            $(".order").addClass("empty");
            form.reset();
          });
      }
    });
    $(".order .input-group .icon").click(function () {
      let date = new Date();
      makeDatePicker(
        `${date.getFullYear()}-${addZero(+date.getMonth() + 1)}-${addZero(
          +date.getDate()
        )}`
      );
    });
  }

  console.log("just loaded");
});
