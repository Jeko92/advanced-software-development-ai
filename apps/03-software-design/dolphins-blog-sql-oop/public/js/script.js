window.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');
    let scrollPos = 0;
    const headerHeight = mainNav?.clientHeight ?? 0;
    window.addEventListener('scroll', () => {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (mainNav) {
            if (currentTop < scrollPos) {
                // Scrolling Up
                if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                    mainNav.classList.add('is-visible');
                }
                else {
                    mainNav.classList.remove('is-visible', 'is-fixed');
                }
            }
            else {
                // Scrolling Down
                mainNav.classList.remove('is-visible');
                if (currentTop > headerHeight &&
                    !mainNav.classList.contains('is-fixed')) {
                    mainNav.classList.add('is-fixed');
                }
            }
        }
        scrollPos = currentTop;
        if (backToTop) {
            backToTop.classList.toggle('is-visible', currentTop > 400);
        }
    });
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
export {};
