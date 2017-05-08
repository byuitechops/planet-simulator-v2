'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ANIMATION_DURATION = 250;

// START
getCSV(function (err, csvData) {
	if (err) {
		console.log("couldn't get csv data");
		//		window.location.search = "?file=test"
	} else {
		var main = new Main(csvData);
		// while main is in scope, I need to give it access to the outside world
		$('[data-phase]').click(function () {
			main.onClick($(this).attr('data-phase'));
		});
	}
});

/* King of the world */

var Main = function () {
	/*
  * Properties
  *   animator    {Animator} - We will only ever create on of these
  *   isAnimating {Boolean}  - tells us if we are busy animating
  *   csvData     {Object}   - contains all the information we got from the csv
  */

	function Main(csvData) {
		_classCallCheck(this, Main);

		this.csvData = csvData;
		console.log(this.csvData);
		// set the forcer
		this.setForcer(csvData[0]);
		// Create an instance of the Animate Class
		this.animator = new Animator(csvData);
		this.isAnimating = false;
		this.bindInput();
	}

	_createClass(Main, [{
		key: 'setForcer',
		value: function setForcer() {
			var arr = this.csvData[0];
			var bools = [arr.mountain, arr.volcano, arr.weatheringCBurial || arr.sediment, arr.weatheringCRelease, arr.insolation].map(Boolean);
			var thereWasAtLeastOne = false;
			bools.forEach(function (isActive, i) {
				if (isActive) {
					thereWasAtLeastOne = true;
					var group = forcers.children()[i];
					group.children()[0].opacity(0);
					group.children()[1].opacity(1);
					group.children()[2].font(layoutData.styling["normal"]).font({ weight: 400 }).filter(shadow);
				}
			});
			if (!thereWasAtLeastOne) {
				forcers.opacity(0);
				draw.text(function (add) {
					var text = arr.other.split("_2");
					add.tspan(text[0]);
					if (text.length == 2) {
						add.tspan('2').dy(8).font({ size: 30 });
						add.tspan(text[1]).dy(-8);
					}
				}).font(layoutData.styling["normal"]).font({ size: 45, anchor: 'middle' }).move(480, 120).filter(shadow);
			}
		}

		/* Somehow this is called when one of the time periods is clicked */

	}, {
		key: 'onClick',
		value: function onClick(newPhase) {
			// Check if we are already doing something
			if (this.isAnimating) {
				return;
			}
			// well we are doing something now
			this.isAnimating = true;

			// pass the information to the Animator Object
			this.animator.run(newPhase, this.done.bind(this));
		}

		// clean up when the animator is finished

	}, {
		key: 'done',
		value: function done() {
			this.isAnimating = false;
			//		console.log("Touch Down!")
		}

		// allow me to press numbers to go to time period

	}, {
		key: 'bindInput',
		value: function bindInput() {
			$(window).keydown(function (e) {
				e.preventDefault(); // we are selfish
				if (e.which >= 49 && e.which <= 53) this.onClick(e.which - 49);
				return;12;
			}.bind(this));
		}
	}]);

	return Main;
}();

/* Runs all of the animations */


