const virtonexUploader = (() => {
	class Uploader {
		initBasicUploaders() {
			this.setInputsAction('[iu-target-action="edit"]', e => this.actionEdit(e))
			this.setInputsAction('[iu-target-action="multiple"]', e => this.actionMultiple(e))
		}
		initRequired() {
			const requiredBody = document.querySelectorAll('[iu-body][required]')

			requiredBody.forEach(body => this.createRequired(body))
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
		getBodyNumber(e) {
			const target = e.target
			let bodyNumber = target.getAttribute('iu-target-body')

			if (bodyNumber === null) {
				bodyNumber = target.closest('[iu-target-body]').getAttribute('iu-target-body')
			}

			return bodyNumber
		}
		setItemInputName(item, name, selector) {
			const inputFile = item.querySelector(selector)

			if (inputFile) inputFile.setAttribute('name', name)
		}
		setItemActions(item) {
			const inputEditModal = item.querySelector('[iu-target-action="openEditModal"]')
			const inputDeleteModal = item.querySelector('[iu-target-action="openDeleteModal"]')

			inputEditModal.addEventListener('click', event => mainEditModal.show(event))
			inputDeleteModal.addEventListener('click', event => mainDeleteModal.show(event))
		}
		setFileInInput(item) {
			const input = item.querySelector('[iu-input]')

			// change set file logic
			input.addEventListener('change', event => {
				let target = event.target || event.srcElement
				let file = target.files[0]

				const validFileSizeResponse = this.validFileSize(file)

				if (!validFileSizeResponse.valid) {
					const alert = new VirtonexAlert('alert-warning', validFileSizeResponse.message)
					input.value = ''
					alert.show()
					return
				}

				if (target.hasAttribute('iu-preview')) this.setFileInPreview(file)

				this.setIcon(item, file)
				if (this.getItemName(item) === '') this.setName(item, file.name)
				this.setPopover(item)

				item.classList = 'd-flex'
			})

			input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		}
		setPopover(item) {
			const popoverAction = item.querySelector('[iu-popover-action]')

			if (popoverAction) {
				popoverAction.addEventListener('focus', e => {
					e.target.querySelector('[iu-popover]').style.display = 'flex'
				})

				popoverAction.addEventListener('blur', e => {
					e.target.querySelector('[iu-popover]').style.display = 'none'
				})
			}
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

			console.log(type)

			if (icon && type) {
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
		setFileInPreview(file, selector) {
			const reader = new FileReader()

			reader.onload = function (e) {
				document
					.querySelector('[iu-input-name="step2_event-preview"]')
					.setAttribute('style', `background-image:url("${e.target.result}")`)
			}

			reader.readAsDataURL(file)
		}
		actionEdit(e) {
			const bodyNumber = this.getBodyNumber(e)

			const body = document.querySelector(`[iu-body='${bodyNumber}']`)
			body.innerHTML = ''

			this.addImageItem(bodyNumber)
		}
		actionDelete(e) {
			const item = this.getItem(e)
			const body = this.getBody(e)

			item.remove()

			this.createRequired(body)
			this.setItemsInputName(body)
		}
		actionPopoverEdit(e) {
			const bodyNumber = e.target.closest('[iu-body]').getAttribute('iu-body')

			this.actionDelete(e)

			this.addImageItem(bodyNumber)
		}
		addImageItem(bodyNumber) {
			const body = document.querySelector(`[iu-body='${bodyNumber}']`)

			this.removeRequired(body)
			const item = this.createItem(body)

			this.setFileInInput(item)

			body.append(item)

			this.setItemActions(item)
			this.setItemsInputName(body)
		}
		actionMultiple(e) {
			const bodyNumber = this.getBodyNumber(e)

			this.addImageItem(bodyNumber)
		}
		createItem(body) {
			const inputName = this.getInputName(body)
			const acceptFormat = this.getAcceptFormat(body)
			const required = this.hasBodyRequired(body) ? 'required' : ''

			const item = document.createElement('div')
			item.setAttribute('iu-item', '')
			item.innerHTML = `<div class='d-flex align-items-center'> <img iu-image> <span iu-file-name></span> <input class='form-control' type="file" name="${inputName}" iu-input style="display: none;" accept='${acceptFormat}' ${required}> </div><div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span iu-target-action='openEditModal'><i class="icon-edit size-sm"></i>Редактировать</span> <span iu-target-action='openDeleteModal'"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`

			return item
		}
		createRequired(body) {
			if (!body.querySelector('[iu-required]')) {
				const item = this.createItem(body)

				item.setAttribute('iu-required', '')
				item.style.display = 'none'

				body.append(item)
			}
		}
		hasBodyRequired(body) {
			return body.hasAttribute('required')
		}
		removeRequired(body) {
			const required = body.querySelector('[iu-required]')

			if (required) {
				required.remove()
			}
			body.classList.remove('invalid')
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

	class VirtonexAlert {
		constructor(additionalClass, message) {
			this.additionalClass = additionalClass
			this.message = message
			this.alertsBlock = this.getAlertsBlock()

			this.alert = this.create()
		}
		getAlertsBlock() {
			let alertsBlock = document.querySelector('.alerts')

			if (!alertsBlock) {
				alertsBlock = this.initAlertsBlock(alertsBlock)
			}

			return alertsBlock
		}
		initAlertsBlock(alertsBlock) {
			alertsBlock = document.createElement('div')
			alertsBlock.classList = 'alerts'

			document.body.append(alertsBlock)

			return alertsBlock
		}
		create() {
			const alert = document.createElement('div')
			alert.classList = `alert ${this.additionalClass}`

			const closeButton = this.getCloseButton()

			alert.innerHTML = `<div>${this.message}</div>${closeButton}`

			return alert
		}
		show() {
			this.alertsBlock.append(this.alert)

			new bootstrap.Alert(this.alert)
		}
		getCloseButton() {
			return '<button type="button" class="icon-close-cross text-black icon-size-md" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'
		}
	}

	class UploaderPreview extends Uploader {
		constructor(bodyNumber, imageSrc) {
			super()
			this.setInputsAction('[iu-target-action="editEventPreview"]', e => this.actionEditEventPreview(e))
			this.loadDefaultImage(bodyNumber, imageSrc)
		}
		loadDefaultImage(bodyNumber, imageSrc) {
			const body = document.querySelector(`[iu-body="${bodyNumber}"]`)
			const item = this.createEventPreviewItem(body)
			this.handleResumeInput(imageSrc, item)

			body.append(item)
		}
		actionEditEventPreview(e) {
			const bodyNumber = this.getBodyNumber(e)

			const body = document.querySelector(`[iu-body='${bodyNumber}']`)

			const item = this.createEventPreviewItem(body)

			this.setFileInInput(item)

			body.append(item)
		}
		createEventPreviewItem(body) {
			this.removeAllItems(body)

			const acceptFormat = this.getAcceptFormat(body)

			const inputName = this.getInputName(body)
			const item = document.createElement('div')
			item.setAttribute('iu-item', '')
			item.innerHTML = `<input class='form-control' type="file" name="${inputName}" iu-input style="display: none;" accept='${acceptFormat}' iu-preview>`

			return item
		}
		async handleResumeInput(remoteResumeURL, item) {
			const designFile = await this.createFile(remoteResumeURL)
			const input = item.querySelector('[iu-input]')
			const dt = new DataTransfer()
			dt.items.add(designFile)
			input.files = dt.files
			const event = new Event('change', {
				bubbles: !0,
			})
			input.dispatchEvent(event)
		}
		async createFile(url) {
			let response = await fetch(url)
			let data = await response.blob()
			let metadata = {
				type: 'image/webp',
			}
			return new File([data], '4.webp', metadata)
		}
		removeAllItems(body) {
			const items = this.getItems(body)

			items.forEach(item => item.remove())
		}
	}

	class VirtonexModal {
		constructor(uploader) {
			this.uploader = new Uploader()
		}
		getModalElement(m, selector) {
			return m._element.querySelector(selector)
		}
		setDescriptionValue(e, m) {
			const itemDescription = this.uploader.getElementInItem(e, '[iu-description]')
			let description = this.getModalElement(m, '[iu-modal-edit-textarea-description]')

			description.value = itemDescription ? itemDescription.value : ''
		}
		setItemDescriptionValue(e, m, selector) {
			let itemDescription = this.uploader.getElementInItem(e, '[iu-description]')
			const description = this.getModalElement(m, selector)
			const value = description.value

			if (value !== '') {
				!itemDescription ? this.createDescription(e, value) : (itemDescription.value = value)
				this.uploader.setItemsInputName(this.uploader.getBody(e))
			}
		}
		setIconDeleteAction(e, m) {
			this.clearAllElementActions(m, '[iu-modal-edit-icon-delete-action]')

			const iconDeleteButton = this.getModalElement(m, '[iu-modal-edit-icon-delete-action]')

			iconDeleteButton.addEventListener('click', () => {
				m.hide()
				mainDeleteModal.show(e)
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

			if (itemInputNameFile.webkitEntries.length) {
				itemInputNameFile.dataset.file = `${container.files[0].name}`
			}
		}
		setInputName(e, m) {
			const inputEditName = this.getModalElement(m, '[iu-modal-edit-input-name]')

			const item = this.uploader.getItem(e)
			inputEditName.value = this.uploader.getItemName(item)
		}
		setFileName(event, modal) {
			const spanName = this.getModalElement(modal, '[iu-modal-view-span-name]')

			const item = this.uploader.getItem(event)
			spanName.textContent = this.uploader.getItemName(item)
		}
		setImage(e, m) {
			const elementImage = this.getModalElement(m, '[iu-modal-image]')

			const item = this.uploader.getItem(e)
			elementImage.src = this.uploader.getItemImage(item).src
		}
		setButtonAction(e, m, selector, action) {
			this.clearAllElementActions(m, selector)

			const button = this.getModalElement(m, selector)

			const buttonAction = () => {
				action(m, e)
			}

			button.addEventListener('click', buttonAction)
		}
		createDescription(e, value) {
			const itemDescription = document.createElement('input')
			itemDescription.type = 'hidden'
			itemDescription.setAttribute('iu-description', '')
			itemDescription.value = value

			const item = this.uploader.getItem(e)
			const inputParent = item.querySelector('[iu-file-name]').closest('div')
			inputParent.append(itemDescription)
		}
		buttonSaveChangesAction(m, e) {
			const inputEditName = this.getModalElement(m, '[iu-modal-edit-input-name]')
			const changedFileName = inputEditName.value
			const item = this.uploader.getItem(e)

			this.uploader.setName(item, changedFileName)
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

	class EditModal extends VirtonexModal {
		constructor(selector) {
			super()
			this.m = new bootstrap.Modal(document.querySelector(selector))
		}
		show(e) {
			this.setFileName(e, this.m)
			this.setImage(e, this.m)
			this.setInputName(e, this.m)
			this.setIconDeleteAction(e, this.m)
			this.setDescriptionValue(e, this.m)
			this.setButtonAction(e, this.m, '[iu-modal-button-save-changes]', this.buttonSaveChangesAction.bind(this))

			this.m.show()
		}
	}

	class DeleteModal extends VirtonexModal {
		constructor(selector) {
			super()
			this.m = new bootstrap.Modal(document.querySelector(selector))
		}
		show(e) {
			this.setFileName(e, this.m)
			this.setImage(e, this.m)
			this.setButtonAction(e, this.m, '[iu-modal-button-delete]', (modal, event) => {
				this.uploader.actionDelete(event)
			})

			this.m.show()
		}
	}

	class PartnersUploader extends Uploader {
		constructor() {
			super()
			this.setInputsAction('[iu-target-action="partners"]', e => this.actionPartners(e))
		}
		actionPartners(e) {
			const bodyNumber = this.getBodyNumber(e)

			this.addImageItem(bodyNumber)
		}
		addImageItem(bodyNumber) {
			const body = document.querySelector(`[iu-body='${bodyNumber}']`)

			const item = this.createItem(body)

			body.append(item)

			this.setPopover(item)
			this.setItemActions(item)
			this.setItemsInputName(body)
		}
		setItemsInputName(body) {
			const items = this.getItems(body)
			const inputName = this.getInputName(body)

			items.forEach((item, index) => {
				this.setItemInputName(item, inputName + (index + 1) + '_image', '[iu-input-image]')
				this.setItemInputName(item, inputName + (index + 1) + '_name', '[iu-input-name]')
				this.setItemInputName(item, inputName + (index + 1) + '_link', '[iu-input-link]')
			})
		}
		createItem(body) {
			const inputName = this.getInputName(body)
			const acceptFormat = this.getAcceptFormat(body)
			const mainBlock = `<div class='d-flex align-items-center'>
<img iu-image>
<span iu-name></span>
<input class='form-control' type="file" name="${inputName}_image" iu-input-image style="display: none;" accept='${acceptFormat}'>
<input class='form-control' type="hidden" name="${inputName}_name" iu-input-name>
<input class='form-control' type="hidden" name="${inputName}_link" iu-input-link>
</div>`
			const popoverBlock = `<div class="icon-points" iu-popover-action tabindex="0"> <div iu-popover> <span iu-target-action='editPartnerModal'><i class="icon-edit size-sm"></i>Редактировать</span> <span iu-target-action='deletePartnerModal'"><i class="icon-delete size-sm"></i>Удалить</span> </div></div>`

			const item = document.createElement('div')
			item.classList = 'd-flex'
			item.setAttribute('iu-item', '')
			item.innerHTML = mainBlock + popoverBlock

			return item
		}
		setItemActions(item) {
			const inputEditPartnerModal = item.querySelector('[iu-target-action="editPartnerModal"]')
			const inputDeletePartnerModal = item.querySelector('[iu-target-action="deletePartnerModal"]')

			inputEditPartnerModal.addEventListener('click', event => mainPartnersModal.show(event))
			inputDeletePartnerModal.addEventListener('click', item => this.actionDelete(item))

			inputEditPartnerModal.click()
		}
		getPartnerInputName(item) {
			return item.querySelector('[iu-input-name]').value
		}
		getPartnerInputLink(item) {
			return item.querySelector('[iu-input-link]').value
		}
		getPartnerInputImageName(item) {
			const partnerInputImage = item.querySelector('[iu-input-image]')
			const file = partnerInputImage.files[0]

			if (file) return file.name
			return null
		}
		setPartnerInputName(item, name) {
			const iuPartnerInputName = item.querySelector('[iu-input-name]')
			const iuPartnerName = item.querySelector('[iu-name]')

			iuPartnerInputName.value = name
			iuPartnerName.textContent = name
		}
		setPartnerInputLink(item, name) {
			const iuPartnerInputLink = item.querySelector('[iu-input-link]')

			iuPartnerInputLink.value = name
		}
		setPartnerImage(item, src) {
			const iuPartnerImage = item.querySelector('[iu-image]')

			if (src !== null) {
				iuPartnerImage.src = src
			} else {
				iuPartnerImage.removeAttribute('src')
			}
		}
		setPartnerInputImage(item, value) {
			const iuPartnerInputImage = item.querySelector('[iu-input-image]')

			iuPartnerInputImage.value = value
		}
		setFileInInput(e, m, item) {
			this.clearAllElementActions(item, '[iu-input-image]')
			const input = item.querySelector('[iu-input-image]')

			input.addEventListener('change', event => {
				let target = event.target || event.srcElement
				let file = target.files[0]

				const validFileSizeResponse = this.validFileSize(file)

				if (!validFileSizeResponse.valid) {
					const alert = new VirtonexAlert('alert-warning', validFileSizeResponse.message)
					input.value = ''
					this.setPartnerImage(item, null)
					mainPartnersModal.setImageBlock(e, m)
					alert.show()
					return
				}

				;(async () => {
					await this.setIcon(item, file)
					await mainPartnersModal.setImageBlock(e, m)
				})()
			})

			input.dispatchEvent(new MouseEvent('click', { bubbles: true }))
		}
		clearAllElementActions(item, selector) {
			const element = item.querySelector(selector)

			element.replaceWith(element.cloneNode(true))
		}
		actionDelete(e) {
			const item = this.getItem(e)

			item.remove()
		}
	}

	class PartnersModal extends VirtonexModal {
		constructor(selector) {
			super()
			this.uploader = new PartnersUploader()
			this.m = new bootstrap.Modal(document.querySelector(selector))
		}
		show(e) {
			this.setPartnerName(e, this.m)
			this.setPartnerLink(e, this.m)
			this.setImageBlock(e, this.m)
			this.setButtonAction(e, this.m, '[iu-modal-button-save-changes]', this.buttonSaveChangesAction.bind(this))
			this.setButtonAction(e, this.m, '[iu-modal-button-add-logo]', this.loadLogotypeAction.bind(this))

			this.m.show()
		}
		buttonSaveChangesAction(m, e) {
			const item = this.uploader.getItem(e)
			const inputPartnerName = this.getModalElement(m, '[iu-modal-partner-name]')
			const inputPartnerLink = this.getModalElement(m, '[iu-modal-partner-link]')

			if (inputPartnerName.value !== '') {
				this.uploader.setPartnerInputName(item, inputPartnerName.value)
				this.uploader.setPartnerInputLink(item, inputPartnerLink.value)

				inputPartnerName.classList.remove('invalid')

				m.hide()
			} else {
				inputPartnerName.classList.add('invalid')
			}
		}
		setPartnerName(e, m) {
			const inputPartnerName = this.getModalElement(m, '[iu-modal-partner-name]')

			const item = this.uploader.getItem(e)
			inputPartnerName.value = this.uploader.getPartnerInputName(item)
		}
		setPartnerLink(e, m) {
			const inputPartnerName = this.getModalElement(m, '[iu-modal-partner-link]')

			const item = this.uploader.getItem(e)
			inputPartnerName.value = this.uploader.getPartnerInputLink(item)
		}
		setImageBlock(e, m) {
			const body = this.getModalElement(m, '[iu-modal-body]')
			const item = this.uploader.getItem(e)
			const uploaderImageSrc = this.uploader.getItemImage(item).src

			if (uploaderImageSrc) {
				this.setImage(e, m, uploaderImageSrc)
				this.setFileName(e, m)
				this.setIconDeleteAction(e, this.m)

				this.setAddLogotypeButtonText(e, m, 'Изменить логотип')
				body.classList.remove('d-none')
			} else {
				this.setAddLogotypeButtonText(e, m, 'Добавить логотип')
				body.classList.add('d-none')
			}

			return true
		}
		loadLogotypeAction(m, e) {
			const item = this.uploader.getItem(e)
			this.uploader.setFileInInput(e, m, item)
		}
		setIconDeleteAction(e, m) {
			this.clearAllElementActions(m, '[iu-modal-edit-icon-delete-action]')

			const iconDeleteButton = this.getModalElement(m, '[iu-modal-edit-icon-delete-action]')

			iconDeleteButton.addEventListener('click', () => {
				const body = this.getModalElement(m, '[iu-modal-body]')
				const item = this.uploader.getItem(e)

				body.classList.add('d-none')
				this.uploader.setPartnerImage(item, null)
				this.uploader.setPartnerInputImage(item, null)
				this.setAddLogotypeButtonText(e, m, 'Добавить логотип')
			})
		}
		setImage(e, m, src) {
			const elementImage = this.getModalElement(m, '[iu-modal-image]')

			elementImage.src = src
		}
		setFileName(e, m) {
			const item = this.uploader.getItem(e)
			const inputPartnerImageName = this.uploader.getPartnerInputImageName(item)
			const spanName = this.getModalElement(m, '[iu-modal-view-span-name]')

			spanName.textContent = inputPartnerImageName
		}
		setAddLogotypeButtonText(e, m, text) {
			const loadLogotypeButton = this.getModalElement(m, '[iu-modal-button-add-logo]')

			loadLogotypeButton.querySelector('.actionText').textContent = text
		}
	}

	const uploader = new Uploader()
	uploader.initBasicUploaders()
	uploader.initRequired()

	let mainEditModal = null
	let mainDeleteModal = null
	let mainPartnersModal = null
	let mainContactModal = null

	if (document.querySelector('#modal-edit-file') && document.querySelector('#modal-delete-file')) {
		mainEditModal = new EditModal('#modal-edit-file')
		mainDeleteModal = new DeleteModal('#modal-delete-file')
	}
	if (document.querySelector('#modal-partners')) {
		mainPartnersModal = new PartnersModal('#modal-partners')
		new UploaderPreview(44, 'assets/img/virtonex/cards/4.webp')
	}

	return true
})()

export default virtonexUploader
