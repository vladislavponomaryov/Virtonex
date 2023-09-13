const scrollTab = (() => {

    if (document.querySelector('.virtonex-scroll-block') && document.querySelector('a[data-bs-toggle="tab"]')) {
        let tabElements = document.querySelectorAll('a[data-bs-toggle="tab"]')

        tabElements.forEach(element => {
            element.addEventListener('shown.bs.tab', function (event) {
                document.querySelector('.virtonex-scroll-block').scrollTop = 0;
            })
        })

    }

})();

export default scrollTab