var Animator = function () {
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

	function Animator(csvData) {
		var _this = this;

		_classCallCheck(this, Animator);

		// save the csv Data
		this.csvData = csvData;
		this.currentTP = 0;
		// create an instance of the spotlightStage
		this.stage = new SpotlightStage();
		// create an instance of the Text Controller
		this.txtControl = new TextController();
		this.txtControl.setTimePeriod(this.currentTP);
		this.animatedObjects = [];

		// create all the animated Objects
		imageData.forEach(function (image) {
			// get all of the csv data relevant to this AO
			var relevantData = csvData.map(function (TP) {
				return TP[image.name];
			});
			// create the AO
			var tempAO = new AnimatedObject(image, relevantData);
			// and add it too our collection
			_this.animatedObjects.push(tempAO);
		});

		// create all the Time Period Transitions
		var numTP = timeline.children().length;
		this.TPTransitions = [];
		for (var TP = 0; TP < numTP; TP++) {
			this.TPTransitions.push(new TimePeriodTransition(TP, this.animatedObjects, this.txtControl, this.stage));
		}
	}

	/* The main run function that is called after the user clicks on a time period */


	_createClass(Animator, [{
		key: 'run',
		value: function run(newTP, callback) {
			this.callback = callback;

			// if going backwards just set state
			if (newTP <= this.currentTP) {
				this.setState(newTP);
				this.callback();
				return;
			}

			var start = +this.currentTP + 1;

			// turn on spotlight
			this.stage.dimLights();

			// Run all of the objects by chaining their promises together
			var runLikeTheWind = this.TPTransitions[start].run();
			for (var i = start + 1; i <= newTP; i++) {
				runLikeTheWind = runLikeTheWind.then(this.TPTransitions[i].run.bind(this.TPTransitions[i]));
			} // Then to finish things off
			runLikeTheWind.then(this.done.bind(this)).catch(function () {
				console.log("Someone wasn't happy");
				this.setState(this.currentTP);
				this.done();
			}.bind(this));

			// And Finnally (Even though this will happen before the animations)
			this.currentTP = newTP;
		}
	}, {
		key: 'setState',
		value: function setState(newTP) {
			this.currentTP = newTP;
			// run through the list of animated objects
			this.animatedObjects.forEach(function (AO) {
				return AO.setState(newTP);
			});
			highlightTime(timeline.children()[this.currentTP]);
		}
	}, {
		key: 'done',
		value: function done() {

			// turn off spotlight
			this.stage.undimLights();

			// disable the txtBox
			this.txtControl.removeText();
			this.txtControl.setTimePeriod(this.currentTP);
			this.txtControl.disable();

			this.callback();
		}
	}]);

	return Animator;
}();

/* Responsible for a single timePeriod walkthrough */


