/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

//x position of snake head
var x = 0;
//y position of snake head
var y = 0;
var oldX = 0;
var oldY = 0;

var headWidth = 15;
//Total headWidths travelled per second
var speed = 10;
var timer = 0;
var xBias = headWidth/2;
var yBias = headWidth/2;
var adjust = false;
var turnable = false;

function start()
{
	var temp = 0;
	var yDist = 0;
	
	x = headWidth * Math.floor((Math.random() * frontBuffer.width/headWidth));
	y = headWidth * Math.floor((Math.random() * frontBuffer.height/headWidth));
	oldX = x;
	oldY = y;
	if (y <= (frontBuffer.height / 2))
	{
		yDist = frontBuffer.height - y;
	}
	else yDist = y - frontBuffer.width;
	
	if (yDist > 0) currentDirection.down = true;
	else currentDirection.up = true;
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  timer+=elapsedTime;	
  
  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);
  
  // Run the next loop
  window.requestAnimationFrame(loop);
}



var currentDirection = 
{
	up: false,
	down: false,
	left: false,
	right: false
}

//Handles arrow key/wasd button press events, allowing movement
window.onkeydown = function(event)
{
	if(turnable)
	{
	switch(event.keyCode)
	{
		//up
		case 38:
		case 87:
			if(!currentDirection.down && !currentDirection.up)
			{
				resetDirection();
				currentDirection.up = true;
			}
			event.preventDefault();
			break;
		//down
		case 40:
		case 83:
			if(!currentDirection.up && !currentDirection.down)
			{
				resetDirection();
				currentDirection.down = true;
			}
			event.preventDefault();
			break;
		//left
		case 37:
		case 65:
			if(!currentDirection.right && !currentDirection.left)
			{
				resetDirection();
				currentDirection.left = true;
			}
			event.preventDefault();
			break;
		//right
		case 39:
		case 68:
			if(!currentDirection.left && !currentDirection.right)
			{
				resetDirection();
				currentDirection.right = true;
			}
			event.preventDefault();
			break;
	}
	}
}

/**
 * @function resetDirection
 * Resets the current movement direction
 * to enable the change of direction
 */
function resetDirection()
{
	adjust = true;
	for(var direction in currentDirection)
	{
		currentDirection[direction] = false;
	}	
	turnable = false;
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) 
{	
	var gridX = headWidth * Math.floor((x+xBias)/headWidth);
	var gridY = headWidth * Math.floor((y+yBias)/headWidth);
	var tempX = x;
	if(adjust)
	{
		console.log("adjust");
		x = gridX;
		y = gridY;
		adjust = false;
	}

	if(currentDirection.up) y -= speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.down) y += speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.right) x += speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.left) x -= speed * headWidth * elapsedTime / 1000;

	if((Math.abs(oldX - x) >= headWidth) || (Math.abs(oldY - y) >= headWidth))
	{
		oldX = x;
		oldY = y;
		turnable = true;
	}

	if (timer > 1000)
	{
		timer = 0;
	}

	frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
	frontCtx.fillStyle = "blue";
	frontCtx.fillRect(x, y, headWidth, headWidth);
	
  // To make snake parts follow head, use array and replace each location with 
  // location of piece in front of them
  
  // TODO: Spawn an apple periodically
  // TODO: Grow the snake periodically
		//example: var arr = [{xpos:0, ypos:5, radius:5}]
		//arr.push({});
		//arr.forEach(function (item, index, array))
		//shift, unshift, pop, push
  
  // TODO: Move the snake
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  // TODO: Determine if the snake has eaten an apple
  // TODO: Determine if the snake has eaten its tail
  
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle
		//Check only against head
		
		//Circle:
		//Take two points, measure distance between each and if it is smaller
		//Than a certain distance, the objects are colliding
		//Distance formula: d = sqrt((x1-x2)^2 + (y1-y2)^2)
		//Instead of sqrt, use d^2 = (x1-x2)^2 + (y1-y2)^2
		//Probably use d^2 (><=) r1^2 + r2^2
		// > is overlap, = is intersect, < is no collision
		
		/*Square:
		* A and B are squares
		* If !(Abottom > Btop || Atop < Bbottom || Aleft > Bright || Aright < Bleft)
		* then they are intersecting 
		*/

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  //not necessary if drawing image (it will draw over it anyway)
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

}

/* Launch the game */
start();
window.requestAnimationFrame(loop);
