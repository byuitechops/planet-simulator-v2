/*eslint-env es6, browser*/
/*eslint no-console:0, no-unused-vars:0*/
/*global $, getCSV, layoutData, imageData, forcers, shadow, draw, timeline, highlightTime, paramACircle, SVG*/

const ANIMATION_DURATION = 100;


// START
getCSV((err, csvData) => {
    if (err) {
        console.log("couldn't get csv data")
        //		window.location.search = "?file=test"

    } else {
        var main = new Main(csvData)
        // while main is in scope, I need to give it access to the outside world
        $('[data-phase]').click(function () {
            main.onClick($(this).attr('data-phase'))
        })
    }
})

/* King of the world */
class Main {
    /*
     * Properties
     *   animator    {Animator} - We will only ever create on of these
     *   isAnimating {Boolean}  - tells us if we are busy animating
     *   csvData     {Object}   - contains all the information we got from the csv
     */

    constructor(csvData) {
        this.csvData = csvData
        // set the forcer
        this.setForcer(csvData[0])
        // Create an instance of the Animate Class
        this.animator = new Animator(csvData)
        this.isAnimating = false;
        this.bindInput()
    }

    setForcer() {
        var arr = this.csvData[0]
        var bools = [arr.mountain, arr.volcano, arr.weatheringCBurial || arr.sediment, arr.weatheringCRelease, arr.insolation].map(Boolean)
        var thereWasAtLeastOne = false
        bools.forEach((isActive, i) => {
            if (isActive) {
                thereWasAtLeastOne = true
                var group = forcers.children()[i]
                group.children()[0].opacity(0)
                group.children()[1].opacity(1)
                group.children()[2].font(layoutData.styling["normal"]).font({
                    weight: 400
                }).filter(shadow)
            }
        })
        if (!thereWasAtLeastOne) {
            forcers.opacity(0)
            draw.text(function (add) {
                    var text = arr.other.split("_2")
                    add.tspan(text[0])
                    if (text.length == 2) {
                        add.tspan('2').dy(8).font({
                            size: 30
                        })
                        add.tspan(text[1]).dy(-8)
                    }
                })
                .font(layoutData.styling["normal"])
                .font({
                    size: 45,
                    anchor: 'middle'
                })
                .move(480, 120)
                .filter(shadow)
        }
    }

    /* Somehow this is called when one of the time periods is clicked */
    onClick(newPhase) {
        // Check if we are already doing something
        if (this.isAnimating) {
            return
        }
        // well we are doing something now
        this.isAnimating = true

        // pass the information to the Animator Object
        this.animator.run(newPhase, this.done.bind(this))
    }

    // clean up when the animator is finished
    done() {
        this.isAnimating = false
        //		console.log("Touch Down!")
    }

    // allow me to press numbers to go to time period
    bindInput() {
        $(window).keydown(function (e) {
            if (e.which >= 49 && e.which <= 53)
                this.onClick(e.which - 49)
            return;
        }.bind(this));
    }
}

/* Runs all of the animations */
class Animator {
    /*
     * Properties
     *    stage   {SpotLightStage} - An array of spotlight objects to pass on
     *    csvData         {Object} - contains all the information we got from the csv
     *	  animatedObjects  {Array} - List of all the animated objects
     *	  TPTransitions    {Array} - List of all the Time Period Transitions
     *    currentTP      {Integer} - says which Time Period we are currently on
     *    txtControl      {Object} - Manages the messages at the bottom of the screen
     *    callback        {Object} - Call mom when we are done
     */

    constructor(csvData) {
        // save the csv Data
        this.csvData = csvData
        this.currentTP = 0;
        // create an instance of the spotlightStage
        this.stage = new SpotlightStage()
        // create an instance of the Text Controller
        this.txtControl = new TextController()
        this.txtControl.setTimePeriod(this.currentTP)
        this.txtControl.displayInstructions()
        this.animatedObjects = []

        // create all the animated Objects
        imageData.forEach(image => {
            // get all of the csv data relevant to this AO
            var relevantData = csvData.map(TP => TP[image.name])
            // create the AO
            var tempAO = new AnimatedObject(image, relevantData)
            // and add it too our collection
            this.animatedObjects.push(tempAO)
        })
        // create all the Time Period Transitions
        var numTP = timeline.children().length
        this.TPTransitions = []
        for (var TP = 0; TP < numTP; TP++) {
            this.TPTransitions.push(
                new TimePeriodTransition(TP, this.animatedObjects, this.txtControl, this.stage))
        }
    }