var TimePeriodTransition = function () {
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

	function TimePeriodTransition(periodNumber, animatedObjects, textController, stage) {
		_classCallCheck(this, TimePeriodTransition);

		// save the passed data
		this.targetTP = periodNumber;
		this.animatedObjects = animatedObjects;
		this.txtControl = textController;
		this.stage = stage;
		// create the list of animations that need to happen
		this.makeFilteredList();
		// map those objects into functions that return promises
		this.chunks = this.filteredList.map(this.createAnimationChunk.bind(this));
	}

	_createClass(TimePeriodTransition, [{
		key: 'run',
		value: function run() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				// I know this is an odd way of doing it, but hey it works
				_this2.resolve = resolve;
				_this2.reject = reject;

				// Pass control of the buttons to this TPT
				_this2.bindInputs();

				// set the textBoxController's title to the periodName
				_this2.txtControl.setTimePeriod(_this2.targetTP);
				_this2.currentIndex = 0;
				// call the first function in the array to start the animations
				_this2.chunks[_this2.currentIndex]();

				highlightTime(timeline.children()[_this2.targetTP]);
			});
		}

		/* manage all of my event lisenters */

	}, {
		key: 'bindInputs',
		value: function bindInputs() {
			// remove previous control
			$("#next").off("click");
			$("#prev").off("click");
			$("#terminate").off("click");
			$(document).off('keydown');

			// give us all the power
			$("#next").click(this.goToNext.bind(this));
			$("#prev").click(this.goToBack.bind(this));
			$("#terminate").click(this.terminate.bind(this));

			// cause arrow keys are cool
			$(document).keydown(function (e) {
				e.preventDefault(); // we are selfish
				if (e.which == 39) this.goToNext();else if (e.which == 37 && this.currentIndex != 0) this.goToBack();else if (e.which == 13) // enter
					this.terminate();
				return;
			}.bind(this));
		}
	}, {
		key: 'terminate',
		value: function terminate() {
			$("#next").off("click");
			$("#prev").off("click");
			$("#terminate").off("click");
			$(document).off('keydown');
			this.isWaiting = false;
			this.reject();
		}

		/* Creates the 2d array of animations that need to happen from the csv */

	}, {
		key: 'makeFilteredList',
		value: function makeFilteredList() {
			var _this3 = this;

			// return a 2d list of animation objects
			this.filteredList = this.animatedObjects
			// filter out the zeros and nulls
			.filter(function (AO) {
				return AO.TPdata[_this3.targetTP].timing;
			})
			// creates the 2d array and sorts them
			.reduce(function (chunks, AO) {
				var timing = AO.TPdata[_this3.targetTP].timing;
				if (chunks[timing]) {
					// if someone is already in our spot
					chunks[timing].push(AO); // add to thier array
				} else {
					chunks[timing] = [AO]; // else create a new array
				}
				return chunks;
			}, [])
			// gets rid of any holes in our array (like the 0th element)
			.filter(function (AOarray) {
				return AOarray;
			});
		}

		/* Creates the promise chain that walks through all of the steps of a single chunk*/

	}, {
		key: 'createAnimationChunk',
		value: function createAnimationChunk(animatedObjectArray) {
			// return a function that returns a PromiseChain
			// The promiseChain will pass the big ol' animatedObjectArray through each
			// the .bind() function makes it so that i can use 'this' in the

			return function () {
				return this.txtControl.removeText(animatedObjectArray) // clean up the text box
				.then(this.stage.move.bind(this.stage)) // move the spotlight
				.then(this.txtControl.displayText.bind(this.txtControl)) // display the text
				.then(this.runArray.bind(this)) // run the Array of animations
				.then(this.cleanUp.bind(this)); // cleanUp
			}.bind(this);
		}

		/* called after the animation runs to prep for the next one */

	}, {
		key: 'cleanUp',
		value: function cleanUp() {
			if (this.isWaiting == false) {
				// set the 'isWaiting' to false
				this.isWaiting = true;
				// make the 'next' button clickable, and if the back button should be enabled
				this.txtControl.enable(this.currentIndex == 0);
			}
		}

		/* called when they click the 'next' or 'back' button */

	}, {
		key: 'goToNext',
		value: function goToNext() {
			//		console.log("---")
			// if 'isWaiting' is true
			if (this.isWaiting) {
				// not waiting anymore
				this.isWaiting = false;
				this.txtControl.disable();
				this.currentIndex++;
				// call the next function in our array if there is one
				if (this.currentIndex < this.chunks.length) this.chunks[this.currentIndex]();else this.resolve();
			}
		}

		/* called when they click the 'next' or 'back' button */

	}, {
		key: 'goToBack',
		value: function goToBack() {
			//		console.log("---")
			// if 'isWaiting' is true
			if (this.isWaiting) {
				// not waiting anymore
				this.isWaiting = false;
				// we are backing up
				// so we want to watch the animations we have already done again,
				// so we have to reset the one that we just finished
				this.resetAnimations(this.currentIndex--);
				this.resetAnimations(this.currentIndex);

				this.txtControl.disable();
				// call the next function in our array
				this.chunks[this.currentIndex]();
			}
		}

		/* run all of the animations at the same time */

	}, {
		key: 'runArray',
		value: function runArray(animatedObjectArray) {
			var _this4 = this;

			// return a promise which resolves when we are done counting callbacks
			return new Promise(function (resolve, reject) {

				var animationsLeft = animatedObjectArray.length;

				animatedObjectArray.forEach(function (AO) {
					// Counting callbacks even though they should be the same duration
					AO.animateToState(_this4.targetTP, function () {
						animationsLeft--;
						if (animationsLeft == 0) {
							resolve(animatedObjectArray);
						}
					});
				});
			});
		}
	}, {
		key: 'resetAnimations',
		value: function resetAnimations(index) {
			var _this5 = this;

			this.filteredList[index].forEach(function (AO) {
				return AO.setState(_this5.targetTP - 1);
			});
		}
	}]);

	return TimePeriodTransition;
}();

/* Keeps all of its messy frames, states, and pixels to itself */


