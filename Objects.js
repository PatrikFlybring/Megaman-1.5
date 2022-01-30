function Options(){
	this.accessed = false;
	this.gravity = 0.4;
	this.friction = 0.5;
	this.left = 37;
	this.defaultleft = this.left;
	this.right = 39;
	this.defaultright = this.right;
	this.jump = 32;
	this.defaultjump = this.jump;
	this.dash = 16;
	this.defaultdash = this.dash;
	this.shoot = 90;
	this.defaultshoot = this.shoot;
}
function Player(){
	this.height = 95;
	this.width = 75;
	this.defaultheight = this.height;
	this.defaultwidth = this.width;
	this.vx = 0;
	this.vy = 0;
	this.speed = 5;
	this.image = new Image();
	this.image.src = "./Images/MegamanSprite.png";
	this.imageNor = new Image();
	this.imageNor.src = "./Images/MegamanSprite.png";
	this.imageRev = new Image();
	this.imageRev.src = "./Images/MegamanSpriteReversed.png";
	this.croptargetx = 0;
	this.croptargety = 155;
	this.cropwidth = 38;
	this.cropheight = 40;
	this.x = 800;
	this.y = 300;
	this.jumping = false;
	this.running = false;
	this.turning = true;
	this.walljump = false;
	this.dashing = false;
	this.shooting = false;
	this.update = function updatePlayer(){
		//Moves player depending on speed
		player.x += player.vx * player.speed;
		player.y += player.vy * player.speed;

		//Enables gravity
		if(player.vy < 3)
			player.vy += options.gravity;

	    //Sets friction
    	if(!player.running && !player.jumping && !player.dashing)
	 		player.vx *= options.friction;

		//Checks if player moves sideways
		if(player.vx != 0)
			player.walljump = false;

		//Checks if player is falling
		if(player.vy > 0 && !player.walljump)
			player.jumping = true;
	}
}
function Lemon(){
	this.x = null;
	this.y = null;
	this.width = 16;
	this.height = 12;
	this.speed = 14;
	this.image = new Image();
	this.image.src = "./Images/Lemon.png";
	this.imageNor = new Image();
	this.imageNor.src = "./Images/Lemon.png";
	this.imageRev = new Image();
	this.imageRev.src = "./Images/LemonReversed.png";
	this.croptargetx = 81;
	this.croptargety = 75;
	this.cropwidth = 8;
	this.cropheight = 6;
	this.direction = true;
}
function Arcman(){

}
function Arcball(){

}
function Platform(){
	this.height = 35;
	this.width = 135;
	this.x = 35;
	this.y = 560;
	this.image = new Image();
	this.image.src = "./Images/PlatformPiece.png";
}
function WallPlatform(){
	this.height = 135;
	this.width = 35;
	this.x = 650;
	this.y = 350;
	this.image = new Image();
	this.image.src = "./Images/VerticalPlatformPiece.png";
}
var wallPlatforms = new Array();
for(var y = 0; y < 4; y++){
	var wallplatform = new WallPlatform();
	if(y%2)
		wallplatform.x = 650;
	else
		wallplatform.x = 450

	wallplatform.y = wallplatform.y - 120 * y;
	wallPlatforms[y] = wallplatform;
}

var Platforms = new Array();
for(var y = 0; y < 9; y++){
	var platform = new Platform();
	platform.x += platform.width * y;
	Platforms[y] = platform;
}

var Lemons = new Array();

var player = null;
var options = null;
var lemon = null;

var i = 0;
var s = 1;
var runframes = 0;
var slideframes = 0;
var shootframes = 0;
var canvas = null;
var context = null;
var keys = [];
var jumpKeyPressed = false;
var dashKeyPressed = false;
var shootKeyPressed = false;

