import $ from 'jquery';
import _ from 'lodash';
import {Board} from './board.js';
import {Player} from './player.js';
import {Computer, SmartComputer} from './computer.js';

function Game () {
	let player = new Player();
	let gameBoard = new Board();
	console.log(player.chip);	
}

export {Game};