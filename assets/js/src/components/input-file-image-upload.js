// TODO: max 5 elements count
// TODO: format JPG, PNG, max size 10 mb
// TODO: format mp4, max size 30 mb

function IUBodyAddImageElement(iuBodyNumber) {
    const iuBody = document.querySelector(`[iu-body='${iuBodyNumber}']`)

    const iuElement = createIUElement(iuBody)

    setFileInInput(iuElement)

    iuBody.append(iuElement)

    setIUElementsInputName(iuBody)

    function setFileInInput(iuElement) {
        const iuInput = iuElement.querySelector('[iu-input]')

        // change set file logic
        iuInput.addEventListener('change', (event) => {
            let target = event.target || event.srcElement;
            let file = target.files[0];

            // TODO: need to be processed cancel event on input

            setIUIcon(file, iuElement);
            setIUName(file.name, iuElement);
            setPopover(iuElement);

            iuElement.style.display = 'flex'
        })

        iuInput.dispatchEvent(
            new MouseEvent('click', {bubbles: true})
        )

    }
}

function setIUElementsInputName(iuBody) {
    const iuElements = getAllIUElements(iuBody)
    const inputName = getInputName(iuBody)

    iuElements.forEach((iuElement,index) => setIUElementInputName(iuElement,inputName + (index + 1)))
}

function setIUElementInputName(iuElement,name) {
    const input = iuElement.querySelector('[iu-input]')
    input.setAttribute('name',name)
}

function getAllIUElements(iuBody) {
    return iuBody.querySelectorAll('[iu-element]')
}

function createIUElement(iuBody) {
    const inputName = getInputName(iuBody)

    const iuElement = document.createElement('div')
    iuElement.setAttribute('iu-element', '')
    iuElement.innerHTML = `<div> <img iu-image> <span iu-file-name></span> <input class="form-control size-lg" type="file" name="${inputName}" iu-input required style="display: none;"> </div><div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span onclick="IUPopoverEdit(event)"><i class="icon-edit size-sm"></i>Редактировать</span> <span onclick="IUDelete(event)"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`;

    return iuElement
}

function getInputName(iuBody) {
    return iuBody.getAttribute('iu-input-name')
}

const setIUIcon = async (file, iuElement) => {
    const iuIcon = iuElement.querySelector('[iu-image]')

    const base64 = await convertBase64(file);
    iuIcon.src = base64;
};

function setIUName(name, iuElement) {
    const iuName = iuElement.querySelector('[iu-file-name]')

    if (iuName.textContent === '') iuName.textContent = name;
}

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

function setPopover(iuElement) {
    const popoverAction = iuElement.querySelector('[iu-popover-action]')

    popoverAction.addEventListener('focus', (event) => {
        event.target.querySelector('[iu-popover]').style.display = 'flex';
    })

    popoverAction.addEventListener('blur', (event) => {
        event.target.querySelector('[iu-popover]').style.display = 'none';
    })

}

function IUAddElement(event) {
    const iuBodyNumber = event.target.getAttribute('iu-target-body')

    const iuBody = document.querySelector(`[iu-body='${iuBodyNumber}']`)

    IUBodyAddImageElement(iuBodyNumber)
}

function IUEdit(event) {
    const iuBodyNumber = event.target.getAttribute('iu-target-body')

    const iuBody = document.querySelector(`[iu-body='${iuBodyNumber}']`)

    iuBody.innerHTML = '';

    IUBodyAddImageElement(iuBodyNumber)
}

function IUPopoverEdit(event) {
    const iuBodyNumber = event.target.closest('[iu-body]').getAttribute('iu-body')

    IUDelete(event)

    IUBodyAddImageElement(iuBodyNumber)
}

function IUDelete(event) {
    const iuElement = event.target.closest('[iu-element]')
    const iuBody = iuElement.closest('[iu-body]')

    iuElement.remove()

    setIUElementsInputName(iuBody)
}
