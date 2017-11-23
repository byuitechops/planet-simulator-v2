/*eslint-env es6, browser*/
/*eslint no-console:0, semi: ["error", "always"] */
/*global SVG, $, imageData, layoutData, size*/

function fixSVGSizeOld() {
    document.querySelector('#wrapper').style.width = '100%'
    var svg = document.querySelector('svg'),
        wSize = {
            h: window.innerHeight,
            w: window.innerWidth
        },
        messageBoxBox = document.querySelector('#descriptionBox').getBoundingClientRect(),
        svgSizeFromH = {},
        svgSizeFromW = {},
        wrapperStyle = window.getComputedStyle(document.getElementById('wrapper')),
        wrapperBorderTB = parseInt(wrapperStyle.borderTopWidth, 10) + parseInt(wrapperStyle.borderBottomWidth, 10),
        wrapperBorderRL = parseInt(wrapperStyle.borderRightWidth, 10) + parseInt(wrapperStyle.borderLeftWidth, 10),
        wrapperPaddingTB = parseInt(wrapperStyle.marginTop, 10) + parseInt(wrapperStyle.marginBottom, 10),
        msgBoxSize = {
            h: messageBoxBox.height,
            w: messageBoxBox.width
        },
        extraVert = msgBoxSize.h + wrapperPaddingTB + wrapperBorderTB,
        extraHoriz = wrapperBorderRL,
        svgSize, svgH, svgW;

    /************* FROM HEIGHT*****************/
    svgH = wSize.h - extraVert;
    svgW = Math.floor(svgH * size.width / size.height);

    if (svgW > msgBoxSize.w) {
        svgW = msgBoxSize.w;
        svgH = Math.floor(svgW * size.height / size.width);
    }
    svgSizeFromH.h = svgH;
    svgSizeFromH.w = svgW;

    /************* FROM WIDTH*****************/
    svgW = msgBoxSize.w;
    svgH = Math.floor(svgW * size.height / size.width);

    svgSizeFromW.h = svgH;
    svgSizeFromW.w = svgW;

    //sort by size;
    sizes = [svgSizeFromH, svgSizeFromW]
        //put the biggest on top    
        .sort((a, b) => b.h - a.h)
        //remove the ones that don't fit
        .filter((size) => {
            var widthGood = size.w <= wSize.w - extraHoriz,
                heightGood = size.h <= wSize.h - extraVert;
            return widthGood && heightGood;
        });


    console.log("sizes:", sizes);

    //the first in the list is the biggest that fits 

    //if the window height is smaller than 550px then we need to set it to that
    if (sizes.length === 0) {
        svgSize = {};
        svgSize.h = 550;
        svgSize.w = Math.floor(svgSize.h * size.width / size.height);

    } else {
        svgSize = sizes[0]

    }



    //this only looks at the hight we have available not the width
    svg.setAttribute('height', svgSize.h + 'px')
    svg.setAttribute('width', svgSize.w + 'px')
    document.querySelector('#wrapper').style.width = svgSize.w + 'px'
}

function fixSVGSize() {
    var svg = document.querySelector('svg'),
        wSize = {
            h: window.innerHeight,
            w: window.innerWidth
        },
        padding = 20,
        fromHeight = {},
        fromWidth = {},
        sizes;


    //from window height
    fromHeight.h = wSize.h - (2 * padding);
    fromHeight.w = Math.round(fromHeight.h * size.width / size.height);

    //from window width
    fromWidth.w = wSize.w - (2 * padding);
    fromWidth.h = Math.round(fromWidth.w * size.height / size.width);

    //sort by size
    sizes = [fromHeight, fromWidth]
        //put the biggest on top    
        .sort((a, b) => b.h - a.h)
        //remove the ones that don't fit
        .filter((size) => {
            var widthGood = size.w <= wSize.w - (2 * padding),
                heightGood = size.h <= wSize.h - (2 * padding);
            return widthGood && heightGood;
        });


    console.log(sizes);
    svg.setAttribute('height', sizes[0].h + 'px')
    svg.setAttribute('width', sizes[0].w + 'px')
    //document.querySelector('#wrapper').style.width = sizes[0].w + 'px'
}

