// TODO: max 5 elements count
// TODO: format JPG, PNG, max size 10 mb
// TODO: format mp4, max size 30 mb

function IUBodyAddImageElement(iuBodyNumber) {
	const iuBody = document.querySelector(`[iu-body='${iuBodyNumber}']`)

	const iuElement = createIUElement(iuBody)

	setFileInInput(iuElement)

	iuBody.append(iuElement)

	setIUElementsInputName(iuBody)
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

const modalEdit = new bootstrap.Modal(document.querySelector('#modal-edit-file'))

function IUOpenEditModal(event) {
	const modal = modalEdit

	setInModalFileName(event, modal)
	setInModalImage(event, modal)
	setInModalInputName(event, modal)
	setInModalIconDeleteAction(event, modal)
	setInModalDescriptionFieldValue(event, modal)
	setModalButtonAction(event, modal, '[iu-modal-button-save-changes]', buttonSaveChangesAction)

	modal.show()
}

//---------------------------------------------------------------------------

function setInModalDescriptionFieldValue(event, modal) {
	let iuModalDescriptionField = getModalElement(modal, '[iu-modal-edit-textarea-description]')

	let iuDescriptionField = getIUInItemElementEvent(event, '[iu-description]')

	if (iuDescriptionField) {
		iuModalDescriptionField.value = iuDescriptionField.value
	} else {
		iuModalDescriptionField.value = ''
	}

	console.log(iuModalDescriptionField, iuDescriptionField)
}

function setInIUDescriptionFieldData(event, modal, selector) {
	const iuModalFieldDescription = getModalElement(modal, selector)
	const iuModalFieldDescriptionData = iuModalFieldDescription.value

	if (iuModalFieldDescriptionData !== '') {
		let iuDescriptionField = getIUInItemElementEvent(event, '[iu-description]')

		if (!iuDescriptionField) {
			iuDescriptionCreateField()
		} else {
			iuDescriptionField.value = iuModalFieldDescriptionData
		}

		setIUElementsInputName(getIUBodyInEvent(event))
	}

	function iuDescriptionCreateField() {
		iuDescriptionField = document.createElement('input')
		iuDescriptionField.type = 'hidden'
		iuDescriptionField.setAttribute('iu-description', '')
		iuDescriptionField.value = iuModalFieldDescriptionData

		const iuElement = getIUElementInEvent(event)
		const iuInputParent = iuElement.querySelector('[iu-file-name]').closest('div')
		iuInputParent.append(iuDescriptionField)
	}
}

function setInModalIconDeleteAction(event, modal) {
	clearAllElementActions(modal, '[iu-modal-edit-icon-delete-action]')

	const iuModalIconDeleteButton = getModalElement(modal, '[iu-modal-edit-icon-delete-action]')

	iuModalIconDeleteButton.addEventListener('click', () => {
		modal.hide()
		IUOpenDeleteModal(event)
	})
}

function buttonSaveChangesAction(modal, event) {
	const iuModalInputEditName = getModalElement(modal, '[iu-modal-edit-input-name]')
	const changedFileName = iuModalInputEditName.value
	const iuElement = getIUElementInEvent(event)

	setIUName(changedFileName, iuElement)
	setIUElementInputNameFile(changedFileName, iuElement)
	setInIUDescriptionFieldData(event, modal, '[iu-modal-edit-textarea-description]')
}

function setIUElementInputNameFile(newFileName, iuElement) {
	const iuElementInputNameFile = iuElement.querySelector('[iu-input]')

	let file4 = iuElementInputNameFile.files[0]

	let blob = file4.slice(0, file4.size, 'image/png')

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

function setIUElementsInputName(iuBody) {
	const iuElements = getAllIUElements(iuBody)
	const inputName = getInputName(iuBody)

	iuElements.forEach((iuElement, index) => {
		setIUElementInputName(iuElement, inputName + (index + 1), '[iu-input]')
		setIUElementInputName(iuElement, inputName + (index + 1) + '_description', '[iu-description]')
	})
}

function setIUElementInputName(iuElement, name, selector) {
	const inputFile = iuElement.querySelector(selector)

	if (inputFile) inputFile.setAttribute('name', name)
}

function getAllIUElements(iuBody) {
	return iuBody.querySelectorAll('[iu-element]')
}

function createIUElement(iuBody) {
	const inputName = getInputName(iuBody)

	const iuElement = document.createElement('div')
	iuElement.setAttribute('iu-element', '')
	iuElement.innerHTML = `<div> <img iu-image> <span iu-file-name></span> <input type="file" name="${inputName}" iu-input required style="display: none;"> </div><div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span onclick="IUOpenEditModal(event)"><i class="icon-edit size-sm"></i>Редактировать</span> <span onclick="IUOpenDeleteModal(event)"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`

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
	const iuBody = getIUBodyInEvent(event)

	iuElement.remove()

	setIUElementsInputName(iuBody)
}

function getIUBodyInEvent(event) {
	return event.target.closest('[iu-body]')
}

function getIUElementInEvent(event) {
	return event.target.closest('[iu-element]')
}

function getIUInItemElementEvent(event, selector) {
	const iuItem = getIUElementInEvent(event)

	return iuItem.querySelector(selector)
}
