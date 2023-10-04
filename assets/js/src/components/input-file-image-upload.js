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
		iuInput.addEventListener('change', event => {
			let target = event.target || event.srcElement
			let file = target.files[0]

			setIUIcon(file, iuElement)
			if (getIUElementName(iuElement) === '') setIUName(file.name, iuElement)
			setPopover(iuElement)

			iuElement.style.display = 'flex'
		})

		iuInput.dispatchEvent(new MouseEvent('click', { bubbles: true }))
	}
}

//---------------------------------------------------------------------------

const modalEdit = new bootstrap.Modal(document.querySelector('#modal-edit-file'))

function IUOpenEditModal(event) {
	const modal = modalEdit

	setInModalFileName(event, modal)
	setInModalImage(event, modal)
	setInModalInputName(event, modal)
	setModalButtonAction(event, modal, '[iu-modal-button-save-changes]', buttonSaveChangesAction)

	modal.show()
}

//---------------------------------------------------------------------------

const modalDelete = new bootstrap.Modal(document.querySelector('#modal-delete-file'))

function IUOpenDeleteModal(event) {
	const modal = modalDelete

	setInModalFileName(event, modal)
	setInModalImage(event, modal)
	setModalButtonAction(event, modal, '[iu-modal-button-delete]', (modal, event) => {
		IUDelete(event)
	})

	modal.show()
}

//---------------------------------------------------------------------------

function buttonSaveChangesAction(modal, event) {
	const iuModalInputEditName = getModalElement(modal, '[iu-modal-edit-input-name]')
	const changedFileName = iuModalInputEditName.value
	const iuElement = getIUElementInEvent(event)

	setIUName(changedFileName, iuElement)
	setIUElementInputNameFile(changedFileName, iuElement)
}

function setIUElementInputNameFile(newFileName, iuElement) {
	const iuElementInputNameFile = iuElement.querySelector('[iu-input]')

	let file4 = iuElementInputNameFile.files[0]

	let blob = file4.slice(0, file4.size, 'image/png')

	/*Object.defineProperty(fileToAmend, 'name', {
		writable: true,
		value: newFileName,
	})*/

	let file = new File([blob], newFileName, { type: 'image/jpeg', lastModified: new Date().getTime() })

	let container = new DataTransfer()
	container.items.add(file)

	iuElementInputNameFile.files = container.files

	function checkChangeFile() {
		// add to check page <div id='imagePreview'><img alt=''></div>
		var reader = new FileReader()

		reader.onload = function (e) {
			document.querySelector('#imagePreview img').setAttribute('src', e.target.result)
		}

		reader.readAsDataURL(iuElementInputNameFile.files[0])
	}
}

function setInModalInputName(event, modal) {
	const iuModalInputEditName = getModalElement(modal, '[iu-modal-edit-input-name]')

	const iuElement = getIUElementInEvent(event)
	iuModalInputEditName.value = getIUElementName(iuElement)
}

function setInModalFileName(event, modal) {
	const iuModalSpanName = getModalElement(modal, '[iu-modal-view-span-name]')

	const uiElement = getIUElementInEvent(event)
	iuModalSpanName.textContent = getIUElementName(uiElement)
}

function setInModalImage(event, modal) {
	const iuModalElementImage = getModalElement(modal, '[iu-modal-image]')

	const uiElement = getIUElementInEvent(event)
	iuModalElementImage.src = getIUElementImage(uiElement).src
}

function getModalElement(modal, elementSelector) {
	return modal._element.querySelector(elementSelector)
}

function clearAllElementActions(modal, elementSelector) {
	const element = getModalElement(modal, elementSelector)

	element.replaceWith(element.cloneNode(true))
}

function setModalButtonAction(event, modal, buttonSelector, action) {
	clearAllElementActions(modal, buttonSelector)

	const button = getModalElement(modal, buttonSelector)

	const buttonAction = () => {
		action(modal, event)
		modal.hide()
	}

	button.addEventListener('click', buttonAction)
}

//---------------------------------------------------------------------------

function setIUElementsInputName(iuBody) {
	const iuElements = getAllIUElements(iuBody)
	const inputName = getInputName(iuBody)

	iuElements.forEach((iuElement, index) => setIUElementInputName(iuElement, inputName + (index + 1)))
}

function setIUElementInputName(iuElement, name) {
	const input = iuElement.querySelector('[iu-input]')
	input.setAttribute('name', name)
}

function getAllIUElements(iuBody) {
	return iuBody.querySelectorAll('[iu-element]')
}

function createIUElement(iuBody) {
	const inputName = getInputName(iuBody)

	const iuElement = document.createElement('div')
	iuElement.setAttribute('iu-element', '')
	iuElement.innerHTML = `<div> <img iu-image> <span iu-file-name></span> <input class="form-control size-lg" type="file" name="${inputName}" iu-input required style="display: none;"> </div><div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span onclick="IUOpenEditModal(event)"><i class="icon-edit size-sm"></i>Редактировать</span> <span onclick="IUOpenDeleteModal(event)"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`

	return iuElement
}

function getInputName(iuBody) {
	return iuBody.getAttribute('iu-input-name')
}

function getIUElementName(iuElement) {
	return iuElement.querySelector('[iu-file-name]').textContent
}

function getIUElementImage(iuElement) {
	return iuElement.querySelector('[iu-image]')
}

const setIUIcon = async (file, iuElement) => {
	const iuIcon = iuElement.querySelector('[iu-image]')

	const base64 = await convertBase64(file)
	iuIcon.src = base64
}

function setIUName(name, iuElement) {
	const iuName = iuElement.querySelector('[iu-file-name]')

	iuName.textContent = name
}

const convertBase64 = file => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.readAsDataURL(file)

		fileReader.onload = () => {
			resolve(fileReader.result)
		}

		fileReader.onerror = error => {
			reject(error)
		}
	})
}

function setPopover(iuElement) {
	const popoverAction = iuElement.querySelector('[iu-popover-action]')

	popoverAction.addEventListener('focus', event => {
		event.target.querySelector('[iu-popover]').style.display = 'flex'
	})

	popoverAction.addEventListener('blur', event => {
		event.target.querySelector('[iu-popover]').style.display = 'none'
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

	iuBody.innerHTML = ''

	IUBodyAddImageElement(iuBodyNumber)
}

function IUPopoverEdit(event) {
	const iuBodyNumber = event.target.closest('[iu-body]').getAttribute('iu-body')

	IUDelete(event)

	IUBodyAddImageElement(iuBodyNumber)
}

function IUDelete(event) {
	const iuElement = getIUElementInEvent(event)
	const iuBody = getIUInputBodyInEvent(event)

	iuElement.remove()

	setIUElementsInputName(iuBody)
}

function getIUInputBodyInEvent(event) {
	return event.target.closest('[iu-body]')
}

function getIUElementInEvent(event) {
	return event.target.closest('[iu-element]')
}
