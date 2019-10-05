const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
	destination: "./uploads",
	filename: function(req, file, callback) {
		crypto.pseudoRandomBytes(16, function(err, raw) {
			if (err) return callback(err);
			callback(
				null,
				raw.toString("hex") + path.extname(file.originalname)
			);
		});
	}
});

module.exports = multer({ storage: storage });
