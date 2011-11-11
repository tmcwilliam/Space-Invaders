var _global = this;

(function () {

	// class variables
  var idCounter = 0;
	
	// constructor
  function Projectile (_x, _y, _imgSrc, _imgSrcA, _speed, _type){
		this.id = idCounter++; 
		this.x  = _x;
		this.y  = _y;
		this.imgSrc = _imgSrc;
		this.imgSrcA = _imgSrcA;
		this._width = 30;
		this._height = 16;
		this._speed = _speed;
		this._type = _type;
		this.frame = 1;
	}

	_global.Projectile = Projectile;

	// public 
	Projectile.prototype.update = function (){
		this.y -= this._speed;
		this.frame = -this.frame;
	};
    
})();