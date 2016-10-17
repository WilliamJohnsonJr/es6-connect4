import $ from 'jquery';
import _ from 'lodash';
import { Board } from './board.js';
import { Computer } from './computer.js';
import { wins } from './wins.js';
import { spaceChecker } from './utilities.js';

function init(e){
	e.preventDefault();
	$('.start-button').off('click');
	$('.start-button').remove();
	$('.start-text').remove();
	let computer = new Computer();
	let gameBoard = new Board(computer);
}

$('.start-button').on('click', init);
