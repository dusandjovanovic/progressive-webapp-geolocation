const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	users: [
		{
			type: String
		}
	],
	time: {
		type: Date,
		required: false,
		default: Date.now
	},
	roomType: {
		type: String,
		required: true
	},
	roomData: [
		{
			type: String,
			properties: {
				time: Date,
				name: String,
				value: Number,
				amenity: String
			},
			geometry: {
				type: String,
				coordinates: [
					{
						type: Number
					}
				]
			}
		}
	]
});

RoomSchema.statics = {
	isRoomById(id) {
		return this.findById(id, function(error, room) {
			if (error || !room) return false;
		});
	},
	isRoomByName(name) {
		return this.findOne({ name: name }, function(error, room) {
			if (error || !room) return false;
		});
	}
};

module.exports = mongoose.model("Room", RoomSchema);
