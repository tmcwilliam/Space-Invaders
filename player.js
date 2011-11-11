// Assign '_global' to DOMWindow scope
var _global = this;

(function () {

	// class variables
  var idCounter = 0;
	
	// constructor
  function Player (_x, _y, _imgSrc){
		this.id = idCounter; 
		this.x  = _x;
		this.y  = _y;
		this.imgSrc = _imgSrc;
		this._width = 30;
		this._height = 16;
		this._speed = 5;
		this._lives = 3;
		this._score = 0;
		this._level = 1;
		this._edge = 6;
	}

	_global.Player = Player;

	// public 
	Player.prototype.update = function (){

		if (rightDown == true){
			/* check if ship is at the right edge of canvas */
			if (this.x + (this._width + this._edge) <= canvas.width){
				this.x += this._speed;
			}
		}
		
		if (leftDown == true){
			/* check if ship is at the left edge of canvas */
			if (this.x - this._edge >= 0){
				this.x -= this._speed;
			}
		}
	};
    
})();