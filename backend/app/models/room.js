const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	users: [
		{
			username: {
				type: String,
				required: true
			},
			location: {
				latitude: {
					type: Number,
					required: true
				},
				longitude: {
					type: Number,
					required: true
				}
			}
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
			properties: {
				time: {
					type: Date,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				value: {
					type: Number,
					required: false
				},
				amenity: {
					type: String,
					required: false
				},
				author: {
					type: String,
					required: true
				}
			},
			geometry: {
				type: {
					type: String,
					required: true
				},
				coordinates: [Number]
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
