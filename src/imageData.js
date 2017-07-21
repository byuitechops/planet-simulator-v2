/*eslint-env browser*/
/*eslint no-unused-vars:0*/
//radiusPathCircle = 255,310,
//width : 90, 100
function makeBigMeeterSpots(spotWidth, pathRadius) {
    var spotsOut = [],
        count = 9, //number of small spots
        xPathCircle = 420, //the x of the path the small spotLights are set on
        yPathCircle = 567, //the y of the path small spotLights are set on
        offset = spotWidth / 2, //they are moved from the top left corner not center
        startAngle = Math.PI / 3.5, //the starting angle of the path the small spotLights are set on
        endAngle = -startAngle, //the ending angle of the path the small spotLights are set on
        gap = startAngle - endAngle,
        step = gap / (count - 1),
        i;

    //for all the setps move a long the path the small spotLights are set on and make a spot
    for (i = startAngle; i <= startAngle && i >= endAngle; i -= step) {
        spotsOut.push({
            width: spotWidth,
            height: spotWidth,
            //this is a parameterization of a circle
            x: xPathCircle + pathRadius * Math.cos(i) - offset,
            y: yPathCircle + pathRadius * -Math.sin(i) - offset
        })
    }
    return spotsOut;
}

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
        },
        spotlights: [{
            width: 440,
            height: 300,
            x: 207,
            y: 450
        }]
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
        },
        spotlights: [{
            width: 200,
            height: 400,
            x: 330,
            y: 400
        }]
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
        },
        spotlights: [{
            width: 400,
            height: 200,
            x: 228,
            y: 310
        }, {
            width: 400,
            height: 200,
            x: 228,
            y: 600
        }]
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
        },
        spotlights: [{
            width: 430,
            height: 430,
            x: -75,
            y: 210
        }]
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
        },
        spotlights: [{
            width: 230,
            height: 350,
            x: 110,
            y: 410
        }]
    },
    {
        name: "co2",
        label: "CO<sub>2</sub>",
        isFrame: true,
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
        },
        spotlights: makeBigMeeterSpots(90, 255)
    },
    {
        name: "temperature",
        label: "Temperature",
        isFrame: true,
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
        },
        spotlights: makeBigMeeterSpots(100, 310)
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
        },
        spotlights: [{
            width: 175,
            height: 400,
            x: 1270,
            y: 370
        }]
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
        },
        spotlights: [{
            width: 250,
            height: 220,
            x: 1100,
            y: 540
        }]
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
        },
        spotlights: [{
            width: 170,
            height: 229,
            x: 940,
            y: 520
        }]
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

        },
        spotlights: [{
            width: 220,
            height: 230,
            x: 1396,
            y: 370
        }]
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
        },
        spotlights: [{
            width: 350,
            height: 250,
            x: 800,
            y: 370
        }]
    }
];
