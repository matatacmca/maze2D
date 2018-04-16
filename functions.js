function pageLoad()
{
	//$.ajaxSetup({ cache: false });
	displayHowTo();
}
function displayHowTo()
{
	document.getElementById('howTo').style.display = "block";
	lastLevel = document.getElementById('lastLevel');
	levelNumber = getCookie('maze2DLevel') || 1;
	lastLevel.innerText = `You last played at level ${levelNumber}`;
}
function restartGame()
{
	startGame(1);
}
function startGame(level)
{
	level = level || getCookie('maze2DLevel');
	window.addEventListener("keydown",function(){playerMovement();});
	getLevel(level);
	setInterval(function(){dropScore();},1000);
}
function playerMovement(e)
{
	e = e || window.event;
	if(e.keyCode == '38')//move player up
	{
		let player = document.getElementById('player');
		let x =(parseInt(player.attributes.blocksX.value));
		let y =(parseInt(player.attributes.blocksY.value) -1);
		if(cleanMove(x,y))
		{
			player.attributes.blocksY.value = y;
			player.style.top = `${y *5}%`;
		}
	}
	else if(e.keyCode == 40)//move Player down
	{
		let player = document.getElementById('player');
		let x =(parseInt(player.attributes.blocksX.value));
		let y =(parseInt(player.attributes.blocksY.value) +1);
		if(cleanMove(x,y))
		{
			player.attributes.blocksY.value = y;
			player.style.top = `${y *5}%`;
		}
	}
	else if(e.keyCode == 37)//move Player left
	{
		let player = document.getElementById('player');
		let x =(parseInt(player.attributes.blocksX.value) -1);
		let y =(parseInt(player.attributes.blocksY.value));
		if(cleanMove(x,y))
		{
			player.attributes.blocksX.value = x;
			player.style.left = `${x *2.5}%`;
		}
	}
	else if(e.keyCode == 39)//move Player left
	{
		let player = document.getElementById('player');
		let x =(parseInt(player.attributes.blocksX.value) +1);
		let y =(parseInt(player.attributes.blocksY.value));
		if(cleanMove(x,y))
		{
			player.attributes.blocksX.value = x;
			player.style.left = `${x *2.5}%`;
		}
	}
}
function cleanMove(x,y)//validates move, and determines what action to take
{
	//validate if move is on the board
	if((y >= 0 && y <= 19) && (x >= 0 && x <= 39))//the move is on the board
	{
		//determine whether there are other entities blocking the move
		let entities = document.getElementsByClassName('entity');
		let legal = true;
		for(i = 0; i < entities.length; i++)
		{
			let blocksX = entities[i].attributes.blocksX.value;
			let blocksY = entities[i].attributes.blocksY.value;
			if((`${blocksX},${blocksY}` == `${x},${y}`) && (entities[i].className.includes('obstruct')))
			{
				legal = false;
			}
			else if((`${blocksX},${blocksY}` == `${x},${y}`) && (entities[i].className.includes('coin')))//determines if the item is a coin to collect and destroy coin
			{
				collectCoin(entities[i]);
			}
			else if((`${blocksX},${blocksY}` == `${x},${y}`) && (entities[i].id == "destination"))//determines if the item is the destination
			{
				nextLevel();
			}
		}
		return legal;
	}
	else
	{
		return(false);
	}
}
function collectCoin(domElement)
{
	domElement.parentNode.removeChild(domElement);
	document.querySelector('#scoreContainer p').innerText = parseInt(document.querySelector('#scoreContainer p').innerText) +10;
}
function nextLevel()
{
	window.alert('You just leveled up. Congratulations!!!');
	getLevel(parseInt(getCookie('maze2DLevel')) +1);
}
function getLevel(level)
{
	level = parseInt(level) || 1;
	$.ajax({
		url:"assets/levels.json",
		success: function(msg){
			let levelData = msg.levels[level] || msg.levels[0];
			unpackLevel(levelData);
			document.cookie=`maze2DLevel=${level}`;
		}
	});
}
function unpackLevel(levelData)
{
	document.querySelector('#scoreContainer p').innerText = "0";
	let level = "";
	for(y=0;y<levelData.length;y++)
	{
		for(x=0;x<levelData[y].length;x++)
		{
			//determine blocks to display
			if(levelData[y][x] == "c")//coin tile
			{
				level += `<div style="left:${x * 2.5}%;top:${y * 5}%" class="entity coin" blocksX="${x}" blocksY="${y}"></div>`;
			}
			else if(levelData[y][x] == "p")//Player tile
			{
				level += `<div style="left:${x * 2.5}%;top:${y * 5}%" class="entity" id="player" blocksX="${x}" blocksY="${y}"></div>`;
			}
			else if(levelData[y][x] == "x")//Player tile
			{
				level += `<div style="left:${x * 2.5}%;top:${y * 5}%" class="entity" id="destination" blocksX="${x}" blocksY="${y}"></div>`;
			}
			if(levelData[y][x] == "w")//Wall tile
			{
				level += `<div style="left:${x * 2.5}%;top:${y * 5}%" class="entity wall obstruct" blocksX="${x}" blocksY="${y}"></div>`;
			}
		}
	}
		document.getElementById('main').innerHTML=level;
}
function getCookie(cname)
{
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}
function dropScore()
{
	document.querySelector('#scoreContainer p').innerText = parseInt(document.querySelector('#scoreContainer p').innerText) -1;
}
function displayCredits()
{
	document.getElementById('credits').style.display = 'block';
}