    /* The main run function that is called after the user clicks on a time period */
    run(newTP, callback) {
        this.callback = callback
        //make it a number
        newTP = +newTP;

        // if going backwards just set state
        if (newTP === this.currentTP + 1) {

            var start = +this.currentTP + 1

            // turn on spotlight
            this.stage.dimLights()

            // Run all of the objects by chaining their promises together
            var runLikeTheWind = this.TPTransitions[start].run()
            for (var i = start + 1; i <= newTP; i++)
                runLikeTheWind = runLikeTheWind.then(this.TPTransitions[i].run.bind(this.TPTransitions[i]))

            // Then to finish things off
            runLikeTheWind
                .then(this.done.bind(this))
                .catch(function () {
                    console.log("Someone wasn't happy")
                    this.setState(this.currentTP)
                    this.done()
                }.bind(this))

            // And Finnally (Even though this will happen before the animations)
            this.currentTP = newTP
        } else {
            this.setState(newTP)
            this.txtControl.setTimePeriod(newTP)
            this.txtControl.displayInstructions()
            this.callback()
        }

    }

    setState(newTP) {
        this.currentTP = newTP
        // run through the list of animated objects
        this.animatedObjects.forEach(AO => AO.setState(newTP))
        highlightTime(timeline.children()[this.currentTP])
    }

    done() {

        // turn off spotlight
        this.stage.undimLights()

        // disable the txtBox
        this.txtControl.removeText()
        this.txtControl.setTimePeriod(this.currentTP)
        this.txtControl.displayInstructions()
        this.txtControl.disable()

        this.callback()
    }
}

/* Responsible for a single timePeriod walkthrough */
class TimePeriodTransition {
    /*
     * Properties
     *    stage  {SpotlightStage} - An array of spotlight objects to use
     *    currentIndex   {Number} - Which index we are currently at in out array
     *    isWaiting     {Boolean} - True if the 'next' button should be disabled
     *	  chunks          {Array} - An array of Functions that all return promises
     *	  targetTP       {Number} - The Time Perid we are shooting for
     *	  animatedObjects {Array} - List of all the animated objects
     *    txtControl     {Object} - Manages the messages at the bottom of the screen
     *    resolve      {Function} - Call when we are all done with our animations
     *    reject       {Function} - Call if anything goes wrong
     */

    constructor(periodNumber, animatedObjects, textController, stage) {
        // save the passed data
        this.targetTP = periodNumber
        this.animatedObjects = animatedObjects
        this.txtControl = textController
        this.stage = stage
        // create the list of animations that need to happen
        this.makeFilteredList()
        // map those objects into functions that return promises
        this.chunks = this.filteredList.map(this.createAnimationChunk.bind(this))
    }

    run() {
        return new Promise((resolve, reject) => {
            // I know this is an odd way of doing it, but hey it works
            this.resolve = resolve
            this.reject = reject

            // Pass control of the buttons to this TPT
            this.bindInputs()

            // set the textBoxController's title to the periodName
            this.txtControl.setTimePeriod(this.targetTP)
            this.currentIndex = 0
            this.isWaiting = false

            // call the first function in the array to start the animations
            this.chunks[this.currentIndex]()

            highlightTime(timeline.children()[this.targetTP])
        })
    }

    /* manage all of my event lisenters */
    bindInputs() {
        // remove previous control
        $("#next").off("click")
        $("#prev").off("click")
        $("#terminate").off("click")
        $(document).off('keydown')

        // give us all the power
        $("#next").click(this.goToNext.bind(this))
        $("#prev").click(this.goToBack.bind(this))
        $("#terminate").click(this.terminate.bind(this))

        // cause arrow keys are cool
        $(document).keydown(function (e) {
            if (e.which == 39)
                this.goToNext()
            else if (e.which == 37 && this.currentIndex != 0)
                this.goToBack()
            else if (e.which == 13) // enter
                this.terminate()
            return;
        }.bind(this));

    }

    terminate() {
        $("#next").off("click")
        $("#prev").off("click")
        $("#terminate").off("click")
        $(document).off('keydown')
        this.isWaiting = true;
        this.reject()
    }

