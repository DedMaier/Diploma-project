/* variables */
let slider = {};
let sliderCursor = {};
let sliderFlag = {};
/* functions */
function makeSlider(slider_id, time) {
    slider[slider_id] = $('#' + slider_id); // создаем указатель на блок с нашим слайдером
    sliderCursor[slider_id] = 0; // курсор слайдера ставим на 0
    sliderFlag[slider_id] = false; // флаг блокировки вызова
    let blocks = slider[slider_id].find('.slider_block');
    /* подключаем кнопки влево и вправо */
    slider[slider_id].find('button.to_left').click(function(){
        sliderGo(slider_id, 'to_left');
    });
    slider[slider_id].find('button.to_right').click(function(){
        sliderGo(slider_id, 'to_right');
    });
    /* создаем и подключаем кнопки по номерам слайдов */
    for (let i = 0; i < blocks.length; i++) {
        slider[slider_id].find('.slider_points').append(`<span onclick="sliderGo('${slider_id}', ${i})"></span>`);
    }
    slider[slider_id].find('.slider_points span').eq(0).addClass('active'); // помечаем кнопку текущего слайда
    /* расставляем классы слайдов */
    blocks.eq(0).addClass('current');
    blocks.eq(1).addClass('next');
    blocks.eq(blocks.length - 1).addClass('prev');
    setTimeout(function hlpsld(){ // запускаем таймер для запуска слайдера 
        sliderGo(slider_id, 'to_left');
        setTimeout(hlpsld, time); // внутри таймера создаем и запускаем следующий таймер для рекурсивного запуска
    }, time);
}
function sliderGo(slider_id, align) {
    if (sliderFlag[slider_id]) return; // если слайдер действует, его нельзя запустить еще раз
    sliderFlag[slider_id] = true; // поднимаем флаг "слайдер действует"
    let blockparent = slider[slider_id].find('.slider_desk');
    let blocks = slider[slider_id].find('.slider_block');
    /*
    определяем новый current и направление движения слайдов
    */
    if (align == 'to_left') { // next станет current, current станет prev
        sliderCursor[slider_id]++;
        if (sliderCursor[slider_id] >= blocks.length) sliderCursor[slider_id] -= blocks.length;
        align = 'prev';
    } else if (align == 'to_right') { // prev станет current, current станет next
        sliderCursor[slider_id]--;
        if (sliderCursor[slider_id] < 0) sliderCursor[slider_id] += blocks.length;
        align = 'next';
    } else {
        let oldcursor = sliderCursor[slider_id]
        sliderCursor[slider_id] = align;
        if (oldcursor > align) { // новый слайд станет prev, дальше как to_right
            blockparent.find('.prev').removeClass('prev');
            blocks.eq(sliderCursor[slider_id]).addClass('prev');
            align = 'next';
        } else if (oldcursor < align) { // новый слайд станет next, дальше как to_left
            blockparent.find('.next').removeClass('next');
            blocks.eq(sliderCursor[slider_id]).addClass('next');
            align = 'prev';
        } else {
            sliderFlag[slider_id] = false;
            return;
        }
    }
    setTimeout(function(){
        slider[slider_id].find('.slider_points span').removeClass('active').eq(sliderCursor[slider_id]).addClass('active');
        blockparent.find('.current').addClass('was_current'); // помечаем старый current классом was_current
        /*
        если align == 'prev':
        next становится current, потом с него убираем класс next
        старый current становится prev, потом с него убираем класс current
        если align == 'next':
        prev становится current, потом с него убираем класс prev
        старый current становится next, потом с него убираем класс current    
        */
        blocks.eq(sliderCursor[slider_id]).addClass('current');
        blockparent.find('.was_current').addClass(align).removeClass('current');
        /*
        дожидаемся конца анимации
        */
        blocks.on('transitionend', function(){
            /*
            убираем was_current и все prev и next
            */
            blocks.removeClass('prev').removeClass('next').removeClass('was_current');
            /*
            добавляем prev и next соответственно новому current
            */
            blocks.eq((sliderCursor[slider_id] == blocks.length - 1) ? 0 : sliderCursor[slider_id] + 1).addClass('next');
            blocks.eq((sliderCursor[slider_id] == 0) ? blocks.length - 1 : sliderCursor[slider_id] - 1).addClass('prev');
            sliderFlag[slider_id] = false;
        });
    });
}