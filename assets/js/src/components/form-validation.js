/**
 * Form validation
 */

const formValidation = (() => {
	const selector = 'needs-validation'

	window.addEventListener(
		'load',
		() => {
			// Fetch all the forms we want to apply custom Bootstrap validation styles to
			let forms = document.getElementsByClassName(selector)
			// Loop over them and prevent submission
			let validation = Array.prototype.filter.call(forms, form => {
				form.addEventListener(
					'submit',
					e => {
						if (form.checkValidity() === false) {
							e.preventDefault()
							e.stopPropagation()
						}
						form.classList.add('was-validated')
						tabValidation(e)
					},
					false
				)
			})
		},
		false
	)

	function tabValidation(e) {
		const invalidTabsName = getInvalidTabsName(e)

		showInvalidFields(e)
		showTabError(invalidTabsName)
	}

	function showInvalidFields(e) {
		const form = e.srcElement
		const allBody = form.querySelectorAll('[iu-body]')

		allBody.forEach(body => {
			body.classList.remove('invalid')

			if (body.querySelector('.form-control:invalid')) body.classList.add('invalid')
		})
	}

	function showTabError(invalidTabsName) {
		const tabs = document.querySelectorAll('.nav.nav-tabs [role="tab"]')

		tabs.forEach(tab => {
			if (invalidTabsName.includes(tab.id)) {
				tab.classList.add('invalid')
			} else {
				tab.classList.remove('invalid')
			}
		})
	}

	function getInvalidTabsName(e) {
		const form = e.srcElement
		const invalidElements = form.querySelectorAll('.was-validated .form-control:invalid')
		const invalidTabsName = []

		invalidElements.forEach(element => {
			const tabName = element.closest('[role="tabpanel"]').getAttribute('id')
			invalidTabsName.push(tabName + '-tab')
		})

		return invalidTabsName
	}

	return false
})()

export default formValidation