    /* Creates the 2d array of animations that need to happen from the csv */
    makeFilteredList() {
        // return a 2d list of animation objects
        this.filteredList = this.animatedObjects
            // filter out the zeros and nulls
            .filter((AO) => {
                return AO.TPdata[this.targetTP].timing
            })
            // creates the 2d array and sorts them
            .reduce((chunks, AO) => {
                var timing = AO.TPdata[this.targetTP].timing
                if (chunks[timing]) { // if someone is already in our spot
                    chunks[timing].push(AO) // add to thier array
                } else {
                    chunks[timing] = [AO] // else create a new array
                }
                return chunks
            }, [])
            // gets rid of any holes in our array (like the 0th element)
            .filter(AOarray => AOarray)
    }

    /* Creates the promise chain that walks through all of the steps of a single chunk*/
    createAnimationChunk(animatedObjectArray) {
        // return a function that returns a PromiseChain
        // The promiseChain will pass the big ol' animatedObjectArray through each
        // the .bind() function makes it so that i can use 'this' in the

        return function () {
            return this.txtControl.removeText(animatedObjectArray) // clean up the text box
                .then(this.stage.move.bind(this.stage)) // move the spotlight
                .then(this.txtControl.displayText.bind(this.txtControl)) // display the text
                .then(this.runArray.bind(this)) // run the Array of animations
                .then(this.cleanUp.bind(this)) // cleanUp
        }.bind(this)
    }

    /* called after the animation runs to prep for the next one */
    cleanUp() {
        if (this.isWaiting == false) {
            // set the 'isWaiting' to false
            this.isWaiting = true
            // make the 'next' button clickable, and if the back button should be enabled
            this.txtControl.enable(this.currentIndex == 0)
        }
    }

    /* called when they click the 'next' or 'back' button */
    goToNext() {
        //		console.log("---")
        // if 'isWaiting' is true
        if (this.isWaiting) {
            // not waiting anymore
            this.isWaiting = false
            this.txtControl.disable()
            this.currentIndex++
                // call the next function in our array if there is one
                if (this.currentIndex < this.chunks.length)
                    this.chunks[this.currentIndex]()
            else
                this.resolve()
        }
    }

    /* called when they click the 'next' or 'back' button */
    goToBack() {
        //		console.log("---")
        // if 'isWaiting' is true
        if (this.isWaiting) {
            // not waiting anymore
            this.isWaiting = false
            // we are backing up
            // so we want to watch the animations we have already done again,
            // so we have to reset the one that we just finished
            this.resetAnimations(this.currentIndex--)
            this.resetAnimations(this.currentIndex)

            this.txtControl.disable()
            // call the next function in our array
            this.chunks[this.currentIndex]()
        }
    }

    /* run all of the animations at the same time */
    runArray(animatedObjectArray) {
        // return a promise which resolves when we are done counting callbacks
        return new Promise((resolve, reject) => {

            var animationsLeft = animatedObjectArray.length

            animatedObjectArray.forEach(AO => {
                // Counting callbacks even though they should be the same duration
                AO.animateToState(this.targetTP, () => {
                    animationsLeft--
                    if (animationsLeft == 0) {
                        resolve(animatedObjectArray)
                    }
                })
            })
        })
    }

    resetAnimations(index) {
        this.filteredList[index].forEach(AO => AO.setState(this.targetTP - 1))
    }
}

/* Keeps all of its messy frames, states, and pixels to itself */
class AnimatedObject {
    /*
     * Properties
     *    currentState {Integer} - The state we are showing from 0 to 4
     *    currentFrame {Integer} - For animations that have multiple frames
     *    imageData    {Object}  - Contains all of the info from the json file
     *	  forcer       {String}  - I still don't know what this is
     *	  TPdata       {Object}  - The relevant data from the csvData
     */

    constructor(imageData, csvData) {
        this.imageData = imageData
        this.forcer = csvData.shift()
        this.TPdata = csvData
        this.itemsPerFrame = this.imageData.items / 5
        this.setState(0)
    }