var croptarget = new Array();
var crop = new Array();
croptarget[0] = 3; croptarget[1] = 158;
crop[0] = 33; crop[1] = 35;
croptarget[2] = 36; croptarget[3] = 158; 
crop[2] = 28; crop[3] = 35;
croptarget[4] = 60; croptarget[5] = 158;
crop[4] = 33; crop[5] = 35;
croptarget[6] = 93; croptarget[7] = 158;
crop[6] = 33; crop[7] = 35;
croptarget[8] = 132; croptarget[9] = 158;
crop[8] = 33; crop[9] = 35;
croptarget[10] = 171; croptarget[11] = 158;
crop[10] = 33; crop[11] = 35;
croptarget[12] = 200; croptarget[13] = 158;
crop[12] = 33; crop[13] = 35;
croptarget[14] = 229; croptarget[15] = 158;
crop[14] = 33; crop[15] = 35;
croptarget[16] = 262; croptarget[17] = 158;
crop[16] = 33; crop[17] = 35;
croptarget[18] = 300; croptarget[19] = 158;
crop[18] = 33; crop[19] = 35;
croptarget[20] = 337; croptarget[21] = 158;
crop[20] = 33; crop[21] = 35;

var shootcroptarget = new Array();
var shootcrop = new Array();
shootcroptarget[0] = 40; shootcroptarget[1] = 61;
shootcrop[0] = 37; shootcrop[1] = 35;
shootcroptarget[2] = 3; shootcroptarget[3] = 201; 
shootcrop[2] = 37; shootcrop[3] = 35;
shootcroptarget[4] = 38; shootcroptarget[5] = 201;
shootcrop[4] = 37; shootcrop[5] = 35;
shootcroptarget[6] = 77; shootcroptarget[7] = 201;
shootcrop[6] = 37; shootcrop[7] = 35;
shootcroptarget[8] = 119; shootcroptarget[9] = 201;
shootcrop[8] = 37; shootcrop[9] = 35;
shootcroptarget[10] = 160; shootcroptarget[11] = 201;
shootcrop[10] = 37; shootcrop[11] = 35;
shootcroptarget[12] = 198; shootcroptarget[13] = 201;
shootcrop[12] = 37; shootcrop[13] = 35;
shootcroptarget[14] = 235; shootcroptarget[15] = 201;
shootcrop[14] = 37; shootcrop[15] = 35;
shootcroptarget[16] = 274; shootcroptarget[17] = 201;
shootcrop[16] = 37; shootcrop[17] = 35;
shootcroptarget[18] = 315; shootcroptarget[19] = 201;
shootcrop[18] = 37; shootcrop[19] = 35;
shootcroptarget[20] = 354; shootcroptarget[21] = 201;
shootcrop[20] = 37; shootcrop[21] = 35;

var dashcroptarget = new Array();
var dashcrop = new Array();
dashcroptarget[1] = 4, dashcroptarget[2] = 251;
dashcrop[1] = 29, dashcrop[2] = 35;
dashcroptarget[3] = 38, dashcroptarget[4] = 251;
dashcrop[3] = 45, dashcrop[4] = 35;
dashcroptarget[5] = 87, dashcroptarget[6] = 253;
dashcrop[5] = 64, dashcrop[6] = 35;
dashcroptarget[7] = 157, dashcroptarget[8] = 253;
dashcrop[7] = 72, dashcrop[8] = 35;
dashcroptarget[9] = 238, dashcroptarget[10] = 255;
dashcrop[9] = 73, dashcrop[10] = 35;
dashcroptarget[11] = 318, dashcroptarget[12] = 254;
dashcrop[11] = 83, dashcrop[12] = 35;
dashcroptarget[13] = 407, dashcroptarget[14] = 254;
dashcrop[13] = 92, dashcrop[14] = 35;
dashcroptarget[15] = 507, dashcroptarget[16] = 254;
dashcrop[15] = 103, dashcrop[16] = 35;
dashcroptarget[17] = 626, dashcroptarget[18] = 254;
dashcrop[17] = 104, dashcrop[18] = 35;
dashcroptarget[19] = 739, dashcroptarget[20] = 252;
dashcrop[19] = 40, dashcrop[20] = 35;