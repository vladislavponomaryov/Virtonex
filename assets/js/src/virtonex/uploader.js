import virtonexAlert from './alert.js'
import { openEditModal, openDeleteModal } from './modal.js'

export class Uploader {
	constructor() {
		this.setInputsAction('[iu-target-action="edit"]', e => this.actionEdit(e))
		this.setInputsAction('[iu-target-action="multiple"]', e => this.addItem(e))
	}
	getItems(body) {
		return body.querySelectorAll('[iu-item]')
	}
	getAcceptFormat(body) {
		return body.hasAttribute('accept') ? body.getAttribute('accept') : 'image/jpeg,image/png'
	}
	getInputName(body) {
		return body.getAttribute('iu-input-name')
	}
	getItemName(item) {
		return item.querySelector('[iu-file-name]').textContent
	}
	getItemImage(item) {
		return item.querySelector('[iu-image]')
	}
	getBody(e) {
		return e.target.closest('[iu-body]')
	}
	getItem(e) {
		return e.target.closest('[iu-item]')
	}
	getElementInItem(e, selector) {
		const item = this.getItem(e)

		return item.querySelector(selector)
	}
	setItemInputName(item, name, selector) {
		const inputFile = item.querySelector(selector)

		if (inputFile) inputFile.setAttribute('name', name)
	}
	setItemActions(item) {
		const inputEditModal = item.querySelector('[iu-target-action="openEditModal"]')
		const inputDeleteModal = item.querySelector('[iu-target-action="openDeleteModal"]')

		inputEditModal.addEventListener('click', event => openEditModal(event))
		inputDeleteModal.addEventListener('click', event => openDeleteModal(event))
	}
	setFileInInput(item) {
		const input = item.querySelector('[iu-input]')

		// change set file logic
		input.addEventListener('change', event => {
			let target = event.target || event.srcElement
			let file = target.files[0]

			const validFileSizeResponse = this.validFileSize(file)

			if (!validFileSizeResponse.valid) {
				const alert = new virtonexAlert('alert-warning', validFileSizeResponse.message)
				alert.show()
				return
			}

			this.setIcon(item, file)
			if (this.getItemName(item) === '') this.setName(item, file.name)
			this.setPopover(item)

			item.classList = 'd-flex'
		})

		input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
	}
	setPopover(item) {
		const popoverAction = item.querySelector('[iu-popover-action]')

		popoverAction.addEventListener('focus', e => {
			e.target.querySelector('[iu-popover]').style.display = 'flex'
		})

		popoverAction.addEventListener('blur', e => {
			e.target.querySelector('[iu-popover]').style.display = 'none'
		})
	}
	setName(item, name) {
		const iuName = item.querySelector('[iu-file-name]')

		iuName.textContent = name
	}
	setImageSvgIcon(item, classname) {
		const icon = item.querySelector('[iu-image]')

		const newIconElement = document.createElement('i')
		newIconElement.setAttribute('iu-image', '')
		newIconElement.classList = classname
		icon.closest('div').prepend(newIconElement)

		icon.remove()
	}
	async setIcon(item, file) {
		const icon = item.querySelector('[iu-image]')
		const type = file.type

		if (type === 'image/jpeg' || type === 'image/png') {
			const base64 = await this.convertBase64(file)
			icon.src = base64
		}

		if (type === 'video/mp4') {
			icon.classList = 'icon'
			icon.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAOhJREFUSEvtluENgjAUhO9tIpu4iTqJOolsYpxENjlzDW0KUVLT0vKD/iTwvt7r9R6GRssacbGDq3V+O60m+QBwyJD+AtCb2bBUY6KYJDOA80+7JXgAk7wBuBYEX8ys/1VvTfDdzCTGLZJnHaF/VgU8+kbgsJnVwSSfAI6j8Cpgna9uh4eKXQX8zVc72Nm99D1u1mqZS8aK47fKGTtIi+sU1DUJkCgy5aHB53ecXIo0jcRSa5LVY14rq924nI/Fd+Ys9puWsu6feSwXnjLhUiS16T8CpXqcUmc7/1wpuy3xzq64RBeTanwA9ZV/HyOBgXkAAAAASUVORK5CYII=\n'
			//setImageSvgIcon(item, 'bx bx-video')
			return
		}

		if (type === 'audio/mp3' || type === 'audio/mpeg') {
			icon.classList = 'icon'
			icon.src =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAXFJREFUSEvtlt1xAjEQg7WdQCVJKkmoBKgkUAmkktCJGDHeGZ/jv7tzwkv8COP7tGtpbcOTlj2Ji24wyQ2AVwBXM7utFTwH/A1AcC2Bj2Z2WipgDpgZiARcAXzNFbEE7G326l2PizibmcRU1xKwWnwgqfN+B/BR6MQZwKnkh8Vgh0WmkwiJSVfWD6vBMaUh4i0+gqHgjAgdwz78/jdgwYIPLv9gdSB7xqFFcuiLhkMYEt6yR5xaOZ3dapIC5GLhrPFgkp+FgRAX+Cvg3DxOuzoWTFKZU8WtNRwsw3jYa/Bd6SYi6aaTKTWrdZHUB0gS9hp4mw7+MCrVrZop85Orc/PNzLapqo4kaEt5ZAa4XhqlNdkcstrrjfqsLlSuq00bf7y1OiNYrzhzu6D1sOtssz498Ub3tVjqfXByMw1mNmGNACsyNV9Is55Au1j8anCHwbJJGAKObiK13LP8eHWmlXrVw8D+wZCKTeuJOxzcGvT+/x1qUOwfP4v6bgAAAABJRU5ErkJggg==\n'
			//setImageSvgIcon(item, 'bx bx-music')
			return
		}
	}
	setInputsAction(selector, action) {
		const inputs = document.querySelectorAll(selector)
		inputs.forEach(input => input.addEventListener('click', e => action(e)))
	}
	setItemsInputName(body) {
		const items = this.getItems(body)
		const inputName = this.getInputName(body)

		items.forEach((item, index) => {
			this.setItemInputName(item, inputName + (index + 1), '[iu-input]')
			this.setItemInputName(item, inputName + (index + 1) + '_description', '[iu-description]')
		})
	}
	actionEdit(e) {
		const bodyNumber = e.target.getAttribute('iu-target-body')

		const body = document.querySelector(`[iu-body='${bodyNumber}']`)

		body.innerHTML = ''

		this.addImageItem(bodyNumber)
	}
	actionDelete(e) {
		const item = this.getItem(e)
		const body = this.getBody(e)

		item.remove()

		this.setItemsInputName(body)
	}
	actionPopoverEdit(e) {
		const bodyNumber = e.target.closest('[iu-body]').getAttribute('iu-body')

		this.actionDelete(e)

		this.addImageItem(bodyNumber)
	}
	addImageItem(bodyNumber) {
		const body = document.querySelector(`[iu-body='${bodyNumber}']`)

		const item = this.createItem(body)

		this.setFileInInput(item)

		body.append(item)

		this.setItemActions(item)
		this.setItemsInputName(body)
	}
	addItem(e) {
		const bodyNumber = e.target.getAttribute('iu-target-body')

		const body = document.querySelector(`[iu-body='${bodyNumber}']`)

		this.addImageItem(bodyNumber)
	}
	createItem(body) {
		const inputName = this.getInputName(body)
		const acceptFormat = this.getAcceptFormat(body)
		const required = this.hasBodyRequired(body) ? 'required' : ''

		const item = document.createElement('div')
		item.setAttribute('iu-item', '')
		item.innerHTML = `<div class='d-flex align-items-center'> <img iu-image> <span iu-file-name></span> <input type="file" name="${inputName}" iu-input style="display: none;" accept='${acceptFormat}' ${required}> </div><div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span iu-target-action='openEditModal'><i class="icon-edit size-sm"></i>Редактировать</span> <span iu-target-action='openDeleteModal'"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`

		return item
	}
	hasBodyRequired(body) {
		return body.hasAttribute('required')
	}
	validFileSize(file) {
		const type = file.type
		const fileSize = file.size

		const message1 = 'У загруженного файла не верный формат'
		const message2 = 'Размер файла превышает допустимый'

		if (type === 'image/jpeg' || type === 'image/png') return this.checkFileSize(fileSize, 10485760, message2)

		if (type === 'video/mp4') return this.checkFileSize(fileSize, 31457280, message2)

		if (type === 'audio/mp3' || type === 'audio/mpeg') return this.checkFileSize(fileSize, 20971520, message2)

		return { valid: false, message: message1 }
	}
	checkFileSize(fileSize, sizeLimit, message2) {
		if (fileSize < sizeLimit) {
			return { valid: true }
		} else {
			return { valid: false, message: message2 }
		}
	}
	convertBase64(file) {
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
}
