import { wins } from './wins.js';
import _ from 'lodash';
import $ from 'jquery';
import { spaceChecker } from './utilities.js';

function Computer () {
	this.computerTurn = computerTurn;
}

let computerTurn = ()=>{
	//Checks to see which spaces have been played
	let spaceResults = spaceChecker();
	//Places all black spaces in an array
	let blackSpaces = spaceResults[0];
	//Places all red spaces in an array
	let redSpaces = spaceResults[1];
	let threats = [];
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

	let getThreats = () => {
		wins.forEach(function(win){
			//Creates an array into which played spots that match a win array spot may be pushed
			let filterArray = [];
			//Cycles through each winning spot (kitten) in a win, and pushes any corresponding played
			//spot into the filterArray
			win.forEach(function(winElement){
				let kitten = winElement;
				let filteredSpots = redSpaces.filter(function(spaceElement){
					return spaceElement === kitten;
				});
				filterArray.push(filteredSpots);	
			});
			//Flattens the filterArray so that it is an array of integers, not an array of arrays of integers
			let flattenedArray = _.flatten(filterArray);
			//Pushes the array containing matching spot values into the threats array
			threats.push(flattenedArray);
		});				
	};

	let filterThreats = () => {
	//Filters the current threats and discards any threat with less than three matches
		let filteredThreats = threats.filter(function(threatArray){
			return threatArray.length == 3;
		});
		threats = filteredThreats;
	};

	let evaluateAndMakeMove = () => {
		//If any threats are on the board that have three matches with a win array, the computer
		//evaluates the threats, determines the highest threat, and tries to block the player's next move
		if (threats.length > 0) {
			//Cycles through all possibleWins and finds the outstanding, unfilled spaces needed to win
			let possibleWins = [];
			let dangerousSpaces = [];
			threats.forEach(function(highThreatArray){
				let hTArray = highThreatArray;
				let winsToWatch = wins.filter(function(win){
					let wholeKitten = win;
					let result = _.difference(wholeKitten, hTArray);
					if ((result.length === 1) && !(blackSpaces.includes(result[0]))){
						dangerousSpaces.push(result);	
					}
					return result.length === 1;
				});
				possibleWins.push(winsToWatch);
			});
			possibleWins = _.flatten(possibleWins);
			dangerousSpaces = _.flatten(dangerousSpaces);
			dangerousSpaces = _.uniq(dangerousSpaces);
			//If no dangerousSpace exists, computer picks random space
			if (dangerousSpaces.length < 1){
				window.setTimeout(pickRandomSpace, 1000);
			} else {
				//Runs through the dangerousSpaces to see if the space below each one is filled. 
				//If the space below a dangerousSpace is filled, the computer uses its turn to take
				//that dangerousSpace before the player can.
				let gamePoints = [];
				dangerousSpaces.forEach(function(dangerousSpace){
					let spaceVal = dangerousSpace;
					let tomCat = $(`.space[data-space=${spaceVal}]`);
					let spaceAttrVal = tomCat.attr('data-space');
					//It checks to see what row the space is on and if the row below it is filled
					//Remember that rows start at 5 at the bottom of board and top row is 0
					if (Number(spaceAttrVal) < 35){
						let spaceBelowVal = String(Number(spaceAttrVal) + 7);
						let spaceBelowFilled = $(`.space[data-space=${spaceBelowVal}]`).attr('data-filled');
					//If the space below the dangerous space is filled, the computer notes that space
					//as a gamePoint.
						if (spaceBelowFilled !== 'false'){
							gamePoints.push(spaceAttrVal);
						} 
					} else {
						gamePoints.push(spaceAttrVal);
					}
				});
				//If any player gamePoints are open, the computer blocks. Otherwise, it picks a random space.
				if (gamePoints.length > 0){
					let clicker = () =>{
						let tomCat = $(`.space[data-space=${gamePoints[0]}]`);
						tomCat.trigger('click');
					};
					window.setTimeout(clicker, 1000);
				} else {
					window.setTimeout(pickRandomSpace, 1000);
				}
			}
		} else {
			//If no threat is detected, the computer picks a random space.
			window.setTimeout(pickRandomSpace, 1000);
		}
	};
	//Blocks player move if player has three-in-a-row
	getThreats();
	filterThreats();
	evaluateAndMakeMove();	
};

export { Computer };