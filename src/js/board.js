import $ from 'jquery';
function Board(){
	this.rows = [];
	for(let y=0; y<6; y++){
	 	let row = [];
		for (let x=0; x<7; x++) {
			let column = []
			row.push(column);
		}
		this.rows.push(row);
	}
	let spaceCounter = 0;
	this.rows.forEach(function(row, index){
		let rowIndex = index;
		let boardRowIndex = ".board-row-"+rowIndex;
		$("#board").append(`<div class="board-row-${index} board-row"></div>`)
		row.forEach(function(column, index){
			$(boardRowIndex).append(`<span data-column=${index} data-row=${rowIndex} data-space=${spaceCounter} data-filled="false" class="board-column space"></span>`);
			spaceCounter++;
		})
	})
	console.log(this.rows);
}
export {Board};