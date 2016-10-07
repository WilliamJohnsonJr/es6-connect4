import $ from 'jquery';
import {Board} from './board.js';

function init(e){
	e.preventDefault();
	$('.start-button').off('click');
	$('.start-button').remove();
	$('.start-text').remove();
	let gameBoard = new Board();
}

$('.start-button').on('click', init);
