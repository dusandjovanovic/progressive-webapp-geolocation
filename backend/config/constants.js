const ROOM_TYPE_POLLUTION = "ROOM_POLLUTION";
const ROOM_TYPE_PLACES = "ROOM_PLACES";
const ROOM_TYPE_TRAFFIC = "ROOM_TRAFFIC";

const ROOM_NAME_POLLUTION = "Air pollution insights";
const ROOM_NAME_PLACES = "Places and locations sightseeing";
const ROOM_NAME_TRAFFIC = "Traffic and roadblock insights";

const DIR_UPLOAD_LOCATION = "/uploads";

const DISTANCE = (latitude1, longitude1, lattitude2, longitude2) => {
	let R = 6371;
	let dLat = toRad(lattitude2 - latitude1);
	let dLon = toRad(longitude2 - longitude1);
	let lat1 = toRad(latitude1);
	let lat2 = toRad(lattitude2);

	let a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(lat1) *
			Math.cos(lat2);
	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let d = R * c;
	return d;
};

const toRad = Value => {
	return (Value * Math.PI) / 180;
};

module.exports = Object.freeze({
	ROOM_TYPE_POLLUTION,
	ROOM_TYPE_PLACES,
	ROOM_TYPE_TRAFFIC,
	ROOM_NAME_POLLUTION,
	ROOM_NAME_PLACES,
	ROOM_NAME_TRAFFIC,
	DIR_UPLOAD_LOCATION,
	DISTANCE
});