var AnimatedObject = function () {
	/*
  * Properties
  *    currentState {Integer} - The state we are showing from 0 to 4
  *    currentFrame {Integer} - For animations that have multiple frames
  *    imageData    {Object}  - Contains all of the info from the json file
 *	  forcer       {String}  - I still don't know what this is
 *	  TPdata       {Object}  - The relevant data from the csvData
  */

	function AnimatedObject(imageData, csvData) {
		_classCallCheck(this, AnimatedObject);

		this.imageData = imageData;
		this.forcer = csvData.shift();
		this.TPdata = csvData;
		this.itemsPerFrame = this.imageData.items / 5;
		this.setState(0);
	}

	_createClass(AnimatedObject, [{
		key: 'animateToState',
		value: function animateToState(state, callback) {
			var _this6 = this;

			// if they are trying to make us animate backwards, just skip to it
			if (state <= this.currentState) {
				this.setState(state);
				callback();
				return;
			}
			// run through all of our frames
			// for some reason js dosen't have this range function
			function norm(n) {
				return n / Math.abs(n) || 0;
			}
			function range(s, e) {
				return Array(Math.abs(e - s)).fill().map(function (n, i) {
					return s + i * norm(e - s) + norm(e - s);
				});
			}
			// the list of frames that need to become visable
			var queue = [];
			// get the list of frames that need to become visable
			range(this.TPdata[this.currentState].value * this.itemsPerFrame, this.TPdata[state].value * this.itemsPerFrame).forEach(function (i) {
				queue.push({ frame: i, mac: false });
				if (_this6.imageData.macaroni.needed) {
					queue.push({ frame: i, mac: true });
				}
			});
			// double wrap the the animations so that I can turn them into a promise chain
			var promiseWrapper = function (target) {
				return function () {
					var _this7 = this;

					return new Promise(function (resolve) {
						var that = _this7; // i'll need this in a sec
						// turning on and off every single one of our images
						_this7.imageData.handle.each(function () {
							if (this.data('macaroni') == target.mac) {
								var i = this.data('frame');
								// isFrame only knows about the main animation, but macaroni meters are also being processed here
								if (that.imageData.isFrame && !target.mac) this.animate(ANIMATION_DURATION).opacity(+(i <= target.frame));else this.animate(ANIMATION_DURATION).opacity(+(i == target.frame / (this.data('macaroni') ? that.itemsPerFrame : 1))); // macaronis don't have more than one item per frame
							}
						});
						// yah this is probably the worst possible way to do this
						setTimeout(resolve, ANIMATION_DURATION);
					});
				}.bind(this);
			}.bind(this);

			queue.map(promiseWrapper) // turn the frames that need to be animated into promise functions
			.reduce(function (prev, cur) {
				return prev.then(cur);
			}, Promise.resolve()) // chain all the promise functions
			.then(callback); // then call mom
			this.currentState = state;
		}
	}, {
		key: 'setState',
		value: function setState(state) {
			// Immediately set our state to the requested one
			this.currentState = state;
			// Which frame are we trying to get to?
			var targetFrame = this.TPdata[state].value * this.itemsPerFrame;
			var that = this; // i'll need this in a sec
			// turning on and off every single one of our images
			this.imageData.handle.each(function () {
				var i = this.data('frame');
				// isFrame only knows about the main animation, but macaroni meters are also being processed here
				if (that.imageData.isFrame && !this.data('macaroni')) this.opacity(+(i <= targetFrame));else this.opacity(+(i == targetFrame / (this.data('macaroni') ? that.itemsPerFrame : 1))); // macaronis don't have more than one item per frame
			});
		}
	}]);

	return AnimatedObject;
}();

/* In charge of all the spotlights and dimming the stage */


