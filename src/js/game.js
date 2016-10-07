import $ from 'jquery';
import _ from 'lodash';
import {Board} from './board.js';
import {Player} from './player.js';
import {Computer, SmartComputer} from './computer.js';

function Game () {
	this.turnCount = 0;
	this.turn = "computer";
	this.takeTurn = takeTurn;
	this.checkForWin = checkForWin;
	let player = new Player();
	let computer = new Computer();
	let gameBoard = new Board();

	let takeTurn = ()=>{
		if (this.turn="computer"){
			computer.computerTurn();
			this.turnCount++;
			this.turn="player";
		} else if (this.turn="player"){
			player.playerTurn();
			this.turn="computer";
			this.turnCount++;
		}
	}

	let checkForWin = ()=>{

	}

}

export {Game};