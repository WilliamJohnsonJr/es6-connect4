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
		//If true appears in the array, the computer has won		
		if (_.includes(computerResults, true)){
			$('.space').off('click');
			alert('You Lose!');
		}
		//If true appears in the array, the player has won
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
			let blackSpaces = spaceResults[0];
			//Blocks player move if player has three-in-a-row.
			let blockMove = [];
			wins.map(function(win){
				if (redSpaces.includes(win[0])){
					if (redSpaces.includes(win[1])){
						if (redSpaces.includes(win[2])){
							blockMove.push(win[3]);
						}
					}
				}
			});
			//Goes for win if black has three-in-a-row
			let winMove = [];
			wins.forEach(function(win){
				if (blackSpaces.includes(win[0])){
					if (blackSpaces.includes(win[1])){
						if (blackSpaces.includes(win[2])){
							winMove.push(win[3]);
						}
					}
				}
			});
			if (blockMove[0] >= 0) {				
				let q = blockMove[0];
				let pickSpacesObject;
				let column = $(`.space[data-space=${q}]`).attr('data-column');
				pickSpacesObject = $(`.space[data-column=${column}]`);			
				let pickSpacesArray = $.makeArray(pickSpacesObject);
				let topSpace = pickSpacesArray[0];
				let filled = $(topSpace).attr('data-filled');
				if (filled ==='false'){				
					$(`.space[data-space=${q}]`).trigger('click');
				} else {
					pickRandomSpace();
				}
			} else if (winMove[0] >= 0){
				let q = winMove[0];
				let pickSpacesObject;
				let column = $(`.space[data-space=${q}]`).attr('data-column');
				pickSpacesObject = $(`.space[data-column=${column}]`);			
				let pickSpacesArray = $.makeArray(pickSpacesObject);
				let topSpace = pickSpacesArray[0];
				let filled = $(topSpace).attr('data-filled');
				if (filled ==='false'){				
					$(`.space[data-space=${q}]`).trigger('click');
				} else {
					pickRandomSpace();
				}
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