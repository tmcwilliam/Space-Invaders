/* space_invaders.js
*
* Author: Travis McWilliam
* FUN WITH HTML5 CANVAS TAG
* This is an experimental project in order to learn more about the HTML5 <canvas> tag and hopefull pick up other knowledge as well.
*/

$(document).ready(function(){init();});

/* Local variables */
var canvas;
var context;
var FPS = 30; /* Deprecated */

var player;
var player_hit = false;
var enemies = {};
var enemyDirection = 1;
var enemyCount = 0;
var newPlatoon = false;
var invasion = false;

var gameOver = false;
var pause = false;
var intervalId;

var rightDown = false;
var leftDown = false;

var projectileCount = 0;
var projectiles = {};

/* Init Images */
var redAlien = new Image();
var redAlienA = new Image();
var orangeAlien = new Image();
var orangeAlienA = new Image();
var ship = new Image();
var projImage = new Image();
var eProjImage = new Image();
var eProjImageA = new Image();

redAlien.src = "images/invader1.png";
redAlienA.src = "images/invader12.png";
orangeAlien.src = "images/invader2.png";
orangeAlienA.src = "images/invader22.png";
ship.src = "images/ship.png";
projImage.src = "images/projectile.png";
eProjImage.src = "images/eprojectile.png";
eProjImageA.src = "images/eprojectile2.png";

function init(){
	// Have to use vanilla javascript to get the object since a jQuery object will not give me canvas functionality
	canvas = document.getElementById("space-invaders");
	
	/*
		Key Point:
		The canvas element allows for the DRAWING OF OBJECT onto a webpage. A script is needed in order to draw objects and said scripts
		needs to know the RENDERING CONTEXT.
		getContext() obtains the rendering context of the canvas object along with it's drawing funtions. 
		@parameter: Here I am only focusing on a 2 Dimensional rendering context ('2d')
	*/
	context = canvas.getContext("2d");
	
	// Instantiate the player object by passing a position and img object
	player = new Player(10, canvas.height - 30, ship);
	
	// Create platoon of enemies
	newEnemyPlatoon();
	
	/*
		Key Point:
		GAMING REQUIRES A CONSTANT LOOP!!
		
		Dev Note: Use requestAnimationFrame() instead of setInterval()
		http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
		- Onus is on the browser when to do the repaint
		- Don't need to specify FPS
		- Pauses when switching tabs		
	*/
	//intervalId = window.setInterval(update, Math.ceil(1000 / FPS));
	window.requestAnimFrame(update); // Chrome
	
	bindHelp();
	bindClose();
}

//Listeners
$(document).keydown(function(evt){
	// Right arrow
	if (evt.keyCode == 39){
		rightDown = true;
	// Left arrow
	} else if (evt.keyCode == 37){
		leftDown = true;
	}
	// Space bar
	if (evt.keyCode == 32){
		var projectile = new Projectile(player.x + (player._width/2), player.y - 10, projImage, projImage, 5, 1);
		addProjectile(projectile);
  }
	// 'P' key to pause game
	if(evt.keyCode == 80 && !gameOver){
		pause = pause === true ? false : true;
		if(pause){
			$('#alert').text("Paused");
			$('#alert').fadeIn(1000);
		} else {
			$('#alert').fadeOut(1000);
			window.requestAnimFrame(update);
		}
	}
	// Enter key
	if(evt.keyCode == 13 && pause){
		pause = false;
		gameOn();
		window.requestAnimFrame(update);
	}
});

$(document).keyup(function(evt){
	// Right key
	if (evt.keyCode == 39){
		rightDown = false;
	// Left key
	} else if (evt.keyCode == 37){
		leftDown = false;
	}
});

function gameOn(){
	player_hit = false;
	invasion = false;
	if(newPlatoon){
		newEnemyPlatoon();
		newPlatoon = false;
	}
	$('#alert').fadeOut(100);	// clear any alerts
}

/*
	Creates a new platoon of enemy aliens.
	6 rows of 11 aliens
	Enemy object parameters = x position, y position, imgA, imgB, points value
*/
function newEnemyPlatoon(){
	var enemy;
	
	// Remove any existing projectiles or anliens from cache
	removeProjectiles();
	for(var eid = 0; eid < enemies.length; eid++){
		delete enemies[eid];
	}
	
	// Display platoon
	for(var i=0; i<6;i++){
		for(var j=0; j<11;j++){
			if(i===0){
				enemy = new Enemy(10 + (j * 30), 25 + (i * 20), orangeAlien, orangeAlienA, 200);
			} else {
				enemy = new Enemy(10 + (j * 30), 25 + (i * 20), redAlien, redAlienA, 100);
			}
			addEnemy(enemy);
		}
	}
}

function addProjectile(projectile){
	projectiles[projectile.id] = projectile;
	++projectileCount;
}

function removeProjectile(projectile){
	delete projectiles[projectile.id];
	--projectileCount;
}

function removeProjectiles(){
	for(var pid = 0; pid < projectiles.length; pid++){
		delete projectiles[pid];
	}
}

function addEnemy(enemy){
	enemies[enemy.id] = enemy;
	enemyCount++;
}

