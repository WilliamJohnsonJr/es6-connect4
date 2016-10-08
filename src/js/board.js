import $ from 'jquery';
import _ from 'lodash';
import {Player} from './player.js';
import {Computer} from './computer.js';
import {wins} from './wins.js';

function Board(){
// Object property and method declarations/maps
	this.turnCount = 0;
	this.turn = 'computer';
	this.checkForWin = checkForWin;
	this.dropChip = dropChip;
	let player = new Player();
	let computer = new Computer();
	//Constructs data arrays to generate board.
	this.rows = [];
	for(let y=0; y<6; y++){
		let row = [];
		for (let x=0; x<7; x++) {
			let column = [];
			row.push(column);
		}
		this.rows.push(row);
	}
	//Creates a space number for each consecutive space on the board via spaceCounter++ below. Allows for checking for wins.
	let spaceCounter = 0;
	//Generates a board that corresponds to the structure of the this.rows, row, and column arrays.
	this.rows.forEach(function(row, index){
		let rowIndex = index;
		let boardRowIndex = '.board-row-'+rowIndex;
		$('#board').append(`<div class='board-row-${index} board-row'></div>`);
		row.forEach(function(column, index){
			$(boardRowIndex).append(`<span data-column=${index} data-row=${rowIndex} data-space=${spaceCounter} data-filled="false" class="board-column space"></span>`);
			spaceCounter++;
		});
	});
	// Finds which spaces on the board have been filled, and returns an array containing all black spaces and red spaces.
	let spaceChecker = ()=>{
		let spacesObject = $('.space');
		let spacesArray = $.makeArray(spacesObject);
		let redSpaces = [];
		let blackSpaces = [];
		spacesArray.forEach(function(space){
			if ($(space).attr('data-filled')==='red'){
				redSpaces.push(Number($(space).attr('data-space')));
			} else if($(space).attr('data-filled')==='black'){
				blackSpaces.push(Number($(space).attr('data-space')));
			}
		});	
		let resultArray = [blackSpaces, redSpaces];
		return resultArray;
	};

//Thanks to http://stackoverflow.com/questions/9204283/how-to-check-whether-multiple-values-exist-within-an-javascript-array
//for this useful function, slightly modified via fat arrow notation.
	let containsAll = (needles, haystack)=>{ 
		for(let i = 0 , len = needles.length; i < len; i++){
			if($.inArray(needles[i], haystack) == -1) return false;
		}
		return true;
	};

	let checkForWin = ()=>{
		let resultArray = spaceChecker();
		let blackSpaces = resultArray[0];
		let redSpaces = resultArray[1];
		// Runs through all wins, and returns an array of false and true values based upon whether a win matches black chip locations
		let computerResults = _.map(wins, function(win) {
			return containsAll(win, blackSpaces);
		});
		// Runs through all wins, and returns an array of false and true values based upon whether a win matches red chip locations
		let playerResults = _.map(wins, function(win) {
			return containsAll(win, redSpaces);
		});
		//Checks to see if true appears in the array, and indicates if the computer has won
		if (_.includes(computerResults, true)){
			$('.space').off('click');
			alert('You Lose!');
		}
		//Checks to see if true appears in the array, and indicates if the player has won
		if (_.includes(playerResults, true)){
			$('.space').off('click');
			alert('You Win!');
		}
		//Stops game in a draw if all spaces have been filled.
		if (this.turnCount === 41){
			$('.space').off('click');
			alert('Draw!');
		}
	};

	let computerTurn = ()=>{
		if (this.turn === 'computer') {
			let spaceResults = spaceChecker();
			let redSpaces = spaceResults[1];
			let threats = [];
			//Blocks player move if player has three-in-a-row.		
			wins.forEach(function(win){
				//Creates an array into which played spots that match a win array spot may be pushed.
				let filterArray = [];
				//Cycles through each winning spot (kitten) in a win, and pushes any corresponding played
				//spot into the filterArray
				win.forEach(function(winElement){
					let kitten = winElement;
					let filteredSpots = redSpaces.filter(function(spaceElement){
						return spaceElement === kitten;
					});
					filterArray.push(filteredSpots[0]);	
				});
				//Creates a new, cleaned array that only contains integer values, no undefined values
				let cleanArray = filterArray.filter(function(element){
					return element != undefined;
				});
				//Flattens the cleanArray so that it is an array of integers, not an array of arrays of integers
				let flattenedArray = _.flatten(cleanArray);
				//Pushes the array containing matching spot values into the threats array
				threats.push(flattenedArray);
			});
			//Filters the current threats and discards any threat with less than three matches
			let filteredThreats = threats.filter(function(threatArray){
				return threatArray.length == 3;
			});
			//If any threats are on the board that have three matches with a win, the computer
			//evaluates the threats, determines the highest threat, and tries to block the player's next move
			if (filteredThreats.length > 0) {
				filteredThreats.forEach(function(highThreatArray){
					let hTArray = highThreatArray;
					let possibleWins = wins.filter(function(win){
						let wholeKitten = win;
						let result = _.difference(hTArray, wholeKitten);
						return result.length === 1;
					});
					let dangerousSpaces = [];
					//Cycles through all possibleWins, and finds the outstanding value needed to win
					possibleWins.forEach(function(win){
						let siameseKitten = win;
						let winningSpace = _.difference(hTArray, siameseKitten);
						//Pushes winning space value into dangerousSpaces array
						dangerousSpaces.push(winningSpace[0]);
					});
					for (let x=0; x<dangerousSpaces.length; x++){
						let spaceVal = dangerousSpaces[x];
						//If a dangerous space is not filled
						if ($(`.spaces[data-space=${spaceVal}]`).attr('data-filled') === 'false'){
							let tomCat = $(`.spaces[data-space=${spaceVal}]`);
							let spaceAttrVal = tomCat.attr('data-space');
							//It checks to see what row the space is on and if the row below it is filled
							//Remember that rows start at 5 at the bottom of board and top row is 0
							if (Number($(`.spaces[data-space=${spaceAttrVal}]`)) < 35){
								let spaceBelowVal = String(Number(spaceAttrVal) + 7);
								let spaceBelowFilled = $(`.spaces[data-space=${spaceBelowVal}]`).attr('data-filled');
								if (spaceBelowFilled !== 'false'){
									tomCat.trigger('click');
								}
							} else {
								tomCat.trigger('click');
							}
						}
					}
				});
			} else {
				pickRandomSpace();
			}
		}
	};

	let pickRandomSpace = ()=>{
		let q = Math.floor(Math.random() * 7);
		let pickSpacesObject;
		pickSpacesObject = $(`.space[data-column=${q}]`);			
		let pickSpacesArray = $.makeArray(pickSpacesObject);
		let topSpace = pickSpacesArray[0];
		let filled = $(topSpace).attr('data-filled');
		if (filled ==='false'){				
			$(topSpace).trigger('click');	
		} else {
			pickRandomSpace();
		}
	};

	let dropChip = (e)=>{
		e.preventDefault();
		let chipColor;
		let turnChange;
		if (this.turn === 'computer'){
			chipColor = computer.chip;
			turnChange = 'player';
		} else if (this.turn === 'player') {
			chipColor = player.chip;
			turnChange = 'computer';
		}
		let target = e.target;
		let column = $(target).attr('data-column');
		//Grabs all dom elements with the same column as the event target and puts them in an array.
		let columnArray = [];
		let jQObject = $(`.space[data-column=${column}]`);
		//Transforms jQuery Object into a JS Array.
		columnArray = $.makeArray(jQObject);
		//Reverses array so that a forEach can be run to check and see if spaces are filled from the bottom of
		//the board up.
		columnArray = columnArray.reverse();
		//Drops chip into selected board column.
		for (let x=0; x<6; x++){
			let filledStatus = $(columnArray[x]).attr('data-filled');
			filledStatus = (filledStatus !== 'false');
			if (!filledStatus) {
				$(columnArray[x]).attr('data-filled', chipColor);
				$(columnArray[x]).css('background', chipColor);
				//Stops for loop once chip has been dropped.
				checkForWin();
				this.turn = turnChange;
				this.turnCount++;
				computerTurn();
				return;
			}
		}
	};

	function hoverShade (e) {
		e.preventDefault();
		let target = e.target;
		if ($(target).attr('data-filled') === 'false'){
			$(target).css('background', 'lightgrey');
		}
	}

	function removeShade(e){
		e.preventDefault();
		let target = e.target;
		if ($(target).attr('data-filled') === 'false'){
			$(target).css('background', 'white');
		}		
	}

	// Adds a click event listener to each column on the board.
	for(let x=0; x<7; x++){
		$(`.space[data-column=${x}]`).on({click: dropChip, mouseenter: hoverShade, mouseleave: removeShade});
	}

	computerTurn();
}
export {Board};