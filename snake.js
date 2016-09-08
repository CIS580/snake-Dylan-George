/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

//x and y position of snake head
var x = 0;
var y = 0;
var oldX = 0;
var oldY = 0;

var headWidth = 15;
//Total headWidths travelled per second
var speed = 10;
var timer = 0;
var appleCount = 0;
var xBias = headWidth/2;
var yBias = headWidth/2;
var adjust = false;
var turnable = false;
var apples = [];
var snake = [{xpos:0, ypos:5, radius:5}]

var currentDirection = 
{
	up: false,
	down: false,
	left: false,
	right: false
}

/**
 * @function start
 * Spawn the worm in a random location on the grid.
 * Start worm moving in direction away from closest edge.
 * Spawn an apple.
 */
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
	
	timer = 5000;
	appleSpawner();
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
 * to enable the change of direction.
 * Sets adjust to true so worm is fit to grid next update
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
 * @function move
 * Moves the worm forward and keeps it on the grid
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function move(elapsedTime)
{
	var gridX = headWidth * Math.floor((x+xBias)/headWidth);
	var gridY = headWidth * Math.floor((y+yBias)/headWidth);
	if(adjust)
	{
		x = gridX;
		y = gridY;
		adjust = false;
	}

	if(currentDirection.up) y -= speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.down) y += speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.right) x += speed * headWidth * elapsedTime / 1000;
	else if(currentDirection.left) x -= speed * headWidth * elapsedTime / 1000;

	if((Math.abs(oldX - x) >= headWidth/2) || (Math.abs(oldY - y) >= headWidth/2))
	{
		oldX = x;
		oldY = y;
		turnable = true;
	}

	frontCtx.fillStyle = "blue";
	frontCtx.fillRect(x, y, headWidth, headWidth);
}

/**
 * @function appleSpawner()
 * Spawns an apple every 5 seconds.
 * Draws the apples each frame.
 */
function appleSpawner()
{
	if(timer >= 5000)
	{
		if(appleCount >= 3)
		{
			apples.shift();
		}
		var appleX = headWidth * Math.floor((Math.random() * frontBuffer.width/headWidth));
		var appleY = headWidth * Math.floor((Math.random() * frontBuffer.height/headWidth));
		
		//for each snake segment, if appleX and appleY intersects, recalculate
		
		apples.push([appleX, appleY]);
		appleCount++;
		timer = 0;
	}	
	
	frontCtx.fillStyle = "red";
	for(i = 0; i < apples.length; i++)
	{
		var curApple = apples[i];
		frontCtx.fillRect(curApple[0], curApple[1], headWidth, headWidth);
	}
}

function collisionDetection()
{
	for(i = 0; i < apples.length; i++)
	{
		curApple = apples[i];
		if (!(y+headWidth < curApple[1] || y > curApple[1]+headWidth 
				|| x > curApple[0] + headWidth || x+headWidth < curApple[0]))
		{
			apples.splice(i, 1);
			appleCount--;
			
			//Grow worm
		}
	}
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
	frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
	appleSpawner();
	move(elapsedTime);
	collisionDetection();
  // To make snake parts follow head, use array and replace each location with 
  // location of piece in front of them
  
  // TODO: Grow the snake periodically
		//example: var arr = [{xpos:0, ypos:5, radius:5}]
		//arr.push({});
		//arr.forEach(function (item, index, array))
		//shift, unshift, pop, push
  
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
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
