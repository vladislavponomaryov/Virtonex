const contacts = (() => {
	class Storage {
		constructor(array = []) {
			this.data = array
		}
		add(obj) {
			this.data = [...this.data, obj]
		}
		remove(id) {
			this.data = this.data.filter(obj => obj.id !== id)
		}
	}

	class Modal {
		constructor(selector) {
			this.modal = new bootstrap.Modal(document.querySelector(selector))
		}
		show() {
			this.modal.show()
		}
		showOnClick(selector) {
			const button = document.querySelector(selector)

			button.addEventListener('click', () => this.modal.show())
		}
		hide() {
			this.modal.hide()
		}
		hideOnClick(selector) {
			const button = document.querySelector(selector)

			button.addEventListener('click', () => this.modal.hide())
		}
		createAction(selector, callback) {
			const button = this.modal._element.querySelector(selector)

			button.addEventListener('click', callback)
		}
		getElement(selector) {
			return this.modal._element.querySelector(selector)
		}
	}

	class UploaderItem {
		constructor(id) {
			this._element = null
			this.id = id
		}
		set(html, classList) {
			this._element = document.createElement('div')
			this._element.setAttribute('iu-item', '')
			this._element.classList = classList

			this._element.innerHTML = `<div class='d-flex align-items-center'>` + html + `</div>`

			return this._element
		}
		setPopover(editAction = null, removeAction = null, profileAction = null) {
			const popover = document.createElement('div')
			popover.classList = 'icon-points'
			popover.setAttribute('iu-popover-action', '')
			popover.setAttribute('tabindex', '0')

			popover.addEventListener('focus', e => {
				e.target.querySelector('[iu-popover]').style.display = 'flex'
			})

			popover.addEventListener('blur', e => {
				e.target.querySelector('[iu-popover]').style.display = 'none'
			})

			if (editAction || removeAction || profileAction) {
				const wrapperButton = document.createElement('div')
				wrapperButton.setAttribute('iu-popover', '')

				if (editAction) {
					const editButton = document.createElement('span')
					editButton.innerHTML = '<i class="icon-edit size-sm"></i>Редактировать'
					editButton.addEventListener('click', editAction)

					wrapperButton.append(editButton)
				}

				if (removeAction) {
					const deleteButton = document.createElement('span')
					deleteButton.innerHTML = '<i class="icon-delete size-sm"></i>Удалить'
					deleteButton.addEventListener('click', removeAction)

					wrapperButton.append(deleteButton)
				}

				if (profileAction) {
					const profileButton = document.createElement('span')
					profileButton.innerHTML = '<i class="icon-user size-sm"></i>Профиль'
					profileButton.addEventListener('click', profileAction)

					wrapperButton.append(profileButton)
				}

				popover.append(wrapperButton)

				this._element.append(popover)
			}
		}
		get() {
			return this._element
		}
	}

	class UploaderBody {
		constructor(selector, storage) {
			this.body = document.querySelector(selector)
			this.storage = storage
		}
		create() {
			this.storage.data.forEach(contact => {
				this.body.append(contact.get())
			})
		}
		update() {
			this.body.innerHTML = ''

			this.create()
		}
	}

	if (document.querySelector('#modal-contact') && document.querySelector('[users-body]')) step3UsersComponent()
	if (document.querySelector('#profile_contact_user') && document.querySelector('[contacts-body]'))
		profileContactsComponent()

	function step3UsersComponent() {
		const usersStorage = new Storage()
		const contactModal = new Modal('#modal-contact')
		const usersBody = new UploaderBody('[users-body]', usersStorage)

		contactModal.showOnClick('[modal-open]')
		contactModal.createAction('[modal-add-user]', () => {
			const email = contactModal.getElement('#step3_createNewContact_email')
			const role = contactModal.getElement('#step3_createNewUser_role')

			const newUserId = usersStorage.data.length

			let newUser = new UploaderItem(newUserId)
			newUser.set(
				`<span>${email.value}</span>
				<input class='form-control' type="hidden" name="step3_contact${newUserId}_email" value='${email.value}'>
				<input class='form-control' type="hidden" name="step3_contact${newUserId}_role" value='${role.value}'>`,
				'd-flex'
			)
			newUser.setPopover(null, e => {
				usersStorage.remove(newUserId)
				usersBody.update()
			})
			usersStorage.add(newUser)
			usersBody.update()

			contactModal.hide()
			email.value = ''
		})
	}

	function profileContactsComponent() {
		const contactsStorage = new Storage()
		const contactModal = new Modal('#profile_contact_user')
		const contactsBody = new UploaderBody('[contacts-body]', contactsStorage)

		const initialContacts = [
			{ name: 'Иван Петров', src: 'assets/img/virtonex/man.webp' },
			{ name: 'Олег Кузнецов', src: 'assets/img/virtonex/man.webp' },
			{ name: 'Александр Попов', src: 'assets/img/virtonex/man.webp' },
			{ name: 'Евгений Семенов', src: 'assets/img/virtonex/man.webp' },
		]

		initialContacts.forEach(contact => {
			const newUserId = contactsStorage.data.length
			let newUser = new UploaderItem(newUserId)
			newUser.set(
				`<img src='${contact.src}' class="rounded-circle me-4" width="42" alt="Profile photo">
			<span iu-name>${contact.name}</span>`,
				'd-flex'
			)
			newUser.setPopover(
				null,
				e => {
					contactsStorage.remove(newUserId)
					contactsBody.update()
				},
				e => {
					contactModal.show()
				}
			)
			contactsStorage.add(newUser)
			contactsBody.update()
		})
	}

	return true
})()
export default contacts
