import $ from 'jquery';
import {Game} from './game.js';

function init(e){
	e.preventDefault();
	$('.start-button').off('click');
	$('.start-button').remove();
	$('.start-text').remove();
	let game = new Game();
}

$('.start-button').on('click', init);
