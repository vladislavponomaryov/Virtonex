class VirtonexAlert {
	constructor(additionalClass, message) {
		this.additionalClass = additionalClass
		this.message = message
		this.alertsBlock = this.getAlertsBlock()

		this.alert = this.create()
	}
	getAlertsBlock() {
		let alertsBlock = document.querySelector('alerts')

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
		alert.textContent = this.message

		return alert
	}
	show() {
		this.alertsBlock.append(this.alert)

		new bootstrap.Alert(this.alert)
	}
}

export default VirtonexAlert
