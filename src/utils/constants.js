export const ROOM_TYPE_POLLUTION = "ROOM_POLLUTION";
export const ROOM_TYPE_PLACES = "ROOM_PLACES";
export const ROOM_TYPE_TRAFFIC = "ROOM_TRAFFIC";

export const MAP_ZOOM_LEVEL = 4;
export const MAP_LAYER =
	"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export const IMPACT_COLORS = [
	"#00b8d4",
	"#58c6dc",
	"#58dbe9",
	"#58e9f2",
	"#58f7fa",
	"#FFF600",
	"#FFD300",
	"#FF9E00",
	"#FF6900",
	"#FF2300"
];

export const IMPACT_COLORS_TRAFFIC = [
	"#A8A8A8",
	"#A0A0A0",
	"#989898",
	"#909090",
	"#888888",
	"#808080",
	"#787878",
	"#707070",
	"#686868",
	"#585858"
];

export const IMPACT_STRING_POLLUTION = value => {
	if (value <= 3) return "Low pollution";
	else if (value <= 6) return "Medium pollution";
	else return "Very high pollution";
};

export const IMPACT_STRING_TRAFFIC = value => {
	switch (value) {
		case 1:
			return "Bad road";
		case 5:
			return "Accident";
		default:
			return "Traffic jam";
	}
};
