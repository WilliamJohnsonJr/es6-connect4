import $ from 'jquery';
import _ from 'lodash';
import {wins} from './wins.js';
import {spaceChecker} from './utilities.js';

function Board(computer){
	let player = {}
	player.chip = 'red';
	computer.chip = 'black';
	// Object property and method declarations/maps
	this.turnCount = 0;
	this.turn = 'computer';
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
				if (this.turn === 'computer'){
					computer.computerTurn();
				}
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

	computer.computerTurn();	
}

export { Board };