import $ from 'jquery';
import { Board } from './board.js';
import { Computer } from './computer.js';

function init(e){
	e.preventDefault();
	$('.start-button').off('click');
	$('.start-button').remove();
	$('.start-text').remove();
	let computer = new Computer();
	let gameBoard = new Board(computer);
}

$('.start-button').on('click', init);
