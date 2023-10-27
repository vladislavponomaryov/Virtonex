const preloader = (() => {
	window.onload = function () {
		const preloader = document.querySelector('.page-loading')
		preloader.classList.remove('active')
		setTimeout(function () {
			preloader.remove()
		}, 1000)
	}

	return true
})()

export default preloader
