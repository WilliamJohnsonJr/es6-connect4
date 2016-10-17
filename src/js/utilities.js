import $ from 'jquery';

// Finds which spaces on the board have been filled, and returns an array containing all black spaces and red spaces.
function spaceChecker () {
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
}

export { spaceChecker };