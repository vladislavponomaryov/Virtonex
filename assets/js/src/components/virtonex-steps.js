const virtonexSteps = (() => {

    (function step1_location() {
        const step1TabList = getTabList('#step1TabList')

        if (step1TabList) {
            const tabLists = getTabLists(step1TabList,'.nav-link')

            setTabListsEvent(tabLists,changeLocationInputValue)
        }

        function getTabList(selector) {
            return document.querySelector(selector)
        }
        function getTabLists(tabList,selector) {
            return tabList.querySelectorAll(selector)
        }

        function setTabListsEvent(mainElement,callback) {
            mainElement.forEach(item => item.addEventListener('click',callback))
        }

        function changeLocationInputValue(event) {
            const locationInput = document.querySelector('#step1_location')
            const tabList = event.target;
            const value = tabList.getAttribute('aria-controls')

            if (locationInput && value) locationInput.value = value
        }
    })()

    (function step5_spaceStatus() {
        const spanSpaceStatus = document.querySelector('#step5_spaceStatus')
        const radioButton1 = document.querySelector('#step5_spaceStatusPrivate')
        const radioButton2 = document.querySelector('#step5_spaceStatusPublic')

        if (spanSpaceStatus && radioButton1 && radioButton2) {

            radioButton1.addEventListener('change', () => {
                setSpaceStatus('приватное')
                setSpaceStatusColor('text-marine')
            })

            radioButton2.addEventListener('change', () => {
                setSpaceStatus('публичное')
                setSpaceStatusColor('text-success')
            })

        }

        function setSpaceStatus(status) {
            spanSpaceStatus.textContent = status
        }

        function setSpaceStatusColor(clasList) {
            spanSpaceStatus.classList = clasList;
        }
    })();

})();

export default virtonexSteps;