var draw = SVG('drawing')
    .size(size.width, size.height)
    .viewbox(size.vbX, size.vbY, size.vbWidth, size.vbHeight);

//set the overflow attribute on the svg element
// draw.node.setAttribute("overflow", "hidden");
draw.node.setAttribute("preserveAspectRatio", "xMinYMin slice");


//drop shadow filter used on text and other things
var shadow = new SVG.Filter();
var blur = shadow.offset(2, 2).in(shadow.sourceAlpha).gaussianBlur(4);
shadow.blend(shadow.source, blur);
shadow.attr('name', 'shadowFilter');


var background = draw.group().attr('name', 'background');
layoutData.background.forEach(img => {
    background.add(draw.image(img.ref, img.width, img.height).x(img.x).y(img.y));
});

var forcers = draw.group().attr('name', 'forcers');
layoutData.forcers.forEach((seg, i) => {
    var group = draw.group();
    seg.forEach(elm => {
        if (elm.ref)
            group.add(draw.image(elm.ref, elm.width, elm.height));
        else
            group.add(draw.text(elm.text).x(elm.x).y(elm.y).font(layoutData.styling['forcer']));
    });
    group.x(layoutData.forcersPlacement[i][0]).y(layoutData.forcersPlacement[i][1]).dy(-7);
    group.children()[1].opacity(0);
    forcers.add(group);
});
forcers.x(272).y(110);

var mac = imageData[imageData.length - 1];

//make the masks gradient
var gradientUnderwaterVolcano, gradientInsolation, maskUnderwaterVolcano, maskInsolation;
gradientInsolation = draw.gradient('linear', function (stop) {
    stop.at(.2, '#000');
    stop.at(.4, '#fff');
}).attr('name', 'gradientInsolation').from(0, 0).to(0, 1);

gradientUnderwaterVolcano = draw.gradient('linear', function (stop) {
    stop.at(0.2, '#000');
    stop.at(0.3, '#fff');
}).attr('name', 'gradientUnderWaterVolcano').from(0, 0).to(0, 1);




//place all the pictures
imageData.forEach(elm => {
    var i;

    //make the group that the images will be put in
    elm.handle = draw.group().attr('name', elm.name);

    //add the masks to the group if needed
    if (elm.name == 'underwaterVolcano') {
        maskUnderwaterVolcano = draw.mask()
            .attr('name', 'maskUnderwaterVolcano')
            .add(draw.rect(elm.width, elm.height).x(elm.x).y(elm.y).scale(elm.scale.x, elm.scale.y).fill(gradientUnderwaterVolcano));

        elm.handle.maskWith(maskUnderwaterVolcano);
    } else if (elm.name == 'insolation') {
        maskInsolation = draw.mask()
            .attr('name', 'maskInsolation')
            .add(draw.rect(elm.width, elm.height).x(0).y(elm.y).scale(elm.scale.x, elm.scale.y).fill(gradientInsolation));

        elm.handle.maskWith(maskInsolation);
    }

    // for each image in the folder
    for (i = 1; i <= elm.items; i++) {
        var frame = draw.image(elm.path + i + elm.ext, elm.width, elm.height)
            .opacity(0)
            .x(elm.x)
            .y(elm.y)
            .scale(elm.scale.x, elm.scale.y)
            .data('frame', i - 1)
            .data('macaroni', 'false');

        elm.handle.add(frame);
    }

    if (elm.macaroni.needed) {
        for (i = 1; i <= elm.items; i++) {
            var macaroni = draw.image(mac.path + i + mac.ext, mac.width, mac.height)
                .x(elm.macaroni.x)
                .y(elm.macaroni.y)
                .data('frame', i - 1)
                .opacity(0)
                .data('macaroni', 'true');

            if (elm.macaroni.mirrored)
                macaroni.scale(-1, 1);


            elm.handle.add(macaroni);
        }
    }
});
//Put all the text into the svg
var text = draw.group().attr('name', 'Labels');
layoutData.text.forEach(line => {
    text.add(
        line.font.reduce((sum, font) => sum.font(layoutData.styling[font]),
            draw.text(line.text).x(line.x).y(line.y).font(layoutData.styling['normal'])
        )
    );
});
//CO2 meeter needs special attention 
text.add(draw.text(add => {
    add.tspan('CO').font(layoutData.styling['notBold']);
    add.tspan('2').dy(5).font(layoutData.styling['smallText']);
}).x(535).y(790).font(layoutData.styling['normal']));

