/* variables */
let galFlag = false;
/* functions */
function galSlide(direction) {
    if (galFlag) return; // если флаг поднят, функция не должна вызываться - она уже работает
    galFlag = true; // поднимаем блокирующий флаг
    /* измеряем текущее положение рельса, ширину его и окна, размер шага (ширину мелкой картинки + промежуток между картинками) */
    let pos = parseInt($('.rail').css('left'));
    let width = parseInt($('.rail').css('width'));
    let windowwidth = parseInt($('.gallery > div').css('width'));
    let step = parseInt($('.rail img').css('width')) + parseInt($('.rail').css('gap'));
    let move = '';
    if (direction == 'left') { // если двигаемся влево
        if (windowwidth >= width + pos) { // правый край рельса не может быть левее правого края окна
            galFlag = false;
            return;
        }
        move += '-=' + step; // составляем команду для сдвига
    } else { // если двигаемся вправо
        if (pos >= 0) { // левый край рельса не может быть правее левого края окна
            galFlag = false;
            return;
        }
        move += '+=' + step; // составляем команду для сдвига
    }
    $('.gallery .disabled').removeClass('disabled'); // отключенная кнопка после сдвига обязательно станет работающей
    /* анимируем сдвиг */
    $('.rail').animate({left: move}, 1000, function() {
        if (parseInt($('.rail').css('left')) >= 0) { // если ушли до упора вправо, отключаем левую кнопку
            $('.gallery .gal_left').addClass('disabled');
        } else if (windowwidth >= width + parseInt($('.rail').css('left'))) { // если ушли до упора влево, отключаем правую кнопку
            $('.gallery .gal_right').addClass('disabled');
        }
        galFlag = false; // спускаем блокирующий флаг
    });
}