/* snake.js
 *	Author: Dylan George
 */

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

//pixel length of snake pieces
var headWidth = 30;
//milliseconds until movement
var speed = 125;
var appleTimer = 0;
var timer = 0;
var appleCount = 0;
var radius = headWidth/2;
var turnable = false;

var won = false;
var lost = false;
var score = 0;

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

	if (y <= (frontBuffer.height / 2))
	{
		yDist = frontBuffer.height - y;
	}
	else yDist = y - frontBuffer.width;
	
	if (yDist > 0) currentDirection.down = true;
	else currentDirection.up = true;
	
	appleTimer = 5000;
	appleSpawner();
	snake.push({xpos: x, ypos: y});
	grow();
	grow();
}

//restarts the game
function restart()
{
	x = 0;
	y = 0;
	appleTimer = 0;
	timer = 0;
	appleCount = 0;
	turnable = true;

	won = false;
	lost = false;
	score = 0;

	apples = [];
	snake = [];
	
	start();
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
//Also space for restart
window.onkeydown = function(event)
{
	if(event.keyCode == 32 && (lost || won))
	{
		restart();
		event.preventDefault();
	}
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
 */
function resetDirection()
{
	turnable = false;
	for(var direction in currentDirection)
	{
		currentDirection[direction] = false;
	}	
}

/**
 * @function move
 * Moves the worm forward and keeps it on the grid
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function move(elapsedTime)
{
	timer+=elapsedTime;
	
	if (timer >= speed)
	{
		timer = 0;
		
		if(currentDirection.up) y -= headWidth;
		else if(currentDirection.down) y += headWidth;
		else if(currentDirection.right) x += headWidth;
		else if(currentDirection.left) x -= headWidth;
		
		//remove last piece and put it in front as new head
		if(snake.length > 1)
		{
			snake.unshift(snake[snake.length-1]);
			snake.splice(snake.length-1,1);
		}
		snake[0].xpos = x;
		snake[0].ypos = y;
		turnable = true;
	}
	
	frontCtx.fillStyle = "lightgreen";
	for(i = 0; i < snake.length; i++)
	{
		var segment = snake[i];

		if (i == snake.length -1) 
		{
		frontCtx.fillStyle = "green";
		frontCtx.strokeStyle = "lightgreen";
		}
		else frontCtx.strokeStyle = "green";
		frontCtx.fillRect(segment.xpos, segment.ypos, headWidth, headWidth);
		frontCtx.strokeRect(segment.xpos, segment.ypos, headWidth, headWidth);
	}
	
}

/**
 * @function appleSpawner()
 * Spawns an apple every 3 seconds.
 * Draws the apples each frame.
 */
function appleSpawner()
{
	if(appleTimer >= 3000)
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

/**
 *@function collisionDetection
 * Handles collision detection on the head of the snake
 */
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
			score++;
			grow();
		}
	}
	
	//snake parts
	for(i = 1; i<snake.length; i++)
	{	
		var front = snake[0];
		var curSegment = snake[i];
		if (!(front.ypos+headWidth/2 < curSegment.ypos || front.ypos > curSegment.ypos+headWidth/2
				|| front.xpos > curSegment.xpos + headWidth/2 || front.xpos+headWidth/2 < curSegment.xpos))
		{
			lost = true;
			console.log("lost");
		}
	}
}

/**
 *@function grow
 * Grows the snake in the correct direction
 */
function grow()
{
	var endPiece = snake[snake.length-1];
	if(currentDirection.up) snake.push({xpos: endPiece.xpos, ypos: endPiece.ypos+headWidth});
	else if(currentDirection.down) snake.push({xpos: endPiece.xpos, ypos: endPiece.ypos-headWidth});
	else if(currentDirection.right) snake.push({xpos: endPiece.xpos-headWidth, ypos: endPiece.ypos});
	else if(currentDirection.left) snake.push({xpos: endPiece.xpos+headWidth, ypos: endPiece.ypos});
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
	
	if(won)
	{
		frontCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
		frontCtx.fillRect(0, frontBuffer.height/4, frontBuffer.width, 300);
		frontCtx.fillStyle = 'black';
		frontCtx.font = "40px Arial"; 
		frontCtx.fillText("You win!", frontBuffer.width/3, frontBuffer.height/2);
		frontCtx.font = "20px Arial"; 
		frontCtx.fillText("Press Space to start over.", frontBuffer.width/3 + 1, frontBuffer.height/2 + 50);
	}
	else if(lost)
	{
		frontCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
		frontCtx.fillRect(0, frontBuffer.height/4, frontBuffer.width, 300);
		frontCtx.fillStyle = 'black';
		frontCtx.font = "40px Arial"; 
		frontCtx.fillText("Game over :(", frontBuffer.width/3, frontBuffer.height/2);
		frontCtx.font = "20px Arial"; 
		frontCtx.fillText("Press Space to try again.", frontBuffer.width/3 + 1, frontBuffer.height/2 + 50);
	}
	else
	{
		frontCtx.clearRect(0, 0, frontBuffer.width, frontBuffer.height);
		appleSpawner();
		move(elapsedTime);
		collisionDetection();
	}
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
  backCtx.fillStyle = "black";
  backCtx.font = "20px Arial"; 
  backCtx.fillText("Score: " + score, 5, backBuffer.height - 5);
  backCtx.drawImage(frontBuffer, 0, 0);
}

/* Launch the game */
start();
window.requestAnimationFrame(loop);
