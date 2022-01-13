import { menuElms } from './dom-elements';

const menuHandler = () => {
    menuElms.menuElm.classList.toggle('header__menu--opened');
    menuElms.menuButtonElm.classList.toggle('header__menu-button--opened');

    document.body.classList.toggle('prevent-scroll');
};

const menuLinkClickHandler = (e) => {
    const link = e.target.closest('[data-menu-link]');
    if (link) {
        menuElms.menuElm.classList.remove('header__menu--opened');
        menuElms.menuButtonElm.classList.remove('header__menu-button--opened');

        document.body.classList.remove('prevent-scroll');
    }
};

menuElms.menuButtonElm.addEventListener('click', menuHandler);

menuElms.menuElm.addEventListener('click', menuLinkClickHandler);
