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
		let resultArray = [blackSpaces, redSpaces]
		return resultArray;
	}

	let checkForWin = ()=>{
		let resultArray = spaceChecker();
		let blackSpaces = resultArray[0];
		let redSpaces = resultArray[1];

		if (this.turn === 'computer'){
			wins.forEach(function(win){
				if (blackSpaces.includes(win[0])){
					if (blackSpaces.includes(win[1])){
						if (blackSpaces.includes(win[2])){
							if (blackSpaces.includes(win[3])){
								$('.space').off('click');
								alert('You Lose!');
							}
						}
					}
				}
			})
		}
		if (this.turn === 'player'){
			wins.forEach(function(win){
				if (redSpaces.includes(win[0])){
					if (redSpaces.includes(win[1])){
						if (redSpaces.includes(win[2])){
							if (redSpaces.includes(win[3])){
								$('.space').off('click');
								alert('You Win!');
							}
						}
					}
				}
			})
		}
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
			let blockMove = wins.forEach(function(win){
				if (redSpaces.includes(win[0])){
					if (redSpaces.includes(win[1])){
						if (redSpaces.includes(win[2])){
							return win[3];
						} else {
							return -1;
						}
					}
				}
			})
			let winMove = wins.forEach(function(win){
				if (blackSpaces.includes(win[0])){
					if (blackSpaces.includes(win[1])){
						if (blackSpaces.includes(win[2])){
							return win[3];
						} else {
							return -1;
						}
					}
				}
			})
			let pickSpacesObject;
			if (blockMove >= 0) {
				let q = blockMove;
				pickSpace = $(`.space[data-space=${q}]`).trigger('click');
			} else if (winMove >= 0){
				let q = winMove;
				pickSpace = $(`.space[data-space=${q}]`).trigger('click');
			} else {
				let q = Math.floor(Math.random() * 7);
				pickSpacesObject = $(`.space[data-column=${q}]`);			
				let pickSpacesArray = $.makeArray(pickSpacesObject);
				$(pickSpacesArray[0]).trigger('click');
			}
		}
	}

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