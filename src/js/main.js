import $ from 'jquery';
import _ from 'lodash';
import {Game} from './game.js';

function init(e){
	e.preventDefault();
	$(".start-text").remove();
	let game = new Game();
}

$(".start-button").on('click', init);