    animateToState(state, callback) {

        // if they are trying to make us animate backwards, just skip to it
        if (state <= this.currentState) {
            this.setState(state)
            callback()
            return;
        }
        // run through all of our frames
        // for some reason js dosen't have this range function
        function norm(n) {
            return n / Math.abs(n) || 0
        }

        function range(s, e) {
            return Array(Math.abs(e - s)).fill().map((n, i) => s + i * norm(e - s) + norm(e - s))
        }
        // the list of frames that need to become visable
        var queue = []
        // get the list of frames that need to become visable
        range(this.TPdata[this.currentState].value * this.itemsPerFrame, this.TPdata[state].value * this.itemsPerFrame)
            .forEach(i => {
                queue.push({
                    frame: i,
                    mac: false
                })
                if (this.imageData.macaroni.needed) {
                    queue.push({
                        frame: i,
                        mac: true
                    })
                }
            })
        // double wrap the the animations so that I can turn them into a promise chain
        var promiseWrapper = function (target) {
            return function () {
                return new Promise(resolve => {
                    var that = this // i'll need this in a sec
                    // turning on and off every single one of our images
                    this.imageData.handle.each(function () {
                        if (this.data('macaroni') == target.mac) {
                            var i = this.data('frame')
                            // isFrame only knows about the main animation, but macaroni meters are also being processed here
                            if (that.imageData.isFrame && !target.mac)
                                this.animate(ANIMATION_DURATION).opacity(+(i <= target.frame))
                            else
                                this.animate(ANIMATION_DURATION).opacity(+(i == target.frame / (this.data('macaroni') ? that.itemsPerFrame : 1))) // macaronis don't have more than one item per frame
                        }
                    })
                    // yah this is probably the worst possible way to do this
                    setTimeout(resolve, ANIMATION_DURATION)
                })
            }.bind(this)
        }.bind(this)

        queue.map(promiseWrapper) // turn the frames that need to be animated into promise functions
            .reduce((prev, cur) => prev.then(cur), Promise.resolve()) // chain all the promise functions
            .then(callback) // then call mom
        this.currentState = state
    }

    setState(state) {
        // Immediately set our state to the requested one
        this.currentState = state
        // Which frame are we trying to get to?
        var targetFrame = this.TPdata[state].value * this.itemsPerFrame
        var that = this // i'll need this in a sec
        // turning on and off every single one of our images
        this.imageData.handle.each(function () {
            var i = this.data('frame')
            // isFrame only knows about the main animation, but macaroni meters are also being processed here
            if (that.imageData.isFrame && !this.data('macaroni'))
                this.opacity(+(i <= targetFrame))
            else
                this.opacity(+(i == targetFrame / (this.data('macaroni') ? that.itemsPerFrame : 1))) // macaronis don't have more than one item per frame
        })
    }
}

/* In charge of all the spotlights and dimming the stage */
class SpotlightStage {
    /*
     * Properties
     *    isActive   {Boolean} - True if the lights are dimmed
     *    spotlights {Array}   - The Array of all our spotlights
     *	  blackVeil  {svg}     - The big black box that blackens everything
     */
    constructor() {
        //can't just add the filter to the group because firefox wiggs out but works if we add it to the spots directly
        //build the filter we will add to each of the spots
        this.filter = new SVG.Filter();
        this.filter.gaussianBlur(10);
        draw.defs().add(this.filter);
        this.filter.attr('name', 'blurForSpotlights');

        //this mask works just like in photoshop, draws the white portion
        this.mask = draw.mask().attr('name', 'spotlightsMask').add(draw.rect(size.width, size.height).fill('#fff'))
        // Initalize our group
        this.spotlights = draw.group().attr('name', 'spotlights');
        this.isActive = false
        this.blackVeil = draw.rect(draw.width(), draw.height()).attr('visibility', 'hidden').maskWith(this.mask)



        //count the total possible spotlights
        this.numSpotlights = imageData.reduce((sum, image) => sum + image.spotlights.length, 0)


        //make them all
        //each spotlight is black for the mask
        for (var i = 0; i < this.numSpotlights; i++) {
            this.createLight()
        }

        //add the spotlight group to the mask
        this.mask.add(this.spotlights);
    }

    /* called when they want to start the show */
    dimLights() {
        // do the magic to add the mask filter
        this.blackVeil.attr('visibility', 'visible').opacity(0).animate(ANIMATION_DURATION).opacity(.6)
        this.isActive = true;
    }

    /* called when the show ends */
    undimLights() {
        // do the magic to take off the mask filter
        this.blackVeil.animate(ANIMATION_DURATION).opacity(0).attr('visibility', 'hidden')
        this.isActive = false;
    }

