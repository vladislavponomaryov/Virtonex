const modals = (() => {
	const step4ButtonCreateUser = document.querySelector('#step4_buttonCreateUser')

	if (step4ButtonCreateUser) {
		const step4ModalCreateUser = new bootstrap.Modal(document.querySelector('#step4_createUserModal'))

		step4ButtonCreateUser.addEventListener('click', () => {
			step4ModalCreateUser.show()
		})
	}

	/*const step4ModalUserProfile = new bootstrap.Modal(document.querySelector('#step4_contact_user'))

	step4ModalUserProfile.show()*/
})()

export default modals
