/*
    205,351
    227,369
    22,18
 */

var imageData = [
	{
		name: "sea",
		label: "Sea Level",
		isFrame: true,
		items: 5,
		width: 392,
		height: 392,
		x: 227,
		y: 369,
		path: "./images/animations/flooding/flood",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "volcano",
		label: "Volcanic Activity",
		isFrame: true,
		items: 5,
		width: 401,
		height: 417,
		x: 229,
		y: 377,
		path: "./images/animations/volcanoes/volcano",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "ice",
		label: "Ice",
		isFrame: false,
		items: 5,
		width: 304,
		height: 392,
		x: 271,
		y: 368,
		path: "./images/animations/iceCaps/iceCap",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "insolation",
		label: "Insolation",
		isFrame: false,
		items: 5,
		width: 334,
		height: 412,
		x: -75,
		y: 150,
		path: "./images/animations/lightRays/lightRay",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "mountain",
		label: "Mountains",
		isFrame: false,
		items: 5,
		width: 187,
		height: 238,
		x: 154,
		y: 459,
		path: "./images/animations/mountains/mountain",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "co2",
		label: "CO<sub>2</sub>",
		isFrame: false,
		items: 10,
		width: 126,
		height: 440,
		x: 563,
		y: 346,
		path: "./images/animations/co2Meter/co2Meter",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "temperature",
		label: "Temperature",
		isFrame: false,
		items: 10,
		width: 148,
		height: 522,
		x: 589,
		y: 307,
		path: "./images/animations/tempMeter/tempMeter",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    },
	{
		name: "underwaterVolcano",
		label: "Volcanic Activity",
		isFrame: true,
		items: 5,
		width: 164,
		height: 305,
		x: 1287,
		y: 375,
		path: "./images/animations/underwaterVolcanoes/volcano",
		ext: ".gif",
		scale: {
			x: 1,
			y: 1.3
		},
		macaroni: {
			needed: true,
			x: 1384,
			y: 654,
			mirrored: false,
			name: "underwaterVolcano"
		}
    },
	{
		name: "co3Desposition",
		label: "Carbonate Desposition",
		isFrame: true,
		items: 5,
		width: 120,
		height: 216,
		x: 1155,
		y: 540,
		path: "./images/animations/seaSnow/seaSnow",
		ext: ".gif",
		scale: {
			x: 1,
			y: 0.72
		},
		macaroni: {
			needed: true,
			x: 1195,
			y: 618,
			mirrored: false,
			name: "co3Desposition"
		}
    },
	{
		name: "sediment",
		label: "Sediment (Carbon Burial)",
		isFrame: true,
		items: 5,
		width: 129,
		height: 129,
		x: 978,
		y: 527,
		path: "./images/animations/sediment/sediment",
		ext: ".gif",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: true,
			x: 975,
			y: 643,
			mirrored: false,
			name: "sediment"
		}
    },
	{
		name: "weatheringCRelease",
		label: "Weathering (Carbon Release)",
		isFrame: true,
		items: 5,
		width: 204,
		height: 168,
		x: 1396,
		y: 396,
		path: "./images/animations/carbonateRock/carbonateRock",
		ext: ".gif",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: true,
			x: 1560,
			y: 458,
			mirrored: true,
			name: "weatheringCRelease"

		}
    },
	{
		name: "weatheringCBurial",
		label: "Weathering (Carbon Burial)",
		isFrame: false,
		items: 5,
		width: 23,
		height: 54,
		x: 997,
		y: 489,
		path: "./images/animations/MininMacaroniMeter/miniMacMeter",
		ext: ".png",
		scale: {
			x: 1,
			y: 1
		},
		macaroni: {
			needed: false
		}
    }
    //*/
];


//var containerIndexes = {};
//containers.forEach(function (container, index) {
//    containerIndexes[container.name] = index;
//});
//
//console.log("containerIndexes:", containerIndexes);

imageData.forEach(box => {
	var larger = box.width > box.height ? box.width : box.height;
	box.bounds = {
		width: larger,
		height: larger,
		x: box.x,
		y: box.y,
		scale: {
			x: box.scale.x * 1.5,
			y: box.scale.y * 1.5
		}
	};
	if (box.name === "sediment" || box.name === "weatheringCBurial") {
		box.bounds.scale.x = 2;
		box.bounds.scale.y = 2;
	}
	if (box.name === "insolation") {
		box.bounds.y += 30;
		box.bounds.scale.x = .9;
		box.bounds.scale.y = .9;
	}
	if (box.name === "mountain") {
		box.bounds.scale.x = 1.2;
		box.bounds.scale.y = 1.2;
	}
	if (box.name === "volcano") {
		box.bounds.scale.x = .9;
		box.bounds.scale.y = .9;
	}
	if (box.name === "temperature") {
		box.bounds.x -= 170;
		box.bounds.scale.x = .5;
		box.bounds.scale.y = 1.2;
	}
	if (box.name === "co2") {
		box.bounds.x -= 180;
		box.bounds.scale.x = .5;
		box.bounds.scale.y = 1.5;
	}
	if (box.name === "underwaterVolcano") {
		box.bounds.y += 50;
		box.bounds.x -= 15;
		box.bounds.scale.x = .65;
		box.bounds.scale.y = 1.5;
	}
	if (box.name === "weatheringCBurial") {
		box.bounds.y -= 50;
//		        box.bounds.x -= 15;
		box.bounds.scale.x = 5;
		box.bounds.scale.y = 5;
	}
	box.bounds.x -= (box.bounds.width * box.bounds.scale.x - box.bounds.width)/2
	box.bounds.y -= (box.bounds.height * box.bounds.scale.y - box.bounds.height)/2
	box.bounds.width *= box.bounds.scale.x
	box.bounds.height *= box.bounds.scale.y
})

console.log(imageData)
