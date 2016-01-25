! function() {

	"use strict";
	function Particle (x, y) {
		this.life = 0;
		this.living = true;
		this.x  = 0;
		this.y  = 0;
		this.vx = 0;
		this.vy = 0;
	}
	Particle.prototype.init = function (x, y) {
		this.life = Math.random() * 500;
		this.living = true;
		this.x  = x;
		this.y  = y;
		this.vx = 0;
		this.vy = 0;
	}
	Particle.prototype.anim = function () {
		if (this.life > 0) {
			var a = 1 / (this.life--);
			this.x  += this.vx;
			this.y  += this.vy;
			this.vx += (Math.random() * 50 - 25) * a;
			this.vy += (Math.random() * 50 - 25) * a;
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.arc(this.x, this.y, 1, 0, 2 * Math.PI);
			ctx.fill();
		} else {
			if (this.living) {
				this.living = false;
				livingParticles--;
			}
		}
	}

	function Rocket () {

	}

	Rocket.prototype.launch = function (ox, oy, x1, y1, x2, y2, x3, y3) {
		this.ox = ox;
		this.oy = oy;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.x  = ox;
		this.y  = oy;
	}

	Rocket.prototype.draw = function (f, rad) {
		var p0 = Math.pow(1 - f, 3);
		var p1 = 3 * f * Math.pow(1 - f, 2);
		var p2 = 3 * Math.pow(f, 2) * (1 - f);
		var p3 = Math.pow(f, 3);
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		var x = (this.ox * p0) + (this.x1 * p1) + (this.x2 * p2) + this.x3 * p3;
		var y = (this.oy * p0) + (this.y1 * p1) + (this.y2 * p2) + this.y3 * p3;
		var dx = x - this.x;
		var dy = y - this.y;
		var d = Math.sqrt(dx * dx + dy * dy);
		var R = 32 + Math.round(d * d);
		var color = rad === 1 ? "#fff" : "rgb(" + R + "," + R + "," + R + ")";
		this.x = x;
		this.y = y;
		ctx.strokeStyle = color;
		ctx.lineWidth = rad * 2;
		ctx.lineTo(this.x, this.y);
		ctx.lineCap="round";
		ctx.stroke();
	}
	
	function cruise() {
		if (rad > 1) rad -= rs;
		if (rad < 1) rad = 1;
		r1.draw(step, rad);
		r2.draw(step, rad);
		r3.draw(step, rad);
		r4.draw(step, rad);
		step += 0.009;
		if (step <1) {
			requestAnimationFrame(cruise);
		} else {
			running = false;
			for (var i = 0, n = particles.length; i < n; i++) particles[i].init(px, py);
			livingParticles = n;
			//document.getElementById("clic").firstChild.nodeValue = "";
			boom();
		}
	}

	function boom () {
		for (var j = 0; j < 10; j++) {
			for (var i = 0, n = particles.length; i < n; i++) particles[i].anim();
		}
		if (livingParticles) {
			requestAnimationFrame(boom);
		}
	}

	// canvas
	var canvas  = ge1doot.canvas("canvas");
	var ctx     = canvas.ctx;
	var pointer = canvas.pointer;
	var step    = 0;
	var rad     = 0;
	var rs      = 0;
	var px      = 0;
	var py      = 0;
	var running = false;
	var r1      = new Rocket();
	var r2      = new Rocket();
	var r3      = new Rocket();
	var r4      = new Rocket();
	var particles = [];
	var livingParticles = 0;
	for (var i = 0; i < 100; i++) particles.push(new Particle());

	pointer.down = function () {
		if (!running) {
			step = 0;
			running = true;
			px = pointer.x;
			py = pointer.y;
			var w = canvas.width;
			var h = canvas.height;
			rad = Math.min(w, h) / 10;
			rs = rad / 100;
			r1.launch(20, 20, px * 0.8, py, w * 0.5, h * 0.9, px, py);
			r2.launch(20, h - 20, px * 0.3, h * 0.86, 0, py * 0.9, px, py);
			r3.launch(w - 20, h - 20, px * 0.3, py, px * 0.7, h * 0.9, px, py);
			r4.launch(w - 20, 20, px * 0.6, 0, h * 0.95, py * 0.9, px, py);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			cruise();
		}
	}

}();