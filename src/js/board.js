import $ from 'jquery';
function Board(){
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
	//Runs through the arrays and generates a board that corresponds to the structure of the this.rows, row, and column arrays.
	this.rows.forEach(function(row, index){
		let rowIndex = index;
		let boardRowIndex = '.board-row-'+rowIndex;
		$('#board').append(`<div class='board-row-${index} board-row'></div>`);
		row.forEach(function(column, index){
			$(boardRowIndex).append(`<span data-column=${index} data-row=${rowIndex} data-space=${spaceCounter} data-filled="false" class="board-column space"></span>`);
			spaceCounter++;
		});
	});
}
export {Board};