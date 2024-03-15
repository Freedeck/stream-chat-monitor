universal.on('haf.statechange', (data) => {
	document.querySelectorAll('.button').forEach((button) => {
	  if (button.getAttribute('data-interaction')) {
		let dat = button.getAttribute('data-interaction');
		dat = JSON.parse(dat);
		if (dat.type == data.wanted) {
		  button.innerText = data.state;
		  // This is the way to do it! We don't want to modify innerHTML, because that would be a security risk.
		}
	  }
	});
  });
  