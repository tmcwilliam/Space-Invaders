var _global = this;
var changeDirection = false;
var enemyDirection = 1;
var enemySpeed = 5;
var enemyYShift = 0;

(function () {

	// class variables
  var idCounter = 0;

	// constructor
  function Enemy (_x, _y, _imgSrc, _imgSrcA, _weight){
		this.id = idCounter++;
		this.x  = _x;
		this.y  = _y;
		this.imgSrc = _imgSrc;
		this.imgSrcA = _imgSrcA;
		this._width = 30;
		this._height = 16;
		this._time = 0;
		this._delay = 720;					/* delay the processing of the enemies */ /* Also used to determine enemy shot frequency (higher = more) */
		this._edge = 6;
		this._frame = 1;
		this._fire = false;
		this._weight = _weight;
	}

	_global.Enemy = Enemy;
    
	// public 
	Enemy.prototype.update = function (timeDelta, currentPlayer){
		this._time += timeDelta;

		if (this._time >= this._delay){
			// Randomly shoot, based on delay so the the faster they get the more they fire.
			var fireTest = Math.floor(Math.random() * (this._delay + 1));
			if (fireTest < (this._delay / 100)){
				this._fire = true;
			}
			
			//Calculate when platoon hits left and right edge and needs to change direction
			if(this.x + this._width + this._edge >= canvas.width && enemyDirection == 1){
				changeDirection = true;
			} else if(this.x < this._edge && enemyDirection != 1){
				changeDirection = true;
			}
			
			//Used to toggle between images
			this._frame = -this._frame;
			
			//Increase enemy speed based on level
			this.x += enemySpeed > 0 ? enemySpeed + currentPlayer._level : enemySpeed - currentPlayer._level;
			
			//Reset time to zero
			this._time = 0;
		}
		this.y += enemyYShift;
		
	};
    
})();