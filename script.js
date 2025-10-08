const canvas=document.getElementById('c');const ctx=canvas.getContext('2d');let DPR=devicePixelRatio||1;
function resize(){canvas.width=Math.floor(canvas.clientWidth*DPR);canvas.height=Math.floor(canvas.clientHeight*DPR);ctx.scale(DPR,DPR)}
resize();window.addEventListener('resize',()=>{DPR=devicePixelRatio||1;resize()})

let player={x:50,y:350,w:50,h:50,vy:0,onGround:true,skin:'bird',shieldActive:false,shieldTimer:0};
let gravity=0.9,jumpPower=-16;let obstacles=[],spawnTimer=0;let score=0,running=true,coins=0;
const skinPrices={'bird':0,'dragon':100,'unicorn':150,'phoenix':200,'eagle':50,'owl':60,'parrot':40,'pegasus':250,'crow':30,'flamingo':70,'bat':80,'gryphon':300,'swan':90,'toucan':60,'kiwi':50,'hawk':70,'raptor':200,'falcon':120,'hummingbird':40,'condor':150};
let shieldPrices={'basic':50,'advanced':100,'super':200};let ownedSkins={'bird':true};let ownedShields={};
let skinsDiv=document.getElementById('skins');for(let s in skinPrices){let d=document.createElement('div');d.className='skin';d.innerText=s+' ('+skinPrices[s]+')';d.dataset.skin=s;skinsDiv.appendChild(d)}
let shieldsDiv=document.getElementById('shields');for(let s in shieldPrices){let d=document.createElement('div');d.className='shield';d.innerText=s+' ('+shieldPrices[s]+')';d.dataset.shield=s;shieldsDiv.appendChild(d)}

function reset(){player.y=350;player.vy=0;obstacles=[];spawnTimer=0;score=0;coins=0;running=true;player.shieldActive=false;player.shieldTimer=0;document.getElementById('restart').classList.add('hidden');document.getElementById('msg').textContent='Jumping Run Ultimate • Tap to jump'}
reset();

function spawnObstacle(){const h=30+Math.random()*40;obstacles.push({x:canvas.width+40,y:400-h,w:20+Math.random()*30,h:h})}

function update(){if(!running)return;player.vy+=gravity;player.y+=player.vy;if(player.y+player.h>=400){player.y=400-player.h;player.vy=0;player.onGround=true}else player.onGround=false;
spawnTimer-=1;if(spawnTimer<=0){spawnObstacle();spawnTimer=60+Math.floor(Math.random()*60)-Math.floor(score/100);if(spawnTimer<30)spawnTimer=30}
for(let i=obstacles.length-1;i>=0;i--){obstacles[i].x-=6;if(obstacles[i].x+obstacles[i].w<0){obstacles.splice(i,1);score+=10;coins+=1}if(rectIntersect(player,obstacles[i])){if(player.shieldActive){player.shieldActive=false;player.shieldTimer=0;playSound('shield.mp3')}else{playSound('hit.mp3');gameOver()}}}
if(player.shieldActive){player.shieldTimer--;if(player.shieldTimer<=0){player.shieldActive=false}};
document.getElementById('score').textContent='Score: '+score+' • Coins: '+coins}

function rectIntersect(a,b){return!(a.x>b.x+b.w||a.x+a.w<b.x||a.y>b.y+b.h||a.y+a.h<b.y)}

function draw(){ctx.clearRect(0,0,canvas.width/DPR,canvas.height/DPR);
ctx.fillStyle='#228B22';ctx.fillRect(0,400,canvas.width/DPR,canvas.height/DPR-400);
ctx.fillStyle=player.shieldActive?'cyan':'#f97316';ctx.fillRect(player.x,player.y,player.w,player.h);
ctx.fillStyle='gold';for(let ob of obstacles)ctx.fillRect(ob.x,ob.y,ob.w,ob.h)}

function loop(){update();draw();requestAnimationFrame(loop)}
loop()

function jump(){if(player.onGround){player.vy=jumpPower;player.onGround=false;playSound('jump.mp3')}}
canvas.addEventListener('touchstart',(e)=>{e.preventDefault();jump()},{passive:false});
canvas.addEventListener('mousedown',(e)=>{jump()});
window.addEventListener('keydown',(e)=>{if(e.code==='Space')jump()})

document.getElementById('restart').addEventListener('click',()=>{reset()})
document.getElementById('shop').addEventListener('click',()=>{document.getElementById('shop-menu').classList.remove('hidden')})
document.getElementById('close-shop').addEventListener('click',()=>{document.getElementById('shop-menu').classList.add('hidden')})
document.querySelectorAll('.skin').forEach(el=>{el.addEventListener('click',()=>{let s=el.dataset.skin;if(ownedSkins[s]){player.skin=s;alert('Equipped '+s)}else if(coins>=skinPrices[s]){coins-=skinPrices[s];ownedSkins[s]=true;player.skin=s;alert('Purchased & Equipped '+s)}else{alert('Not enough coins')}})})
document.querySelectorAll('.shield').forEach(el=>{el.addEventListener('click',()=>{let s=el.dataset.shield;if(ownedShields[s]){activateShield(s)}else if(coins>=shieldPrices[s]){coins-=shieldPrices[s];ownedShields[s]=true;activateShield(s);alert('Purchased & Activated '+s+' Shield')}else{alert('Not enough coins')}})})
document.getElementById('shield-btn').addEventListener('click',()=>{activateShield('basic')})
function activateShield(type){player.shieldActive=true;player.shieldTimer=300;playSound('shield.mp3')}

function gameOver(){running=false;document.getElementById('msg').textContent='Game Over';document.getElementById('restart').classList.remove('hidden')}
function playSound(file){/* placeholder for sounds: jump, coin, hit, shield, gameover */}
