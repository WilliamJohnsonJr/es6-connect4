import $ from 'jquery';
import _ from 'lodash';
import {Player} from './player.js';
import {Computer} from './computer.js';

function Board(){
// Object property and method declarations/maps
	this.turnCount = 0;
	this.turn = 'computer';
	this.takeTurn = takeTurn;
	this.checkForWin = checkForWin;
	this.dropChip = dropChip;
	let player = new Player();
	let computer = new Computer();

	//Constructs data arrays for board data
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

	let takeTurn = ()=>{
		if (this.turn='computer'){
			computer.computerTurn();
			this.turnCount++;
			this.turn='player';
		} else if (this.turn='player'){
			player.playerTurn();
			this.turn='computer';
			this.turnCount++;
		}
	};

	let checkForWin = ()=>{

	};

	let dropChip = (e)=>{
		e.preventDefault();
		let chipColor;
		if (this.turn === "computer"){
			chipColor = computer.chip;
		} else if (this.turn === "player") {
			chipColor = player.chip;
		}
		let target = e.target;
		let column = $(target).attr('data-column');
		//Grabs all dom elements with the same column as the event target and puts them in an array.
		let columnArray = []
		let jQObject = $(`.space[data-column=${column}]`);
		//Transforms jQuery Object into a JS Array.
		columnArray = $.makeArray(jQObject);
		//Reverses array so that a forEach can be run to check and see if spaces are filled from the bottom of
		//the board up.
		columnArray = columnArray.reverse();
		//Drops chip into selected board column.
		for (let x=0; x<6; x++){
			let filledStatus = $(columnArray[x]).attr('data-filled');
			filledStatus = (filledStatus !== "false");
			if (!filledStatus) {
				$(columnArray[x]).attr('data-filled', chipColor);
				$(columnArray[x]).css('background', chipColor);
				//Stops for loop once chip has been dropped.
				return;
			}
		}
	}

	function hoverShade (e) {
		e.preventDefault();
		let target = e.target;
		if ($(target).attr('data-filled') === 'false'){
			$(target).css('background', 'lightgrey');
		};	
	}

	function removeShade(e){
		e.preventDefault();
		let target = e.target;
		if ($(target).attr('data-filled') === 'false'){
			$(target).css('background', 'white');
		};		
	}

	// Adds a click event listener to each column on the board.
	for(let x=0; x<7; x++){
		$(`.space[data-column=${x}]`).on({click: dropChip, mouseenter: hoverShade, mouseleave: removeShade});
	}

}
export {Board};