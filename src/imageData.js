/*eslint-env browser*/
/*eslint no-unused-vars:0, no-console:0*/

//Given am,y, width and height, this function returns an array of arrays of x an y points for the parameterization of a circle
function paramACircle(x, y, width, height) {
    var pointsOut = [],
        pointCount = 24, //number of points in circle
        step = (Math.PI * 2) / (pointCount), //how many radians for each point
        startAngle = Math.PI / 2, // start at the top point of the circle
        endAngle = startAngle - (step * (pointCount)), // subtract because I want to go clock wise, -1 because we end short of the full circle because svg polygon conects the two ends 
        rightRadius = width / 2,
        upRadius = height / 2,
        i;

    //for all the setps move a long the path the small spotLights are set on and make a spot
    for (i = startAngle; i <= startAngle && i >= endAngle; i -= step) {
        pointsOut.push([
            //X of the parameterization of a circle 
            x + rightRadius * Math.cos(i),
            //Y of the parameterization of a circle, -i because the y axes is flipped
            y + upRadius * Math.sin(-i)
        ]);
    }
    return pointsOut;
}

function fixPoints(point) {
    point[0] = Math.round(point[0] * 0.75);
    point[1] = Math.round(point[1] * 0.75);
}

var spot = [[725.69578, 473.6823],
[729.73721, 451.34837],
[752.59896, 442.33795],
[771.60041, 445.73902],
[822.71464, 491.12682],
[880.63744, 567.09698],
[920.0116, 649.43847],
[932.0078, 757.26527],
[919.39322, 847.25236],
[883.96992, 937.23944],
[834.87642, 1008.1125],
[737.05163, 1094.2769],
[713.31536, 1097.8436],
[697.13411, 1082.6805],
[692.7835, 1065.7528],
[700.66326, 1043.9467],
[794.04688, 963.52426],
[834.78586, 904.98308],
[860.67091, 840.81701],
[870.20915, 759.77631],
[859.79639, 667.17665],
[828.59564, 594.43743],
[784.25251, 538.70092],
[735.68682, 494.08609]];

var temp = [[768.37887, 426.06984],
[779.74608, 400.39558],
[805.69388, 390.28764],
[827.04558, 394.42847],
[883.7676, 447.30349],
[947.56142, 535.48028],
[990.32137, 630.77639],
[1001.7178, 755.10129],
[992.09564, 864.96172],
[952.94038, 969.45635],
[896.20406, 1050.5021],
[827.60817, 1106.7797],
[743.43998, 1157.7556],
[710.20796, 1141.3761],
[713.28318, 1106.5381],
[781.2115, 1058.5802],
[842.1395, 1003.7662],
[891.76385, 926.63042],
[919.65841, 850.48708],
[932.0078, 757.26527],
[919.54744, 651.7703],
[885.81146, 570.1779],
[838.20025, 504.18979],
[780.51294, 452.235]];

var volSpot = [[576.7, 595.1],
                    [665.9, 569.9],
                    [755.1, 544.6],
                    [814.5, 633],
                    [758.7, 665.4],
                    [665, 681.6],
                    [630.7, 781.6],
                    [657.8, 857.8],
                    [692, 887],
                    [641.5, 910.5],
                    [657.8, 950.1],
                    [724.4, 955.5],
                    [730.7, 988],
                    [609.6, 1022],
                    [495.6, 1000],
                    [492, 932.1],
                    [540.6, 921.3],
                    [555.9, 844.7],
                    [530.3, 746],
                    [470.3, 672.6],
                    [385.6, 696],
                    [324.4, 616.7],
                    [389.3, 539.2],
                    [483, 567.2]];

var raySpot = paramACircle(100, 515, 500, 500)

volSpot.forEach(fixPoints);
raySpot.forEach(fixPoints);
spot.forEach(fixPoints);
temp.forEach(fixPoints);
console.log("JSON.stringify(spot):", JSON.stringify(spot));
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
        spotlights: [paramACircle(427, 600, 440, 300)],
    }, {
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
        //spotlights: [paramACircle(430, 600, 200, 400)]
        spotlights: [volSpot]
    }, {
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
        spotlights: [
            paramACircle(428, 410, 400, 200),
            paramACircle(428, 700, 400, 200)
        ]
    }, {
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
        spotlights: [raySpot]
    }, {
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
        spotlights: [paramACircle(225, 585, 230, 350)]
    }, {
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
        spotlights: [spot]
    }, {
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
        spotlights: [temp]

    }, {
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
        spotlights: [paramACircle(1357, 570, 175, 400)]
    }, {
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
        spotlights: [paramACircle(1225, 650, 250, 220)]
    }, {
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
        spotlights: [paramACircle(1025, 634, 170, 229)]
    }, {
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
        spotlights: [paramACircle(1506, 485, 220, 230)]
    }, {
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
        spotlights: [paramACircle(975, 495, 350, 250)]
    }
];
