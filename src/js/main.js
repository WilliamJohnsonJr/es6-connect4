import $ from 'jquery';
import _ from 'lodash';
import {Board} from './board.js';
import {Player} from './player.js';

function init(){
	let gameBoard = new Board();
	let player = new Player();
	console.log(player.chip);	
}

init();
