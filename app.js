require('dotenv').config();
const fs = require('fs');
const inquirer = require('inquirer');
const axios = require('axios');
const player = require('play-sound')(opts = {});

inquirer.prompt([
	{
		type: 'input',
		name: 'gh_username',
		message: 'Who should we creep on?'
	}
]).then(data => {
	// console.log(data.gh_username);
	let createEventCount = 0;

	setInterval(function () {
		axios.get(`https://api.github.com/users/${data.gh_username}/events`)
			.then(res => {
				let createEvent = res.data.filter((item) => item.type === 'CreateEvent');

				if (createEvent.length > createEventCount) {
					console.log('User was active.');
					player.play('audio.mp3', (err) => {
						if (err) throw err;
					});

				}

				createEventCount = createEvent.length;

				fs.writeFile('issue_activity.log', JSON.stringify(createEvent, null, '\t'), (err) => {
					if (err) throw err;

					console.log('Issues logged');
				});

				// let str = JSON.stringify(res);

				fs.writeFile('gh_activity.log', JSON.stringify(res.data, null, '\t'), (err) => {
					if (err) throw err;

					console.log(`Successfully creeped on ${data.gh_username}`);
				})
			});
	}, 10000);


});

//
