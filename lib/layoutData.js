"use strict";

var layoutData = {
    styling: {
        normal: {
            family: "'Roboto', sans-serif",
            weight: 600,
            size: 14,
            fill: "#fff",
            leading: 1.2
        },
        forcer: {
            family: "'Roboto', sans-serif",
            anchor: 'middle',
            fill: "#297082",
            size: 14
        },
        operator: {
            size: 28,
            weight: 400
        },
        notBold: {
            weight: 400
        },
        smallText: {
            size: 12,
            weight: 400
        },
        hide: {
            visibility: 'hidden'
        },
        center: {
            anchor: 'middle'
        }
    },
    background: [{
        ref: "images/paper-doll/background.png",
        width: 1730,
        height: 938,
        x: 0,
        y: 0
    }, {
        ref: "images/paper-doll/waves.gif",
        width: 460,
        height: 250,
        x: 1007,
        y: 553
    }, {
        ref: "images/paper-doll/seaFloor.png",
        width: 374,
        height: 199,
        x: 1037,
        y: 630
    }, {
        ref: "images/paper-doll/rainLeft.gif",
        width: 204,
        height: 168,
        x: 880,
        y: 404
    }, {
        ref: "images/paper-doll/rainRight.gif",
        width: 204,
        height: 168,
        x: 1396,
        y: 407
    }, {
        ref: "images/paper-doll/Initial%20State.png",
        width: 46,
        height: 46,
        x: 136,
        y: 118
    }],
    text: [{
        text: "FORCING & RESPONSE SIMULATOR",
        x: 126,
        y: 90,
        font: []
    }, {
        text: "INITIAL STATE",
        x: 160,
        y: 187,
        font: ["center"]
    }, {
        text: "+",
        x: 214,
        y: 134,
        font: ["operator"]
    }, {
        text: "+",
        x: 110,
        y: 210,
        font: ["operator"]
    }, {
        text: "=",
        x: 764,
        y: 208,
        font: ["operator"]
    }, {
        text: "PROCESS SIMULATOR",
        x: 874,
        y: 89,
        font: []
    }, {
        text: "TEMP.",
        x: 550,
        y: 831,
        font: ["notBold"]
    }, {
        text: "ATMOSPHERE",
        x: 1075,
        y: 212,
        font: []
    }, {
        text: "WEATHERING",
        x: 1027,
        y: 510,
        font: []
    }, {
        text: "CARBON BURIAL",
        x: 1027,
        y: 525,
        font: ["smallText"]
    }, {
        text: "WEATHERING",
        x: 1452,
        y: 484,
        font: []
    }, {
        text: "CARBON RELEASE",
        x: 1452,
        y: 500,
        font: ["smallText"]
    }, {
        text: "CARBONATE\nDEPOSITION",
        x: 1226,
        y: 630,
        font: []
    }, {
        text: "CARBON BURIAL",
        x: 1226,
        y: 664,
        font: ["smallText"]
    }, {
        text: "SEDIMENT",
        x: 1003,
        y: 666,
        font: []
    }, {
        text: "CARBON BURIAL",
        x: 1003,
        y: 681,
        font: ["smallText"]
    }, {
        text: "VOLCANO",
        x: 1412,
        y: 677,
        font: []
    }, {
        text: "CARBON RELEASE",
        x: 1412,
        y: 693,
        font: ["smallText"]
    }, {
        text: "IGNEOUS &\nMETAMORPHIC\nROCK",
        x: 900,
        y: 596,
        font: []
    }, {
        text: "CARBONATE\nROCK",
        x: 1503,
        y: 601,
        font: []
    }, {
        text: "CLIMATE SIMULATOR 7.5",
        x: 136,
        y: 853,
        font: []
    }],
    timeline: [[{
        ref: "images/paper-doll/time1On.png",
        width: 64,
        height: 30
    }, {
        ref: "images/paper-doll/time1Off.png",
        width: 64,
        height: 30
    }, {
        text: "INITIAL",
        x: 6
    }], [{
        ref: "images/paper-doll/time2On.png",
        width: 90,
        height: 30
    }, {
        ref: "images/paper-doll/time2Off.png",
        width: 90,
        height: 30
    }, {
        text: "100-1000 Y",
        x: 17
    }], [{
        ref: "images/paper-doll/time3On.png",
        width: 119,
        height: 30
    }, {
        ref: "images/paper-doll/time3Off.png",
        width: 119,
        height: 30
    }, {
        text: "100 KY",
        x: 22
    }], [{
        ref: "images/paper-doll/time4On.png",
        width: 162,
        height: 30
    }, {
        ref: "images/paper-doll/time4Off.png",
        width: 162,
        height: 30
    }, {
        text: "1 MY",
        x: 22
    }], [{
        ref: "images/paper-doll/time5On.png",
        width: 229,
        height: 30
    }, {
        ref: "images/paper-doll/time5Off.png",
        width: 229,
        height: 30
    }, {
        text: "10 MY",
        x: 22
    }]],
    timelinePlacement: [0, 44, 113, 217, 364],
    forcers: [[{
        ref: "images/paper-doll/mountains_inactive.png",
        width: 56,
        height: 70
    }, {
        ref: "images/paper-doll/mountains_active.png",
        width: 56,
        height: 70
    }, {
        text: "MOUNTAINS",
        x: 25,
        y: 75
    }], [{
        ref: "images/paper-doll/volcanoes_inactive.png",
        width: 54,
        height: 70
    }, {
        ref: "images/paper-doll/volcanoes_active.png",
        width: 54,
        height: 70
    }, {
        text: "VOLCANOES",
        x: 25,
        y: 75
    }], [{
        ref: "images/paper-doll/carbon%20burial_inactive.png",
        width: 74,
        height: 65
    }, {
        ref: "images/paper-doll/carbonBurial_active.png",
        width: 74,
        height: 65
    }, {
        text: "CARBON BURIAL",
        x: 35,
        y: 75
    }], [{
        ref: "images/paper-doll/carbon%20release_inactive.png",
        width: 81,
        height: 66
    }, {
        ref: "images/paper-doll/carbon%20release_active.png",
        width: 81,
        height: 66
    }, {
        text: "CARBON RELEASE",
        x: 37,
        y: 75
    }], [{
        ref: "images/paper-doll/insulation_inactive.png",
        width: 52,
        height: 70
    }, {
        ref: "images/paper-doll/insulation_active.png",
        width: 52,
        height: 70
    }, {
        text: "INSULATION",
        x: 25,
        y: 75
    }]],
    forcersPlacement: [[-10, 0], [95, 0], [195, 0], [323, 0], [452, 0]]
};
