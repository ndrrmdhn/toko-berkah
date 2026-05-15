document
    .getElementById('menu-btn')
    .addEventListener('click', () => {

        document
            .getElementById('mobile-nav')
            .classList.toggle('show');

    });

document
    .getElementById('wa-btn')
    .addEventListener('click', () => {

        window.open(
            'https://wa.me/628123456789',
            '_blank'
        );

    });