var SpotlightStage = function () {
	/*
  * Properties
  *    isActive   {Boolean} - True if the lights are dimmed
  *    spotlights {Array}   - The Array of all our spotlights
 *	  blackVeil  {svg}     - The big black box that blackens everything
  */
	function SpotlightStage() {
		_classCallCheck(this, SpotlightStage);

		// Initalize our array
		this.spotlights = draw.mask().add(draw.rect(draw.width(), draw.height()).fill('#fff'));
		this.isActive = false;
		this.blackVeil = draw.rect(draw.width(), draw.height()).attr('visibility', 'hidden').maskWith(this.spotlights);
		this.gradient = draw.gradient('radial', function (stop) {
			stop.at(.7, 'rgba(0,0,0,1)');
			stop.at(1, 'rgba(0,0,0,0)');
		});
		this.numSpotlights = 11;
		for (var i = 0; i < this.numSpotlights; i++) {
			this.createLight();
		}
	}

	/* called when they want to start the show */


	_createClass(SpotlightStage, [{
		key: 'dimLights',
		value: function dimLights() {
			// do the magic to add the mask filter
			this.blackVeil.attr('visibility', 'visable').opacity(0).animate(ANIMATION_DURATION).opacity(.6);
			this.isActive = true;
		}

		/* called when the show ends */

	}, {
		key: 'undimLights',
		value: function undimLights() {
			// do the magic to take off the mask filter
			this.blackVeil.animate(ANIMATION_DURATION).opacity(0).attr('visibility', 'hidden');
			this.isActive = false;
		}

		/* main move function, called during the animation process */

	}, {
		key: 'move',
		value: function move(AOarray) {
			var _this8 = this;

			return new Promise(function (resolve, reject) {
				// if the lights are not dimmed, then dim them
				if (!_this8.isActive) {
					_this8.dimLights();
				}

				// turn off lights that aren't needed
				_this8.turnOffLight(_this8.spotlights.children().filter(function (node) {
					return node.opacity();
				}).length - AOarray.length - 1);

				// for each animatedObject in the array move a coorsponding spotlight
				AOarray.forEach(function (AO, i) {
					var targ = AO.imageData.bounds;
					_this8.spotlights.children()[i + 1].animate(ANIMATION_DURATION).opacity(1).move(targ.x, targ.y).radius(targ.width / 2, targ.height / 2).after(function () {
						return resolve(AOarray);
					});
				});
			});
		}

		/* add a spotlight to our array */

	}, {
		key: 'createLight',
		value: function createLight() {
			// initalize a new spotlight and add it
			this.spotlights.add(draw.ellipse(100, 100).x(100).y(100).fill(this.gradient).opacity(0));
		}

		/* remove a spotlight from our array */

	}, {
		key: 'turnOffLight',
		value: function turnOffLight(num) {
			// remove the lagger
			var visable = this.spotlights.children().filter(function (node) {
				return node.opacity();
			}).reverse();
			for (var i = 0; i < num; i++) {
				visable[i].animate(ANIMATION_DURATION).opacity(0);
			}
		}
	}]);

	return SpotlightStage;
}();

/* Controls the annotations on the screen */


var TextController = function () {
	/*
  * Properties
  *    isActive         {Boolean} - True if they are able to press 'next' or 'back'
  *    currentTP        {Integer} - The current TP we are working on
  */

	function TextController() {
		_classCallCheck(this, TextController);

		// initalize out private properties
		this.disable();
		this.Times = ["Initial", "100-100 Years", "100 Thousand Years", "1 Million Years", "10 Million Years"];
	}

	/* displays the text from the animated Object */


	_createClass(TextController, [{
		key: 'displayText',
		value: function displayText(AOarray) {
			var _this9 = this;

			return new Promise(function (resolve, reject) {
				// display the text
				$("#message").text(AOarray[0].TPdata[_this9.currentTP].text);
				document.getElementById("details").innerHTML = AOarray[0].imageData.label + ' <span>' + (AOarray[0].TPdata[AOarray[0].currentState].value + 1) + ' &#11157; ' + (AOarray[0].TPdata[_this9.currentTP].value + 1) + '</span>';
				resolve(AOarray);
			});
		}

		/* removes the text from the text box */

	}, {
		key: 'removeText',
		value: function removeText(animatedObjectArray) {
			var _this10 = this;

			return new Promise(function (resolve, reject) {
				// we don't need the animatedObjectArray but just need to carry on the promise chain
				$("#message").text("");
				$("#details").text("");

				// also make sure that 'isActive' is set to false
				_this10.isActive = "false";

				resolve(animatedObjectArray);
			});
		}

		/* makes the buttons clickable */

	}, {
		key: 'enable',
		value: function enable(disableBackButton) {
			// also set 'isActive' to true
			this.isActive = true;
			// So that they can't go before the first animation
			if (!disableBackButton) {
				$("#prev").prop("disabled", false);
			}
			$("#next").prop("disabled", false);
			$("#terminate").prop("disabled", false);
		}

		/* makes the buttons not clickable */

	}, {
		key: 'disable',
		value: function disable() {
			// also set 'isActive' to false
			this.isActive = false;
			$("#prev").prop("disabled", true);
			$("#next").prop("disabled", true);
			$("#terminate").prop("disabled", true);
		}

		/* Set the title of our text box to the time period's name */

	}, {
		key: 'setTimePeriod',
		value: function setTimePeriod(currentTP) {
			this.currentTP = currentTP;
			var phaseTitle = this.Times[this.currentTP];
			$("#currentTP").text(phaseTitle);
		}
	}]);

	return TextController;
}();
