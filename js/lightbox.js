function lightbox(curimage) {
    let w, wfix, h, hfix, sides;
    let bigimage = curimage.src.split('images/').join('images/big_'); // добавляем префикс big_
    getModalWindow('lightbox');
    w = document.documentElement.clientWidth - 40; // определяем максимальную доступную ширину
    h = document.documentElement.clientHeight - 40; // определяем максимальную доступную высоту
    sides = curimage.clientWidth/curimage.clientHeight; // определяем соотношение сторон картинки
    if (w > sides * h) { // если по соотношению сторон доступная ширина больше нужной
        wfix = Math.floor(sides * h); // вычисляем нужную ширину
        hfix = h;
    } else if (w < sides * h) { // если по соотношению сторон доступная ширина меньше нужной
        wfix = w
        hfix = Math.floor(w / sides); // вычисляем нужную высоту
    }
    /* устанавливаем размеры модалке */
    document.getElementById('lightbox').style.cssText = `left: ${(w - wfix)/2 + 20}px; top: ${(h - hfix)/2 + 20}px; width: ${wfix - 80}px; height: ${hfix - 80}px;`;
    /* вставляем картинку */
    document.getElementById('lightbox').insertAdjacentHTML('beforeend', `<img src="${bigimage}">`);
    /* добавляем класс для плавного проявления */
    setTimeout(function(){
        document.getElementById('lightbox').classList.add('ready');
    });
}