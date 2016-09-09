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
var appleTimer = 0;
var appleCount = 0;
var radius = headWidth/2;
var adjust = false;
var turnable = false;
var won = false;
var lost = false;
var apples = [];
var snake = [];
var maxSize = (frontBuffer.width/headWidth) * (frontBuffer.height/headWidth);

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
	
	appleTimer = 5000;
	appleSpawner();
	snake.push({xpos: x, ypos: y, time: 0});
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  appleTimer+=elapsedTime;	
  
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
	var gridX = headWidth * Math.floor((x+radius)/headWidth);
	var gridY = headWidth * Math.floor((y+radius)/headWidth);
	var xDif = x;
	var yDif = y;
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
	console.log(speed * headWidth * elapsedTime / 1000);
	if((Math.abs(oldX - x) >= headWidth/2) || (Math.abs(oldY - y) >= headWidth/2))
	{
		oldX = x;
		oldY = y;
		turnable = true;
	}

	frontCtx.fillStyle = "lightgreen";
	for(i = snake.length-1; i >= 0; i--)
	{
		var segment = snake[i];
		segment.time += elapsedTime;
		if(i > 0)
		{
			var curGridX =  headWidth * Math.floor((segment.xpos+radius)/headWidth);
			var curGridY =  headWidth * Math.floor((segment.ypos+radius)/headWidth);
			if((curGridX == segment.goalX) && (curGridY == segment.goalY))
			{
				segment.goalX = headWidth * Math.floor((snake[i-1].xpos+radius)/headWidth);
				segment.goalY = headWidth * Math.floor((snake[i-1].ypos+radius)/headWidth);
			}

			if(segment.goalX > curGridX)
			{
				segment.xpos += speed * headWidth * elapsedTime / 1000;
				console.log(speed * headWidth * elapsedTime / 1000);
			}
			else if(segment.goalX < curGridX)
			{
				segment.xpos -= speed * headWidth * elapsedTime / 1000;
			}
			if(segment.goalY > curGridY)
			{
				segment.ypos += speed * headWidth * elapsedTime / 1000;
			}
			else if(segment.goalY < curGridY)
			{
				segment.ypos -= speed * headWidth * elapsedTime / 1000;
			}
		}
		else 
		{
			segment.xpos = x;
			segment.ypos = y;
		}
		frontCtx.fillRect(segment.xpos, segment.ypos, headWidth, headWidth);
		frontCtx.strokeStyle = "green";
		frontCtx.strokeRect(segment.xpos, segment.ypos, headWidth, headWidth);
	}
	
}

/**
 * @function appleSpawner()
 * Spawns an apple every 5 seconds.
 * Draws the apples each frame.
 */
function appleSpawner()
{
	if(appleTimer >= 5000)
	{
		if(appleCount >= 3)
		{
			apples.shift();
		}
		var appleX = headWidth * Math.floor((Math.random() * frontBuffer.width/headWidth));
		var appleY = headWidth * Math.floor((Math.random() * frontBuffer.height/headWidth));
		
		apples.push([appleX, appleY]);
		appleCount++;
		appleTimer = 0;
	}	
	
	frontCtx.fillStyle = "lightpink";
	for(i = 0; i < apples.length; i++)
	{
		var curApple = apples[i];
		frontCtx.fillRect(curApple[0], curApple[1], headWidth, headWidth);
		frontCtx.strokeStyle = "maroon";
		frontCtx.strokeRect(curApple[0], curApple[1], headWidth, headWidth);
	}
}

function collisionDetection()
{
	//borders
	if(x < 0 || x > frontBuffer.width - headWidth || y < 0 || y > frontBuffer.height - 1)
	{
		lost = true;
	}
	
	//apples
	for(i = 0; i < apples.length; i++)
	{
		curApple = apples[i];
		if (!(y+headWidth/2 < curApple[1] || y > curApple[1]+headWidth/2
				|| x > curApple[0] + headWidth/2 || x+headWidth/2 < curApple[0]))
		{
			if (snake.length >= maxSize)
			{
				won = true;
			}
			
			apples.splice(i, 1);
			appleCount--;
			
			if(currentDirection.up) snake.push({xpos: x, ypos: y+headWidth, goalX: 0, goalY: 0});
			else if(currentDirection.down) snake.push({xpos: x, ypos: y-headWidth, goalX: 0, goalY: 0});
			else if(currentDirection.right)snake.push({xpos: x-headWidth, ypos: y, goalX: 0, goalY: 0});
			else if(currentDirection.left) snake.push({xpos: x+headWidth, ypos: y, goalX: 0, goalY: 0});
			
			snake[snake.length-1].goalX = headWidth * Math.floor((snake[snake.length-2].xpos+radius)/headWidth);
			snake[snake.length-1].goalY = headWidth * Math.floor((snake[snake.length-2].ypos+radius)/headWidth);
			
		}
	}
	
	//snake parts
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
	if(won)
	{
	}
	else if(lost)
	{
	}
	else
	{
		appleSpawner();
		move(elapsedTime);
		collisionDetection();
	}
  // To make snake parts follow head, use array and replace each location with 
  // location of piece in front of them
  
  // TODO: Grow the snake periodically
		//example: var arr = [{xpos:0, ypos:5, radius:5}]
		//arr.push({});
		//arr.forEach(function (item, index, array))
		//shift, unshift, pop, push
  
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

  backCtx.fillStyle = "grey";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);
  backCtx.drawImage(frontBuffer, 0, 0);
}

/* Launch the game */
start();
window.requestAnimationFrame(loop);
