const virtonexSteps = (() => {

    (function spaceStatus() {
        const spanSpaceStatus = document.querySelector('#step5_spaceStatus')
        const radioButton1 = document.querySelector('#step5_spaceStatus1')
        const radioButton2 = document.querySelector('#step5_spaceStatus2')

        if (spanSpaceStatus && radioButton1 && radioButton2) {

            radioButton1.addEventListener('change', () => {
                setSpaceStatus('приватное')
            })

            radioButton2.addEventListener('change', () => {
                setSpaceStatus('публичное')
            })

        }

        function setSpaceStatus(status) {
            spanSpaceStatus.textContent = status
        }
    })();

})();

export default virtonexSteps;
