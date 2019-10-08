import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

export const filterMetadataByTime = (
	array,
	offset,
	referentDate = new Date()
) => {
	return array.filter(
		element =>
			differenceInCalendarDays(
				new Date(element.properties.time),
				referentDate
			) >= -offset
	);
};

export const filterMetadataByDistance = (array, referent, distance) => {
	return array.filter(
		element =>
			latLonDistance(
				element.geometry.coordinates[0],
				element.geometry.coordinates[1],
				referent.latitude,
				referent.longitude
			) <= distance
	);
};

export const connectionFilter = error =>
	error.response && error.response.data && error.response.data.message
		? error.response.data.message
		: "Something went wrong. Server is unreachable or your might be offline.";

const latLonDistance = (latitude1, longitude1, lattitude2, longitude2) => {
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
