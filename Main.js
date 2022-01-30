
/*var enemies = new Array();
var bullet = new Array();
var Level = 1;*/
window.onload = init;
function init(){
	//Initialize canvas
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	player = new Player();
	options = new Options();

	//var a = document.getElementsByTagName("audio")[0];
	//a.volume=.1, a.play();
	
	loop();
}
function loop(){
	update();
	draw();
	requestAnimationFrame(loop);
}

function update(){
	handleInput();
	animatePlayer();
	player.update.call();
	updateProjectiles();
	//enemies.update();
	checkCollision();
}
function draw(){
	//clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//Draw background
	context.fillStyle="#151B54";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//draw player
	context.drawImage(player.image, player.croptargetx, player.croptargety, player.cropwidth, player.cropheight, player.x, player.y, player.width, player.height);
		
	//draw platforms
	drawArray(Platforms);
	drawArray(wallPlatforms);
	drawArray(Lemons);
}
function updateProjectiles(){
	//Update lemons
	for(var j = 0; j < Lemons.length; j++){
		if(Lemons[j].direction){
			Lemons[j].x += Lemons[j].speed;
		}
		else{
			Lemons[j].x -= Lemons[j].speed;
		}
	}
}
function handleInput(){
	//Jump key pressed
	if(keys[options.jump]) {
		if(!player.jumping && !jumpKeyPressed){
			player.jumping = true;
   			player.vy = -6.5*options.gravity;
   		}
   		else if(player.walljump && !jumpKeyPressed){
   			if(player.turning){
   				player.vx = -1;
   				player.turning = false;
   			}
   			else{
   				player.vx = 1;
   				player.turning = true;
   			}
   			player.vy = -6.5*options.gravity;
   		}
   		jumpKeyPressed = true;
   		options.gravity = 0.14;
	}
	else if(!keys[options.jump])
		options.gravity = 0.4, jumpKeyPressed = false;

	//Left key pressed
	if(keys[options.left] && !keys[options.right]){
		if(!player.jumping){
			if(player.dashing && player.turning)
				player.dashing = false;

			if(!player.dashing)
				player.vx = -1;
		}
		else{
			if(player.vx > -1)
				player.vx -= 0.1;
		}
		player.running = true;
		player.turning = false;
	}
	//Right key pressed
	if(keys[options.right] && !keys[options.left]){
		if(!player.jumping){
			if(player.dashing && !player.turning)
				player.dashing = false;

			if(!player.dashing)
				player.vx = 1;
		}
		else{
			if(player.vx < 1)
				player.vx += 0.1;
		}
		player.running = true;
		player.turning = true;
	}
	//Check
	if(!keys[options.right] && !keys[options.left])
		player.running = false;

	//Dash key pressed
	if(keys[options.dash] && !player.jumping && !player.dashing && !dashKeyPressed){
		if(player.turning)
			player.vx = 2
		else
			player.vx = -2

		player.dashing = true;
		dashKeyPressed = true;
	}
	//Conditions for dash to stop
	if(!keys[options.dash]){
		player.dashing = false;	
		dashKeyPressed = false;
		slideframes = 0;
	}
	else if(slideframes == 22){
		player.dashing = false;
		slideframes = 0;
	}
	//Lemon key pressed
	if(keys[options.shoot] && !shootKeyPressed){
		lemon = new Lemon();
		lemon.x = player.x;
		lemon.y = player.y;
		if(player.walljump)
			lemon.direction = !player.turning;
		else
			lemon.direction = player.turning;

		if(lemon.direction){
			lemon.image = lemon.imageNor, lemon.croptargetx = 81;
			lemon.x = player.x+0.8*player.width;
			lemon.y = player.y+0.4*player.height;
		}
		else{
			lemon.image = lemon.imageRev, lemon.croptargetx = lemon.image.width-81-lemon.cropwidth; 
			lemon.y = player.y+0.4*player.height;
		}
		Lemons.push(lemon);
		shootframes = 0;
		player.shooting = true;
		shootKeyPressed = true;
	}
	else if(!keys[options.shoot]){
		shootKeyPressed = false;
	}
	if(shootframes > 40)
		player.shooting = false;
}
function checkCollision(){
    //Keeps player inside of canvas
    if (player.x >= canvas.width-player.width || player.x <= 0 || player.y >= canvas.height-player.height) {
    	player.x = 550;
		player.y = 550;
    } 
    //Check collission regarding player
    playerCheckArray(Platforms);
    playerCheckArray(wallPlatforms);

    //Check collission regarding projectiles
    lemonCheckArray();
}
function animatePlayer(){
	////Player dashing
	if(player.dashing && !player.jumping){
		if(slideframes%2 == 0){
			if(slideframes == 22){
				s = 1;
			}
			else{
				s = s + 2;
			}
		}
		//player.width = 1.58*dashcrop[s];
		if(player.shooting){
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = 834;
				player.croptargety = 301;
				player.cropwidth = 49;
				player.cropheight = 35;
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-834-49;
				player.croptargety = 301;
				player.cropwidth = 49;
				player.cropheight = 35;
			}
		}
		else{
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = dashcroptarget[19];
				player.croptargety = dashcroptarget[20];
				player.cropwidth = dashcrop[19];
				player.cropheight = dashcrop[20];
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-dashcroptarget[19]-dashcrop[19];
				player.croptargety = dashcroptarget[20];
				player.cropwidth = dashcrop[19];
				player.cropheight = dashcrop[20];
			}
		}
		slideframes++;
	}
	////Player standing still
	else if((player.walljump || !player.running) && !player.jumping){
		if(player.shooting){
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = shootcroptarget[0];
				player.croptargety = shootcroptarget[1];
				player.cropwidth = shootcrop[0];
				player.cropheight = shootcrop[1];
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-shootcroptarget[0]-shootcrop[0];
				player.croptargety = shootcroptarget[1];
				player.cropwidth = shootcrop[0];
				player.cropheight = shootcrop[1];
			}
		}
		else{
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = croptarget[0];
				player.croptargety = croptarget[1];
				player.cropwidth = crop[0];
				player.cropheight = crop[1];
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-croptarget[0]-crop[0];
				player.croptargety = croptarget[1];
				player.cropwidth = crop[0];
				player.cropheight = crop[1];
			}
		}
	}
	////Player running
	else if(!player.jumping && player.running){
		//Counts frames
		if(runframes > 4){
			if(runframes%3 == 0){
				if(runframes == 33){
					i = 0;
					runframes = 5;
				}
				else{
					i = i + 2;
				}
			}
		}
		//Player shoots
		if(player.shooting){
			//To the right
			if(player.turning){	
				player.image = player.imageNor;
				player.croptargetx = shootcroptarget[i];
				player.croptargety = shootcroptarget[i+1];
				player.cropwidth = shootcrop[i];
				player.cropheight = shootcrop[i+1];
			}
			//To the left
			else{	
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-shootcroptarget[i]-shootcrop[i];
				player.croptargety = shootcroptarget[i+1];
				player.cropwidth = shootcrop[i];
				player.cropheight = shootcrop[i+1];
			}
		}
		//Player runs normally
		else{
			//To the right
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = croptarget[i];
				player.croptargety = croptarget[i+1];
				player.cropwidth = crop[i];
				player.cropheight = crop[i+1];
			}
			//To the left
			else{	
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-croptarget[i]-crop[i];
				player.croptargety = croptarget[i+1];
				player.cropwidth = crop[i];
				player.cropheight = crop[i+1];
			}
		}
		//Add frame
		runframes++;	
	}	
	//Walljumpin
	else if(player.walljump){
		if(player.shooting){
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = 283;
				player.croptargety = 344;
				player.cropwidth = 32;
				player.cropheight = 45;
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-283-32;
				player.croptargety = 344;
				player.cropwidth = 32;
				player.cropheight = 45;
			}	
		}
		else{
			if(player.turning){
				player.image = player.imageNor;
				player.croptargetx = 73;
				player.croptargety = 347;
				player.cropwidth = 29;
				player.cropheight = 45;
			}
			else{
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-73-29;
				player.croptargety = 346;
				player.cropwidth = 29;
				player.cropheight = 45;
			}
		}
	}
	////Player jumping
	else if(player.jumping){
		if(player.shooting){
			//To the right	
			if(player.turning){	
				player.image = player.imageNor;
				player.croptargetx = 281;
				player.croptargety = 109;
				player.cropwidth = 37;
				player.cropheight = 40;
			}
			//To the left
			else{	
				player.image = player.imageRev;
				player.croptargetx = player.imageRev.width-281-37;
				player.croptargety = 109;
				player.cropwidth = 37;
				player.cropheight = 40;
			}
		}
		else{
			//To the right	
			if(player.turning){	
				player.image = player.imageNor;
				player.croptargetx = 85;
				player.croptargety = 102;
				player.cropwidth = 30;
				player.cropheight = 43;
			}
			//To the left
			else{	
				player.image = player.imageRev;
				player.croptargetx = 844;
				player.croptargety = 102;
				player.cropwidth = 30;
				player.cropheight = 45;
			}
		}
	}
	//Resizing player and resetting counters
	if(!player.dashing || player.jumping){
		s = 1;
		player.width = player.defaultwidth;
	}
	if(!player.running)
		i = 0, runframes = 0;

	if(player.shooting)
		shootframes++;
	else
		shootframes = 0;
}
function playerCheckArray(dArray){
	for(var j = 0; j < dArray.length; j++){
		var playerDown = (player.y+player.height >= dArray[j].y && player.y+player.height <= dArray[j].y+0.5*dArray[j].height) &&  		//y
		(player.x+0.8*player.width >= dArray[j].x && player.x+0.2*player.width <= dArray[j].x+dArray[j].width); 						//x

		var playerUp = (player.y <= dArray[j].y+dArray[j].height && player.y > dArray[j].y+0.5) &&			 							//y
		(player.x+0.8*player.width >= dArray[j].x && player.x+0.2*player.width <= dArray[j].x+dArray[j].width);							//x

		var playerLeft = (player.y+0.9*player.height >= dArray[j].y && player.y+0.1*player.height <= dArray[j].y+dArray[j].height) && 	//y
		(player.x < dArray[j].x+dArray[j].width && player.x > dArray[j].x+0.5*dArray[j].width);											//x

		var playerRight = (player.y+0.9*player.height >= dArray[j].y && player.y+0.1*player.height <= dArray[j].y+dArray[j].height) && 	//y
		(player.x+player.width > dArray[j].x && player.x+player.width < dArray[j].x+0.5*dArray[j].width);								//x

    	//Descending 
    	if(playerDown){
			player.y = dArray[j].y-player.height;
	        player.vy = 0; 
	        player.jumping = false;
	        player.walljump = false;
		}
   		//Ascending 
    	else if(playerUp){
 			player.y = dArray[j].y+dArray[j].height;
 			player.vy = 1;
 			//alert("up");
		}
		//From the right
		else if(playerLeft){
			player.x = dArray[j].x+dArray[j].width;
			player.vx = 0;
			player.vy = 1;
			player.dashing = false;
			player.walljump = true;
			player.turning = false;
			//alert("right");
		}
		//From the left
		else if(playerRight){
			player.x = dArray[j].x-player.width;
			player.vx = 0;
			player.vy = 1;
			player.dashing = false;
			player.walljump = true;
			player.turning = true;
			//alert("left");
		}
	}
}
function lemonCheckArray(){
	for(var j = 0; j < Lemons.length; j++){
		var destroy = null;
		//Checking collission with vertical platforms
		for(var k = 0; k < wallPlatforms.length; k++){ 
			var lemonX = ((Lemons[j].x < wallPlatforms[k].x+wallPlatforms[k].width && Lemons[j].x > wallPlatforms[k].x) || 
			(Lemons[j].x+Lemons[j].width > wallPlatforms[k].x && Lemons[j].x+Lemons[j].width < wallPlatforms[k].x+wallPlatforms[k].width))
			var lemonY = (Lemons[j].y < wallPlatforms[k].y+wallPlatforms[k].height && Lemons[j].y+Lemons[j].height > wallPlatforms[k].y)

			if(lemonX && lemonY)
				destroy = true, k = wallPlatforms.length;
		}
		//Checking collission with horizontal platforms
		for(var k = 0; k < Platforms.length; k++){ 
			var lemonX = ((Lemons[j].x < Platforms[k].x+Platforms[k].width && Lemons[j].x > Platforms[k].x) || 
			(Lemons[j].x+Lemons[j].width > Platforms[k].x && Lemons[j].x+Lemons[j].width < Platforms[k].x+Platforms[k].width))
			var lemonY = (Lemons[j].y < Platforms[k].y+Platforms[k].height && Lemons[j].y+Lemons[j].height > Platforms[k].y)

			if(lemonX && lemonY)
				destroy = true, k = Platforms.length;
		}
		if(Lemons[j].x > canvas.width || Lemons[j].x+Lemons[j].width < 0)
			destroy = true;
		
		if(destroy)
			Lemons.splice(j, 1)
	}
}
function drawArray(dArray){
	for(var k = 0; k < dArray.length; k++){	
		context.drawImage(dArray[k].image, dArray[k].x, dArray[k].y, dArray[k].width, dArray[k].height);
	}
}

// target the user's browser.
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || 
                              window.mozRequestAnimationFrame || 
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

  window.requestAnimationFrame = requestAnimationFrame;
})();

//Windows event added
document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
    e.preventDefault();
});
document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
    e.preventDefault();
});