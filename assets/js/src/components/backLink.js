const backLink = (() => {
    const backLink = document.querySelector('#backLink')

    if (backLink) {
        backLink.addEventListener('click', event => {
            history.back();
        })
    }
})();

export default backLink;
