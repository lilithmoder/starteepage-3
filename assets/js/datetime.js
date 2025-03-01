(function() {
	function zeroFill(n) {
		return ('0' + n).slice(-2);
	}

	const interval = setInterval(() => {
		const now = new Date();

		const dateTime = `${zeroFill(now.getDate())}/${zeroFill(now.getMonth() + 1)}/${now.getFullYear()} ${zeroFill(now.getHours())}:${zeroFill(now.getMinutes())}:${zeroFill(now.getSeconds())}`;

		const dateElement = document.getElementById("Date");
		if (dateElement) {
			dateElement.textContent = dateTime;
		} else {
			clearInterval(interval);
		}
	}, 100);
})();