text.dy(-7).children().forEach(child => child.filter(shadow));

//Make the timeline
var timeline = draw.group().attr('name', 'Timeline');

//make filter to darken the steps on mouse over
var darkenColor = new SVG.Filter();
darkenColor.componentTransfer({
    rgb: {
        type: 'linear',
        slope: 0.7
    }
});

//add the filter to the def tag
draw.defs().add(darkenColor);
darkenColor.attr('name', 'darkenColor');

layoutData.timeline.forEach((seg, i) => {
    var time = draw.group();
    seg.forEach(elm => {
        if (elm.ref)
            time.add(draw.image(elm.ref, elm.width, elm.height));
        else
            time.add(draw.text(elm.text).x(elm.x).y(12.5).font(layoutData.styling['normal']).font(layoutData.styling['smallText']));
    });
    time.x(layoutData.timelinePlacement[i]).data('phase', i);
    time.children()[2].filter(shadow);
    time.children()[0].opacity(0);


    time.on('mouseover', function () {
        if (!this.data('selected')) {
            this.filter(darkenColor);
            $('body').css('cursor', 'pointer');
        }
    });
    time.on('mouseout', function () {
        this.unfilter();
        $('body').css('cursor', 'auto');
    });
    timeline.add(time);
});

timeline.x(147).y(204).scale(1, 1.2);

function highlightTime(time) {
    time.parent(SVG.G).children().forEach(function (node) {
        node.children()[0].opacity(0);
        node.children()[1].opacity(1);
        node.children()[2].font('fill', '#fff').filter(shadow);
        node.data('selected', false);
    });
    time.children()[0].opacity(1);
    time.children()[1].opacity(0);
    time.children()[2].font('fill', '#235255').unfilter();
    time.data('selected', true);
}

highlightTime(timeline.children()[0]);

// adds link to homepage if that's where the user came from
if ((window.location.href).includes('&home=homepage')) {
    var backToHome = draw.text('Back to home').move(37, 19).fill('#FFFFFF').size(22, 50).font('color', 'red');
    var linkHome = 'homepage.html?file=homepage';
    backToHome.linkTo(linkHome);
}

/************************* TEXT BOX AREA *****************************/
function drawTextBox() {
    var set = layoutData.textMessage;

    //make the group for the text
    var textBox = draw.group()
        .attr('id', "textBox2")
        .move(size.vbX, size.vbY + size.vbHeight - set.height);

    //background for the text area
    textBox.rect(size.vbWidth, set.height)
        .fill('rgb(11,19,18)');

    //background for the message
    textBox.rect(set.messageWidth, set.messageHeight)
        .attr('name', 'textMessageBg')
        .fill('none')
        .move(set.padding, set.padding + 35);

    //the lines
    textBox.line(set.messageWidth + set.padding, -1, set.messageWidth + set.padding, set.height + 1)
        .attr('name', 'vertLine')
        .stroke({
            color: set.strokeColor,
            width: set.strokeWidth
        });

    textBox.line(0, -1,size.vbWidth, 0)
        .attr('name', 'horizontalLine')
        .stroke({
            color: set.strokeColor,
            width: set.strokeWidth
        });

    //Title
    textBox.text("")
        .attr('id', "currentTP2")
        .move(set.padding, 0)
        .font(layoutData.styling.textTitle);

    //details ___ to ___
    textBox.text("")
        .attr('id', "details2")
        .move(300, 0)
        .font(layoutData.styling.textDetails);

    //message text 
    textBox.text("")
        .attr('id', "message2")
        .move(set.padding, set.padding + 35)
        .font(layoutData.styling.textMessage);

}
drawTextBox();