    /* main move function, called during the animation process */
    move(AOarray) {
        return new Promise((resolve, reject) => {
            // if the lights are not dimmed, then dim them
            if (!this.isActive) {
                this.dimLights()
            }
            var spotsNeeded = AOarray.reduce((spots, AO) => {
                return spots.concat(AO.imageData.spotlights);
            }, []);

            // turn off lights that aren't needed
            this.turnOffLight(this.spotlights.children().filter(node => node.opacity()).length - spotsNeeded.length)

            //move all the spots to their correct spot
            spotsNeeded.forEach((spot, i) => {
                //var targ = AO.imageData.spotlights[0]
                this.spotlights.children()[i].animate(ANIMATION_DURATION)
                    .opacity(1)
                    .plot(spot)
                    .after(() => resolve(AOarray))
            })
        })
    }

    /* add a spotlight to our array */
    createLight() {
        // initalize a new spotlight in center of screen and add it
        //each spotlight is black for the mask to work
        var tempSpot = draw.polygon(paramACircle(size.vbWidth / 2 + size.vbX, size.vbHeight / 2 + size.vbY, 100, 100));
        tempSpot
            .fill('black')
            .opacity(0)
            .filter(this.filter);

        this.spotlights.add(tempSpot);
    }

    /* remove a spotlight from our array */
    turnOffLight(num) {
        // remove the lagger
        var visable = this.spotlights.children().filter(node => node.opacity()).reverse()
        for (var i = 0; i < num; i++) {
            visable[i].animate(ANIMATION_DURATION).opacity(0)
        }
    }
}

/* Controls the annotations on the screen */
class TextController {
    /*
     * Properties
     *    isActive         {Boolean} - True if they are able to press 'next' or 'back'
     *    currentTP        {Integer} - The current TP we are working on
     */

    constructor() {
        // initalize out private properties
        this.disable()
        this.Times = ["Initial", "100-1000 Years", "100 Thousand Years", "1 Million Years", "10 Million Years"]
    }

    /* displays the text from the animated Object */
    displayText(AOarray) {
        return new Promise((resolve, reject) => {
            // display the text
            console.log(AOarray[0].TPdata[this.currentTP])
            $("#message").text(AOarray[0].TPdata[this.currentTP].text)
            document.getElementById("details").innerHTML = `${AOarray[0].imageData.label} <span>${AOarray[0].TPdata[AOarray[0].currentState].value+1} to ${AOarray[0].TPdata[this.currentTP].value+1}</span>`
            resolve(AOarray)
        })
    }

    displayInstructions() {
        $("#message").text("Click on a time period above")
    }
    /* removes the text from the text box */
    removeText(animatedObjectArray) {
        return new Promise((resolve, reject) => {
            // we don't need the animatedObjectArray but just need to carry on the promise chain
            $("#message").text("")
            $("#details").text("")

            // also make sure that 'isActive' is set to false
            this.isActive = "false"

            resolve(animatedObjectArray)
        })
    }

    /* makes the buttons clickable */
    enable(disableBackButton) {
        // also set 'isActive' to true
        this.isActive = true
        // So that they can't go before the first animation
        if (!disableBackButton) {
            $("#prev").prop("disabled", false)
        }
        $("#next").prop("disabled", false)
        $("#terminate").prop("disabled", false)
    }

    /* makes the buttons not clickable */
    disable() {
        // also set 'isActive' to false
        this.isActive = false
        $("#prev").prop("disabled", true)
        $("#next").prop("disabled", true)
        $("#terminate").prop("disabled", true)
    }

    /* Set the title of our text box to the time period's name */
    setTimePeriod(currentTP) {
        this.currentTP = currentTP
        var phaseTitle = this.Times[this.currentTP]
        $("#currentTP").text(phaseTitle)
    }
}


//a function that draws the outlines for each spotlight
function drawSpotLightOutlines() {
    imageData.forEach(function (image) {
        image.spotlights.forEach(function (spotlight, i) {

            draw.polygon(spotlight).fill('none').stroke({
                color: '#f06',
                width: 4
            });
        })
    })
}
function drawBox() {
    draw.rect(size.vbWidth, size.vbHeight).move(size.vbX, size.vbY).fill('none').stroke({
        color: '#f06',
        width: 4
    });
}

// drawBox();
// drawSpotLightOutlines();

function drawViewBoxOutline() {
    draw.rect(1639, 888).move(30, 20).fill('none').stroke({
        color: '#f06',
        width: 3
    });
}

drawViewBoxOutline();


//var fixV = imageData[1].spotlights[0].map(function (spotPoint) {
//    return [Math.round(spotPoint[0]), Math.round(spotPoint[1])]
//})
//console.log(JSON.stringify(fixV));
