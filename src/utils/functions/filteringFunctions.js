import isSameWeek from "date-fns/isSameWeek";

export const filterMetadataByTime = (array, referent = new Date()) => {
	return array.filter(element =>
		isSameWeek(new Date(element.properties.time), referent)
	);
};

export const filterMetadataByDistance = (array, referent, distance = 1000) => {
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

const latLonDistance = (latitude1, longitude1, lattitude2, longitude2) => {
	var R = 6371;
	var dLat = toRad(lattitude2 - latitude1);
	var dLon = toRad(longitude2 - longitude1);
	var lat1 = toRad(latitude1);
	var lat2 = toRad(lattitude2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) *
			Math.sin(dLon / 2) *
			Math.cos(lat1) *
			Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
};

const toRad = Value => {
	return (Value * Math.PI) / 180;
};
