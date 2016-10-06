import $ from 'jquery';
function Board(){
	this.columns = [];
	 for(let y=0; y<7; y++){
	 	let column = [];
		for (let x=0; x<6; x++) {
			let rowSpace = [];
			column.push(rowSpace);
		}
		this.columns.push(column);
	 }

	this.columns.forEach(function(column, index){
		let columnIndex = index;
		let boardColumnIndex = ".board-column-"+columnIndex;
		$("#board").append(`<div class="board-column-${index} board-column">Column</div>`)
		column.forEach(function(rowSpace, index, columnIndex){
			$(boardColumnIndex).append(`<div class="row-space-${index} row-space">rowSpace</div>`)
		})
	})
}
export {Board};