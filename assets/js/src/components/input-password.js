const inputPasswordCustom = (() => {

    const inputsPassword = getInputsPassword()

    inputsPassword.forEach(inputPassword => {
        const inputBody = getInputBody(inputPassword)
        const buttonToggle = getButtonToggle(inputBody)

        buttonToggle.addEventListener('click',() => {

            if (inputPassword.type == 'password') {
                inputPassword.type = 'text'
            } else {
                inputPassword.type = 'password'
            }
        })

        setButtonToggleEvent(buttonToggle,inputPassword)
    })

    function getInputsPassword() {
        return document.querySelectorAll('#virtonex [type="password"]')
    }

    function getInputBody(input) {
        return input.closest('div.input-group.form-floating')
    }

    function getButtonToggle(inputBody) {
        return inputBody.querySelector('span .password-toggle-indicator')
    }

    function setButtonToggleEvent(buttonToggle,inputPassword) {

    }

})();

export default inputPasswordCustom;
