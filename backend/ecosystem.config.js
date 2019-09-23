require("dotenv").config();

module.exports = {
	apps: [
		{
			name: "Mapped",
			script: "server.js",
			instances: 2,
			autorestart: true,
			watch: false,
			max_memory_restart: "1G"
		}
	]
};
