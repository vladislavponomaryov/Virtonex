const preloader = (() => {
	window.onload = function () {
		const preloader = document.querySelector('.page-loading')

		if (preloader) {
			if (window.screen.width < 992) {
				preloader.querySelector('span').textContent = 'Для просмотра приложения, нужен экран большего размера'
				preloader.querySelector('.page-spinner').style.display = 'none'
				preloader.classList.add('active')

				return
			}

			preloader.classList.remove('active')
			setTimeout(function () {
				preloader.remove()
			}, 1000)
		}
	}

	return true
})()

export default preloader
