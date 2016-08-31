/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  var elapsedTime = newTime - oldTime;
  oldTime = newTime;
  
  update(elapsedTime);
  render(elapsedTime);

  // Flip the back buffer
  frontCtx.drawImage(backBuffer, 0, 0);

  // Run the next loop
  window.requestAnimationFrame(loop);
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  //multiply snake speed by elapsed time for consistent speed across platforms
  
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
  //not necessary if drawing image
  backCtx.clearRect(0, 0, backBuffer.width, backBuffer.height);

  // TODO: Draw the game objects into the backBuffer

}

/* Launch the game */
window.requestAnimationFrame(loop);
