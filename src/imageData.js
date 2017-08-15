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
        spotlights: [[[262, 449], [290, 471], [303, 472], [320, 480], [354, 492], [384, 516], [402, 553], [411, 585], [421, 609], [428, 634], [425, 679], [401, 704], [386, 720], [380, 729], [360, 749], [336, 756], [292, 728], [247, 674], [223, 617], [220, 584], [217, 551], [226, 493], [239, 467]],
        // looks pretty jumbled without a break, so the second spotlight starts here
        [[592, 462], [559, 477], [524, 489], [508, 499], [499, 515], [486, 545], [477, 566], [466, 585], [466, 607], [469, 630], [470, 659], [475, 695], [484, 723], [501, 736], [522, 736], [552, 727], [568, 711], [584, 695], [606, 663], [622, 628], [630, 598], [631, 557], [622, 516], [616, 488]]]
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
        spotlights: [[[428, 451], [495, 432], [556, 423], [602, 483], [565, 504], [527, 535], [506, 564], [501, 608], [519, 663], [518, 695], [521, 736], [491, 750], [458, 757], [419, 759], [383, 754], [375, 703], [371, 669], [380, 617], [372, 562], [341, 528], [292, 503], [249, 475], [291, 419], [358, 430]]]
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
            paramACircle(428, 415, 300, 125),
            paramACircle(428, 720, 300, 90)
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
        spotlights: [paramACircle(75, 386, 376, 376)]
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
        spotlights: [paramACircle(255, 585, 235, 290)]
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
        spotlights: [[[544, 355], [547, 339], [564, 332], [579, 334], [617, 368], [660, 425], [690, 487], [699, 568], [690, 635], [663, 703], [626, 756], [553, 821], [535, 823], [523, 812], [520, 799], [525, 783], [596, 723], [626, 679], [646, 631], [653, 570], [645, 500], [621, 446], [588, 404], [552, 371]]]
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
        spotlights: [[[576, 320], [585, 300], [604, 293], [620, 296], [663, 335], [711, 402], [743, 473], [751, 566], [744, 649], [715, 727], [672, 788], [621, 830], [558, 868], [533, 856], [535, 830], [586, 794], [632, 753], [669, 695], [690, 638], [699, 568], [690, 489], [664, 428], [629, 378], [585, 339], [585, 339]]]

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
        spotlights: [[[1357, 370], [1380, 377], [1401, 397], [1419, 429], [1433, 470], [1442, 518], [1445, 570], [1442, 622], [1525, 670], [1525, 711], [1401, 743], [1380, 763], [1357, 770], [1334, 763], [1313, 743], [1295, 711], [1281, 670], [1272, 622], [1270, 570], [1272, 518], [1281, 470], [1295, 429], [1313, 397], [1334, 377], [1357, 370]]]
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
        spotlights: [paramACircle(1225, 650, 210, 220)]
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
        spotlights: [paramACircle(1042, 640, 180, 180)]
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
        spotlights: [paramACircle(1540, 525, 220, 230)]
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
        spotlights: [paramACircle(965, 515, 320, 290)]
    }
];
