export var drawingApp = (function () {

	'use strict';
	// TODO: use jQuery
	var canvas, context, originalCanvas, originalContext;
	var tool;
	var defaultTool = 'line';
	var tools = {};
	var color;
	var defaultColor = 'black';
	var colorPicker;

		var init =  function (width, height) {

		originalCanvas = document.getElementById('drawing');
	
		originalCanvas.height = height;
		originalCanvas.width = width;

		originalContext = originalCanvas.getContext('2d');

		var container = originalCanvas.parentNode;
		canvas = document.createElement('canvas');

		canvas.id     = 'tempCanvas';
		canvas.width  = originalCanvas.width;
		canvas.height = originalCanvas.height;
		canvas.className += 'cnv';
		container.appendChild(canvas);

		context = canvas.getContext('2d');

		initTools();
		
		if (tools[defaultTool]) {
			tool = new tools[defaultTool]();
		}

		canvas.addEventListener('mousedown', canvasEventProcessor, false);
		canvas.addEventListener('mousemove', canvasEventProcessor, false);
		canvas.addEventListener('mouseup',   canvasEventProcessor, false);
		
		var drawingTools = document.getElementsByClassName('draw-tool');
		
		for (var i = 0; i < drawingTools.length; i++) {
			drawingTools[i].addEventListener('click', toolSelector, false);
		}
	};
	
	var canvasEventProcessor = function (ev) {
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
		var func = tool[ev.type];
		if (func) {
			func(ev);
		}
	};
	
	var toolSelector = function(ev){
		var targetId = '' + event.currentTarget.id;
		tool = new tools[targetId];
		$('.draw-tool').removeClass('active');
		$(event.currentTarget).addClass('active');
	}
	
	var updateOriginalCanvas = function () {
		originalContext.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	var initTools = function(){
		tools.pencil = function () {
			var tool = this;
			this.started = false;

			this.mousedown = function (ev) {
				context.beginPath();
				context.moveTo(ev._x, ev._y);
				tool.started = true;
			};

			this.mousemove = function (ev) {
				if (tool.started) {
					context.lineTo(ev._x, ev._y);
					context.strokeStyle = document.getElementById('hexVal').value;
					context.stroke();
				}
			};

			// This is called when you release the mouse button.
			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					updateOriginalCanvas();
				}
			};
		};
		
		tools.line = function () {
			var tool = this;
			this.started = false;

			this.mousedown = function (ev) {
				tool.started = true;
				tool.x0 = ev._x;
				tool.y0 = ev._y;
			};

			this.mousemove = function (ev) {
				if (!tool.started) {
					return;
				}

				context.clearRect(0, 0, canvas.width, canvas.height);

				context.beginPath();
				context.moveTo(tool.x0, tool.y0);
				context.lineTo(ev._x,   ev._y);
				context.strokeStyle = document.getElementById('hexVal').value;
				context.stroke();
				context.closePath();
			};

			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					updateOriginalCanvas();
				}
			};
		};
		
		tools.rectangle = function () {
			var tool = this;
			this.started = false;

			this.mousedown = function (ev) {
				tool.started = true;
				tool.x0 = ev._x;
				tool.y0 = ev._y;
			};

			this.mousemove = function (ev) {
				if (!tool.started) {
					return;
				}

				var x = Math.min(ev._x,  tool.x0),
				y = Math.min(ev._y,  tool.y0),
				w = Math.abs(ev._x - tool.x0),
				h = Math.abs(ev._y - tool.y0);

				context.clearRect(0, 0, canvas.width, canvas.height);

				if (!w || !h) {
					return;
				}
				context.strokeStyle = document.getElementById('hexVal').value;
				context.strokeRect(x, y, w, h);
			};

			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					updateOriginalCanvas();
				}
			};
		};
	};
  
	return {
		init: init
	};
	
}());