// Killing of enemy
function removeEnemy(enemy){
	delete enemies[enemy.id];
  --enemyCount;
	player._score += enemy._weight;
}

function newLevelTransition(){
	pause = true;
	$('#alert').text('Level ' + player._level);
	$('#alert').fadeIn(2000);
	setTimeout(function(){
		pause = false;
		$('#alert').fadeOut(1000);
		window.requestAnimFrame(update);
	},2000);
}

function bindHelp(){
	$('.help').click(function(e){
		e.preventDefault();
		pause = true;
		$('#instructions').show();
	});
}

function bindClose(){
	$('.close').click(function(e){
		e.preventDefault();
		$('#instructions').hide();
		pause = false;
		$('#alert').fadeOut(100);	// clear any alerts
	});
}

/********************
	HEART OF THE CODE!!
*********************/
function update(){
	if(!pause && !gameOver){
		//KEY POINT: use clearRect() to reset canvas
		context.clearRect(0, 0,canvas.width, canvas.height);
		
		//Check for alerts
		if (player._lives <= 0){
			$('#alert').text("Game Over");
			$('#alert').fadeIn(2000);
			gameOver = true;
		} else if(player_hit){
			pause = true;
			$('#alert').html("You've been hit. Press <pre>Enter</pre> to continue.");
			$('#alert').fadeIn(1000);
		} else if(invasion){
			pause = true;
			$('#alert').text("The aliens have invaded!! Press 'Enter' to continue. ");
			$('#alert').fadeIn(1000);
			newPlatoon = true;
		}
		
		//Update information board
		$('#player_lives').html(player._lives);
		$('#player_level').html(player._level);
		$('#player_score').html(player._score);
		
		//Update the players position
		player.update();
		
		//KEY POINT: use drawImage() to draw player image
		context.drawImage(player.imgSrc, player.x, player.y);
		
		//update enemy platoon position
		if (changeDirection === true){
			changeDirection = false;
			enemyDirection = -enemyDirection;
			enemySpeed = -enemySpeed;
			enemyYShift = 10;
		}
		
		// Loop thru cache of enemies to update position and random fire
		$.each(enemies, function(index, value){
			var enemy = enemies[index];
			var e_img = enemy._frame == 1 ? enemy.imgSrc : enemy.imgSrcA;
			enemy.update(100, player);
			
			if (enemy._fire === true){
				enemy._fire = false;
				var projectile = new Projectile(enemy.x + (enemy._width/2), enemy.y + 10, eProjImage, eProjImageA, -5, 2);
				addProjectile(projectile);
			}
			
			//KEY POINT: use drawImage() to draw enemy image
			context.drawImage(e_img, enemy.x, enemy.y);
		});
		enemyYShift = 0;
		
		// draw projectiles based on frame and coordinates
		$.each(projectiles, function(index, value){
			var bullet = projectiles[index];
			var p_img = bullet.frame == 1 ? bullet.imgSrc : bullet.imgSrcA;
			bullet.update();
			context.drawImage(p_img, bullet.x, bullet.y);
		});
		
		checkHits();
		
		window.requestAnimFrame(update);
		
	}
}

function checkHits(){
	//check if enemy or player is hit
	for(var id in projectiles){
		
		if(projectiles.hasOwnProperty(id)){
			var projectile = projectiles[id];
		
			// check if player projectile hit an enemy
			if(projectile._type == 1){
				for(var eindex in enemies){
					
					if (enemies.hasOwnProperty(eindex)) {
						var bad_guy = enemies[eindex];
						if (projectile.x >= bad_guy.x && projectile.x <= (bad_guy.x + bad_guy._width)){
							if (projectile.y <= (bad_guy.y + bad_guy._height) && projectile.y >= (bad_guy.y)){
								removeEnemy(bad_guy);
								if(enemyCount === 0){
									newEnemyPlatoon();
									player._level++;
									newLevelTransition();
								}
								removeProjectile(projectile);
							}
						}
					}
					
				}
			// check if enemy projectile hit player
			} else if(projectile._type == 2) {
				if(projectile.x >= player.x && projectile.x <= (player.x + player._width)){
					if(projectile.y <= (player.y + player._height) && projectile.y >= (player.y)){
						removeProjectile(projectile);
						player._lives--;
						player_hit = true;
					}
				}
			}
		
			// check if projectile has left the canvas area
			if (projectile.y <=0 || projectile.y > canvas.height){
				removeProjectile(projectile);
			}
		}	
	}
	
	// check if enemy has collided with player or bottom of canvas
	for(var eid=0; eid < enemies.length; eid++){
		var enemy = enemies[eid];
		var enemy_bottom = enemy.y + enemy._height;
		var enemy_right = enemy.x + enemy._width;
		var player_right = player.x + player._width;
		if( (enemy.x >= player.x && enemy.x <= player_right && enemy_bottom >= player.y) ||
				(enemy_right >= player.x && enemy_right <= player_right && enemy_bottom >= player.y) ||
				(enemy_bottom >= canvas.height) ){
					if(!invasion){
						player._lives--;
						invasion = true;
					}
		}
	}		
	
}

// Taken from Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
})();