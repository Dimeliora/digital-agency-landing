const menu = document.querySelector('.header__menu');
const menuBtn = document.querySelector('.header__menu-button');
const menuLinks = document.querySelectorAll('.header__link');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('header__menu-button--opened');
    menu.classList.toggle('header__menu--opened');

    document.body.classList.toggle('prevent-scroll');
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('header__menu-button--opened');
        menu.classList.remove('header__menu--opened');

        document.body.classList.remove('prevent-scroll');
    });
});
