"use strict";

$(document).ready(function () {
	var tiles;
	var attempts;
	var elapsedTime;
	var matches;
	var remainingMatches;
	var startTime;
	var counter;
	var clickedFirst;
	var clickedSecond;
	var timer;
	var flipImgTimer;

	tiles = []; //tiles array
	var i; //index 

	for (i = 1; i <=32 ; ++i) {
		tiles.push({
			tileNum: i, 
			src: 'img/tile' + i + '.jpg',
			flipped: false
		});
	}
	resetGame();
	$('#reset').click(resetGame);
	$('#modalPlayAgain').click(resetGame);

	function resetGame() {
		attempts = 0;
		$('#attempts').text('0');

		elapsedTime = 0;
		$('.elapsedTime').text('0');
		startTime = _.now();
		timer = window.setInterval(onTimer, 1000);

		matches = 0;
		$('#matches').text('0');

		remainingMatches = 8; 
		$('#remainingMatches').text('8');


		var shuffledTilesAll = _.shuffle(tiles);
		var selectedTiles = shuffledTilesAll.slice(0, 8);
		for (var i = 0; i < 8; i++) {
			selectedTiles.push(_.clone(selectedTiles[i])); 
		}
		var shuffledSelectedTiles = _.shuffle(selectedTiles);

		var gameBoard = $('#gameBoard');
		gameBoard.empty(); 

		for (var i = 0; i < shuffledSelectedTiles.length; i++) {
			var currentTileInfo = shuffledSelectedTiles[i];
			var newTile = $(document.createElement('img'));
			newTile.attr({
				src: 'img/tile-back.png', 
				alt: 'image of tile ' + currentTileInfo.tileNum
			});
			newTile.data('tileInfo', currentTileInfo);
			console.log(currentTileInfo);
			gameBoard.append(newTile);
		}
		$('#gameBoard img').click(flipImg);
		counter = 0;
	}

	function onTimer() {
		var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
		$('.elapsedTime').text(elapsedSeconds);
	}

	function flipImg() {
		if (counter == 2) {
			return;
		}
		var clickedImage = $(this);

		if (clickedImage.data('tileInfo').flipped == true) {
			return;
		}
		clickedImage.data('tileInfo').flipped = true;

		counter++;
		var currentTileInfo = clickedImage.data('tileInfo'); //use same key

		clickedImage.fadeOut(100, function() {
			clickedImage.attr('src', currentTileInfo.src).fadeIn(100);
			clickedImage.css('cursor', 'default');
		});

		if (counter == 1) {
			clickedFirst = clickedImage;
		} else { //counter == 2
			clickedSecond = clickedImage;

			if (clickedFirst.data('tileInfo').tileNum != clickedSecond.data('tileInfo').tileNum) {
				attempts = attempts + 1;
				$('#attempts').text(attempts);
				flipImgTimer = window.setInterval(flipBack, 1000);
			} else {
				counter = 0;

				matches = matches + 1;
				$('#matches').text(matches);

				remainingMatches = remainingMatches - 1; 
				$('#remainingMatches').text(remainingMatches);
			}
		}

		if (remainingMatches == 0) { //won the game!
			window.clearInterval(timer);
			$('#myModal').modal();
		}
	}

	function flipBack() {
		counter = 0;
		clickedFirst.attr('src', 'img/tile-back.png');
		clickedFirst.data('tileInfo').flipped = false;
		clickedFirst.css('cursor', 'pointer');

		clickedSecond.attr('src', 'img/tile-back.png');
		clickedSecond.data('tileInfo').flipped = false;
		clickedSecond.css('cursor', 'pointer');

		window.clearInterval(flipImgTimer);
	}
});
