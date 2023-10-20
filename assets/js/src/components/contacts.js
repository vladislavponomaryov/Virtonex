const contacts = (() => {
	class Storage {
		constructor(array = []) {
			this.storage = array
		}
		add(obj) {
			this.storage = [...this.storage, obj]
		}
		delete(id) {
			return this.storage.filter(obj => obj.id !== id)
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

	class Contact {
		constructor(email, role) {
			this.contact = this.create(email, role)
		}
		create(email, role) {
			return { email: email, role: role }
		}
		read() {
			return this.contact
		}
	}

	class User {
		constructor(email, role) {
			return this.create(email, role)
		}
		create(email, role) {
			this._element = document.createElement('div')
			this._element.setAttribute('iu-item', '')
			this._element.innerHTML = `<div class='d-flex align-items-center'> <span>${email}</span> <input class='form-control' type="hidden" name="contact"></div>`

			return this._element
		}
		_getPopover() {
			const element = document.createElement('div')
			element.classList = 'icon-points'
			element.setAttribute('[iu-popover-action]', '')
			element.setAttribute('tabindex', '0')
			element.innerHTML = `<div iu-popover> <span iu-target-action='openEditModal'><i class="icon-edit size-sm"></i>Редактировать</span> <span iu-target-action='openDeleteModal'"><i class="icon-delete size-sm"></i>Удалить</span> </div>`
		}
	}

	class Users {
		constructor(selector, storage) {
			this.body = document.querySelector(selector)
			return this.create(storage)
		}
		create({ storage }) {
			storage.forEach(contact => {
				const user = new User(contact.email, contact.role)
				this.body.append(user)
			})
		}
		update(storage) {
			this.body.innerHTML = ''

			this.create(storage)
		}
		addUser(modal, storage) {
			const fieldEmail = modal.getElement('#step3_createNewContact_email')
			const fieldRole = modal.getElement('#step3_createNewUser_role')

			const contact = new Contact(fieldEmail.value, fieldRole.value)
			storage.add(contact.read())

			fieldEmail.value = ''

			this.update(storage)

			modal.hide()
		}
	}

	const usersStorage = new Storage()
	const usersElement = new Users('[users-body]', usersStorage)

	const contactModal = new Modal('#step3_contactModal')
	contactModal.showOnClick('[modal-open]')
	contactModal.createAction('[modal-add-user]', () => {
		usersElement.addUser(contactModal, usersStorage)
	})

	return true
})()
export default contacts
