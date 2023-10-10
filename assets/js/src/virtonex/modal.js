import { uploader } from './index.js'

class virtonexModal {
	getModalElement(m, selector) {
		return m._element.querySelector(selector)
	}
	setDescriptionValue(e, m) {
		const itemDescription = uploader.getElementInItem(e, '[iu-description]')
		let description = this.getModalElement(m, '[iu-modal-edit-textarea-description]')

		description.value = itemDescription ? itemDescription.value : ''
	}
	setItemDescriptionValue(e, m, selector) {
		let itemDescription = uploader.getElementInItem(e, '[iu-description]')
		const description = this.getModalElement(m, selector)
		const value = description.value

		if (value !== '') {
			!itemDescription ? this.createDescription(e, value) : (itemDescription.value = value)
			uploader.setItemsInputName(uploader.getBody(e))
		}
	}
	setIconDeleteAction(e, m) {
		this.clearAllElementActions(m, '[iu-modal-edit-icon-delete-action]')

		const iconDeleteButton = this.getModalElement(m, '[iu-modal-edit-icon-delete-action]')

		iconDeleteButton.addEventListener('click', () => {
			m.hide()
			openDeleteModal(e)
		})
	}
	setItemInputNameFile(newFileName, item) {
		const itemInputNameFile = item.querySelector('[iu-input]')

		let file4 = itemInputNameFile.files[0]

		let blob = file4.slice(0, file4.size, 'image/png')

		let file = new File([blob], newFileName, { type: 'image/jpeg', lastModified: new Date().getTime() })

		let container = new DataTransfer()
		container.items.add(file)

		itemInputNameFile.files = container.files
	}
	setInputName(e, m) {
		const inputEditName = this.getModalElement(m, '[iu-modal-edit-input-name]')

		const item = uploader.getItem(e)
		inputEditName.value = uploader.getItemName(item)
	}
	setFileName(event, modal) {
		const spanName = this.getModalElement(modal, '[iu-modal-view-span-name]')

		const item = uploader.getItem(event)
		spanName.textContent = uploader.getItemName(item)
	}
	setImage(e, m) {
		const elementImage = this.getModalElement(m, '[iu-modal-image]')

		const item = uploader.getItem(e)
		elementImage.src = uploader.getItemImage(item).src
	}
	setButtonAction(e, m, selector, action) {
		this.clearAllElementActions(m, selector)

		const button = this.getModalElement(m, selector)

		const buttonAction = () => {
			action(m, e)
			m.hide()
		}

		button.addEventListener('click', buttonAction)
	}
	createDescription(e, value) {
		const itemDescription = document.createElement('input')
		itemDescription.type = 'hidden'
		itemDescription.setAttribute('iu-description', '')
		itemDescription.value = value

		const item = uploader.getItem(e)
		const inputParent = item.querySelector('[iu-file-name]').closest('div')
		inputParent.append(itemDescription)
	}
	buttonSaveChangesAction(m, e) {
		const inputEditName = this.getModalElement(m, '[iu-modal-edit-input-name]')
		const changedFileName = inputEditName.value
		const item = uploader.getItem(e)

		uploader.setName(item, changedFileName)
		this.setItemInputNameFile(changedFileName, item)
		this.setItemDescriptionValue(e, m, '[iu-modal-edit-textarea-description]')
	}
	clearAllElementActions(m, selector) {
		const element = this.getModalElement(m, selector)

		element.replaceWith(element.cloneNode(true))
	}
	checkUploadedFile(inputFile) {
		if (!document.querySelector('#imagePreview')) {
			const imagePreview = document.createElement('img')
			imagePreview.id = 'imagePreview'
			document.body.prepend(imagePreview)
		}

		var reader = new FileReader()

		reader.onload = function (e) {
			document.querySelector('#imagePreview').setAttribute('src', e.target.result)
		}

		reader.readAsDataURL(inputFile.files[0])
	}
}

export function openEditModal(e) {
	const m = new bootstrap.Modal(document.querySelector('#modal-edit-file'))
	const vm = new virtonexModal()

	vm.setFileName(e, m)
	vm.setImage(e, m)
	vm.setInputName(e, m)
	vm.setIconDeleteAction(e, m)
	vm.setDescriptionValue(e, m)
	vm.setButtonAction(e, m, '[iu-modal-button-save-changes]', vm.buttonSaveChangesAction.bind(vm))

	m.show()
}

export function openDeleteModal(e) {
	const m = new bootstrap.Modal(document.querySelector('#modal-delete-file'))
	const vm = new virtonexModal()

	vm.setFileName(e, m)
	vm.setImage(e, m)
	vm.setButtonAction(e, m, '[iu-modal-button-delete]', (modal, event) => {
		uploader.actionDelete(event)
	})

	m.show()
}
