var canvas = document.getElementById('canvas');
let divFps = document.getElementById("fps");

var engine = null;
var scene = null;
var sceneToRender = null;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

var createScene = function () {
            var scene = new BABYLON.Scene(engine);
            //physics
var gravityVector = new BABYLON.Vector3(0,-9.31, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);
var physicsViewer = new BABYLON.Debug.PhysicsViewer();
var physicsHelper = new BABYLON.PhysicsHelper(scene);  
var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-40, 10, 0), scene);
camera.radius = 70;
camera.heightOffset = 10;
camera.rotationOffset = 180;
camera.cameraAcceleration = 0.1;
camera.maxCameraSpeed = 100;
//camera.lowerRadiusLimit = 40;
//camera.upperRadiusLimit = 90;
//camera.lowerHeightOffsetLimit = 0;
//camera.upperHeightOffsetLimit = 80;
//camera.lowerRotationOffsetLimit = 100;
//camera.upperRotationOffsetLimit = 240;
//camera.minZ = 0;
//camera.maxZ = 270;
camera.attachControl(canvas, true);




//ROBOT

var robbox = BABYLON.MeshBuilder.CreateBox("robbox",{ height: 30, width: 50, depth: 10}, scene);
robbox.visibility = 0.5;

var cub1 = BABYLON.Mesh.CreateSphere("cub1", 15, 25, scene);
cub1.position = new BABYLON.Vector3(70, 23, 0);
var a = BABYLON.CSG.FromMesh(cub1);

var tot = BABYLON.MeshBuilder.CreateBox("anibot",{ height: 15, width: 15, depth: 20}, scene);
tot.position = new BABYLON.Vector3(70, 23, 0);


var b = BABYLON.CSG.FromMesh(tot);

//csg
var anibot = b.intersect(a).toMesh("c", null, scene);

anibot.position.x = -3100;
anibot.position.y = -60;
anibot.position.z = -200;
cub1.dispose();
tot.dispose();


//anibot.physicsImpostor = new BABYLON.PhysicsImpostor(anibot, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0.001, restitution: 0}, scene);
const myShape = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(20, 10, 0),
    new BABYLON.Vector3(10, 20, 0),
    new BABYLON.Vector3(15, 20, 0),
    new BABYLON.Vector3(10, 30, 0)
];

//Create lathe
//const anibotbot = new BABYLON.MeshBuilder.CreateCapsule("anibotbot", {radius:0.5, height:10, radiusTop:4});
//const anibotbot = BABYLON.MeshBuilder.CreateLathe("anibotbot", {shape: myShape});
//anibotbot.scaling = new BABYLON.Vector3(0.35, 0.35, 0.35);
//anibotbot.parent = anibot;
//anibotbot.position = new BABYLON.Vector3(0, -7, 0);
//anibotbot.rotation.z = 90*Math.PI/2;

const anibotbot = BABYLON.SceneLoader.ImportMesh("", "./assets/elica/", "15532_P-38EJL_Lightning_Propeller_V1_new.obj", scene, function(object) {
    // You can apply properties to object.
    ani = object[0];
    ani.scaling = new BABYLON.Vector3(0.07, 0.1, 0.1);
    ani.position.y=-10;
    ani.rotation.z=180*Math.PI/2;
    ani.parent = anibot;
    var mat = new BABYLON.StandardMaterial("mat", scene);
                    var texture = new BABYLON.Texture("textures/elica.jpg", scene);
                    mat.diffuseTexture = texture;
                    ani.material=mat;
                    scene.registerBeforeRender(function () {
                       ani.rotation.y -=1;
                     
        
                    });
   });
   anibotbot.parent = anibot;
   

var planeOpts = {
    height: 10, 
    width: 12, 
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
};
var schermo = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, scene);
schermo.parent = anibot;
schermo.position= new BABYLON.Vector3(7.6,0, 0);
schermo.rotation.y = Math.PI/2;
var schermoMat = new BABYLON.StandardMaterial("m", scene);
	var schermoVidTex = new BABYLON.VideoTexture("vidtex","textures/gatos_.mp4", scene);
	schermoMat.diffuseTexture = schermoVidTex;
	schermoMat.roughness = 1;
	schermoMat.emissiveColor = new BABYLON.Color3.White();
	schermo.material = schermoMat;
	scene.onPointerObservable.add(function(evt){
			if(evt.pickInfo.pickedMesh === schermo){
                //console.log("picked");
					if(schermoVidTex.video.paused)
						schermoVidTex.video.play();
					else
						schermoVidTex.video.pause();
                    console.log(schermoVidTex.video.paused?"paused":"playing");
			}
	}, BABYLON.PointerEventTypes.POINTERPICK);
    //console.log(schermo);

var robhead = BABYLON.Mesh.CreateSphere("robhead", 32, 10, scene);
robhead.parent = anibot;
robhead.position.y = 8;

var robeye = BABYLON.Mesh.CreateSphere("robeye", 2, 2, scene);
robeye.parent = robhead;
robeye.position = new BABYLON.Vector3(3,3, 2);

var robeye2 = BABYLON.Mesh.CreateSphere("robeye2", 2, 2, scene);
robeye2.parent = robhead;
robeye2.position = new BABYLON.Vector3(3,3, -2);


var antenna = BABYLON.MeshBuilder.CreateCylinder("antenna", {diameterTop:1, diameterBottom: 1, height: 5, tessellation: 96}, scene);
antenna.parent = robhead;
antenna.position = new BABYLON.Vector3(0, 5, 0);
var robheadsphere = BABYLON.Mesh.CreateSphere("robheadsphere", 2, 2, scene);
robheadsphere.parent = robhead;
robheadsphere.position = new BABYLON.Vector3(0, 8, 0);



const baselica = new BABYLON.MeshBuilder.CreateCapsule("baselica", {radius:2.5, capSubdivisions: 6, subdivisions:6, tessellation:36, height:20}, scene)
baselica.parent = anibot;
baselica.position.x = -10;
baselica.rotation.z = Math.PI/2;

var sphelica = BABYLON.Mesh.CreateSphere("robhead", 32, 5, scene);
sphelica.parent = baselica;
sphelica.position.y = 8;

const elica = BABYLON.MeshBuilder.CreateSphere("elica", {arc: 0.3, sideOrientation: BABYLON.Mesh.DOUBLESIDE,diameterX: 8, diameterY: 3.5, diameterZ: 3.5});
elica.parent = sphelica;
elica.position.y = 0;
elica.position.x = 5;
elica.rotation.z = 180*Math.PI/2;
elica.rotation.y = 90*Math.PI/2;
elica.rotation.x = Math.PI/2;

const elica2 = BABYLON.MeshBuilder.CreateSphere("elica2", {arc: 0.3, sideOrientation: BABYLON.Mesh.DOUBLESIDE,diameterX: 8, diameterY: 3.5, diameterZ: 3.5});
elica2.parent = sphelica;
elica2.position.y = 0;
elica2.position.x = 0;
elica2.position.z = -5;
elica2.rotation.z = 90*Math.PI/2;
elica2.rotation.y = Math.PI/2;
elica2.rotation.x = Math.PI/2;

const elica3 = BABYLON.MeshBuilder.CreateSphere("elica3", {arc: 0.3, sideOrientation: BABYLON.Mesh.DOUBLESIDE,diameterX: 8, diameterY: 3.5, diameterZ: 3.5});
elica3.parent = sphelica;
elica3.position.y = 0;
elica3.position.x = 0;
elica3.position.z = 5;
elica3.rotation.z = 90*Math.PI/2;
elica3.rotation.y = -Math.PI/2;
elica3.rotation.z = 90*Math.PI/2;
elica3.rotation.x = Math.PI/2;

const elica4 = BABYLON.MeshBuilder.CreateSphere("elica4", {arc: 0.3, sideOrientation: BABYLON.Mesh.DOUBLESIDE,diameterX: 8, diameterY: 3.5, diameterZ: 3.5});
elica4.parent = sphelica;
elica4.position.y = 0;
elica4.position.x = -5;
elica4.rotation.z = 90*Math.PI/2;
elica4.rotation.y = 90*Math.PI/2;
elica4.rotation.x = Math.PI/2;

var a = 0;

// Code in this function will run ~60 times per second
scene.registerBeforeRender(function () {
    a +=0.005;
        sphelica.rotation.y += 0.5;
        //anibotbot.rotation.y-=0.05;
       // anibotbot.rotate(new BABYLON.Vector3 (0.1,1.2,0.1), 0.15, BABYLON.Space.LOCAL); 

  


});


var leftarm1 = BABYLON.MeshBuilder.CreateCylinder("leftarm1", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
leftarm1.rotation.x = Math.PI/2;
leftarm1.parent = anibot;
leftarm1.position = new BABYLON.Vector3(0, 0, -15);


var leftarm2 = new BABYLON.MeshBuilder.CreateCapsule("capsule", {radius:2, capSubdivisions: 1, height:15, tessellation:4, topCapSubdivisions:12});
leftarm2.parent = leftarm1;
leftarm2.rotation.x = -Math.PI/2;
leftarm2.position = new BABYLON.Vector3(0, -7, 0);

const torus2 = BABYLON.MeshBuilder.CreateTorus("torus2", {thickness: 0.7, diameter: 5.5});
torus2.parent = leftarm2;
torus2.position = new BABYLON.Vector3(0, -6.5, 0);

var luce1 = BABYLON.Mesh.CreateSphere("luce1", 32, 5, scene);
luce1.parent = torus2;
luce1.position = new BABYLON.Vector3(0, -2.5, 0);




var rightarm1 = BABYLON.MeshBuilder.CreateCylinder("rightarm1", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
rightarm1.rotation.x = Math.PI/2;
rightarm1.parent = anibot;
rightarm1.position = new BABYLON.Vector3(0, 0, 15);


var rightarm2 =new BABYLON.MeshBuilder.CreateCapsule("capsule", {radius:2, capSubdivisions: 1, height:15, tessellation:4, topCapSubdivisions:12});
rightarm2.parent = rightarm1;
rightarm2.rotation.x = -Math.PI/2;
rightarm2.position = new BABYLON.Vector3(0, 7, 0);

const torus = BABYLON.MeshBuilder.CreateTorus("torus", {thickness: 0.7, diameter: 5.5});
torus.parent = rightarm2;
torus.position = new BABYLON.Vector3(0, -6.5, 0);

var luce2 = BABYLON.Mesh.CreateSphere("luce2", 32, 5, scene);
luce2.parent = torus;
luce2.position = new BABYLON.Vector3(0, -2.5, 0);

camera.lockedTarget = anibot;
//mapping commands
var map = {};
scene.actionManager = new BABYLON.ActionManager(scene);

scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

}));

scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown ";
}));




scene.registerBeforeRender(function () {

    if ((map["w"] || map["W"])) {
        anibot.translate(BABYLON.Axis.X, 1, BABYLON.Space.LOCAL);
    }
    if ((map["s"] || map["S"])) {
        anibot.translate(BABYLON.Axis.X, -1, BABYLON.Space.LOCAL);
    }
    if ((map["a"] || map["A"])) {
        anibot.rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL);
    }
    if ((map["d"] || map["D"])) {
        anibot.rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL);
    }
    if ((map[" "])) {
        anibot.translate(BABYLON.Axis.Y, 1, BABYLON.Space.LOCAL);
    }

});
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        
            var cowsound = new BABYLON.Sound("cow2", "sounds/cow2.wav", scene);
            var dogsound = new BABYLON.Sound("dog", "sounds/dog.wav", scene);
            var catsound = new BABYLON.Sound("hana", "sounds/hana.wav", scene);
            var foxsound = new BABYLON.Sound("fox", "sounds/fox.wav", scene);
            var pigsound = new BABYLON.Sound("pig", "sounds/pig.wav", scene);
            var storksound = new BABYLON.Sound("stork", "sounds/stork.wav", scene);
            var rabbitsound = new BABYLON.Sound("rabbit", "sounds/rabbit.wav", scene);
            var batsound = new BABYLON.Sound("bat", "sounds/bat.wav", scene);

                //Grass
                const ground = BABYLON.MeshBuilder.CreateBox("ground",{width:4000, height:20, depth:8000}, scene);
                
                ground.position = new BABYLON.Vector3(-2000, -100, 0);
                ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution:0}, scene);
                const groundMat = new BABYLON.StandardMaterial("groundMat");
                groundMat.diffuseColor = new BABYLON.Color3.Teal();
                var grassMaterial = new BABYLON.StandardMaterial(name + "bawl", scene);
                var grassTexture = new BABYLON.GrassProceduralTexture(name + "textbawl", 656, scene);
                grassMaterial.ambientTexture = grassTexture;
                ground.material = grassMaterial; //Place the material property of the ground


                //large ground
    const largeGroundMat = new BABYLON.StandardMaterial("largeGroundMat");
    largeGroundMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/valleygrass.png");
    
    const largeGround = BABYLON.MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:4000, height:8000, subdivisions: 15, minHeight:70, maxHeight: 0});
    largeGround.material = largeGroundMat;
    largeGround.position.y = -100;
    largeGround.position = new BABYLON.Vector3(2000, -100, 0);


            const cat = BABYLON.SceneLoader.ImportMesh("", "./assets/cat/", "cat.obj", scene, function(object) {
             // You can apply properties to object.
             cat2 = object[0];
             cat2.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
             cat2.rotation.z=180*Math.PI/2;
             cat2.rotation.y=90*Math.PI/2; 
             cat2.position = new BABYLON.Vector3(-3400, -80,600);
             cat2.actionManager = new BABYLON.ActionManager(scene);
             cat2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                catsound.play();
                }));
            });


            var dogbox = BABYLON.MeshBuilder.CreateBox("dogbox",{ height: 30, width: 50, depth: 40}, scene);
            dogbox.visibility = 0.5;
            const dog = BABYLON.SceneLoader.ImportMesh("", "./assets/bulldog/", "french_bulldog.obj", scene, function(object) {
                // You can apply properties to object.
                dog2 = object[0];
                dog2.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
                dogbox.position.y = -75;
                dog2.rotation.z=180*Math.PI/2;
                dog2.rotation.y=45*Math.PI/2; 

                dog2.parent = dogbox;
                
                
                dogbox.physicsImpostor = new BABYLON.PhysicsImpostor(dogbox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 30, restitution: 0}, scene);

                dogbox.rotate(BABYLON.Axis.Y, 3*Math.PI/2, BABYLON.Space.LOCAL);

                dogbox.position.x = -3060;
                dogbox.position.z = -330;
                
                dog2.actionManager = new BABYLON.ActionManager(scene);
                dog2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    
                    dogsound.play();
                }));
                
                // Code in this function will run ~60 times per second
               scene.registerBeforeRender(function () {
                // Check if box is moving right
                if (dogbox.position.z < -250 && dogbox.position.x<=-3059) {
                    // Increment box position to the right
                    dogbox.position.z += 1;
                    dogbox.rotation.y=180*Math.PI/2;
                }
        
                // Check if box is moving left
                if (dogbox.position.z >= -250 ) {
                    // Decrement box position to the left
                    dogbox.position.x += 1;
                    dogbox.rotation.y=45*Math.PI/2;
                }
                if (dogbox.position.x > -2900 ) {
                 // Decrement box position to the left
                 dogbox.position.z -= 1;
                 dogbox.rotation.y= 270*Math.PI/2;
             }

             if (dogbox.position.x>-3059  && dogbox.position.z <= -370) {
                 // Increment box position to the right
                 dogbox.rotation.y=135*Math.PI/2;
                 dogbox.position.x -= 1;
                 
                 
             }
             

            });
            
               });

               
               const cow = BABYLON.SceneLoader.ImportMesh("", "./assets/cow/", "13085_Holsteind_v2_l3.obj", scene, function(object) {
                // You can apply properties to object.
                cow2 = object[0];
                cow2.scaling = new BABYLON.Vector3(1, 1, 1);
                cow2.rotation.z=225*Math.PI/2;
                cow2.rotation.y=135*Math.PI/2; 
                cow2.rotation.x=135*Math.PI/2; 
                cow2.position = new BABYLON.Vector3(-2900, -88,-600);
                cow2.actionManager = new BABYLON.ActionManager(scene);
                cow2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    cowsound.play();
                }));
                });


                const pig = BABYLON.SceneLoader.ImportMesh("", "./assets/pig/", "16433_Pig.obj", scene, function(object) {
                    // You can apply properties to object.
                    pig2 = object[0];
                    pig2.scaling = new BABYLON.Vector3(30, 30, 30);
                    pig2.rotation.z=225*Math.PI/2;
                    pig2.rotation.y=135*Math.PI/2; 
                    pig2.rotation.x=135*Math.PI/2; 
                    pig2.position = new BABYLON.Vector3(-2800, -88,-600);
                    var mat = new BABYLON.StandardMaterial("mat", scene);
                    var texture = new BABYLON.Texture("textures/pig.jpg", scene);
                    mat.diffuseTexture = texture;
                    pig2.material=mat;
                    pig2.actionManager = new BABYLON.ActionManager(scene);
                    pig2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    pigsound.play();
                }));
                    });


                    const stork = BABYLON.SceneLoader.ImportMesh("", "./assets/stork/", "12980_WhiteStork_v1.obj", scene, function(object) {
                        // You can apply properties to object.
                        stork2 = object[0];
                        stork2.scaling = new BABYLON.Vector3(1, 1, 1);
                        stork2.rotation.z=225*Math.PI/2;
                        stork2.rotation.y=135*Math.PI/2; 
                        stork2.rotation.x=135*Math.PI/2; 
                        stork2.position = new BABYLON.Vector3(-3050, 150, 900);
                        stork2.actionManager = new BABYLON.ActionManager(scene);
                        stork2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                            storksound.play();
                        }));
                        
                        });

               const barn = BABYLON.SceneLoader.ImportMesh("", "./assets/barn/", "scene.gltf", scene, function(object) {
                // You can apply properties to object.
                barn2 = object[0];
                barn2.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
                barn2.rotation.z=45*Math.PI/2;
                barn2.rotation.y=45*Math.PI/2; 
                barn2.rotation.x=135*Math.PI/2; 
                barn2.position = new BABYLON.Vector3(-2500, -88,1000);
               });
               
              
            
            const fox= BABYLON.SceneLoader.ImportMesh("", "./assets/fox/", "13577_Tibetan_Hill_Fox_v1_L3.obj", scene, function(object) {
                // You can apply properties to object.
                fox2 = object[0];
                fox2.scaling = new BABYLON.Vector3(2, 2, 2);
                fox2.rotation.z=225*Math.PI/2;
                fox2.rotation.y=-180*Math.PI/2;
                fox2.rotation.x=135*Math.PI/2;
                fox2.position = new BABYLON.Vector3(-1000, 0, -500);
                fox2.actionManager = new BABYLON.ActionManager(scene);
                fox2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    foxsound.play();
                }));
            });

            const rabbit= BABYLON.SceneLoader.ImportMesh("", "./assets/rabbit/", "Rabbit.obj", scene, function(object) {
                // You can apply properties to object.
                rabbit2 = object[0];
                rabbit2.scaling = new BABYLON.Vector3(40, 40, 40);
                rabbit2.rotation.z=180*Math.PI/2;
                rabbit2.rotation.y=135*Math.PI/2;
                rabbit2.rotation.x=180*Math.PI/2;
                rabbit2.position = new BABYLON.Vector3(0, -80, 0);
                rabbit2.actionManager = new BABYLON.ActionManager(scene);
                rabbit2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    rabbitsound.play();
                }));
                var direction = true;
               /* scene.registerBeforeRender(function () {
                    // Check if box is moving right
                    if (rabbit2.position.y < -40 && direction) {
                        // Increment box position to the right
                        rabbit2.position.y += 1;
                        rabbit2.position.x -= 1;
                    }
                    else {
                        // Swap directions to move left
                        direction = false;
                    }
            
                    // Check if box is moving left
                    if (rabbit2.position.y > -80 && !direction) {
                        // Decrement box position to the left
                        rabbit2.position.y -= 1;
                        rabbit2.position.x -= 1;
                    }
                    else {
                        // Swap directions to move right
                        direction = true;
                    }
                });
             */
            });
                


            const bat= BABYLON.SceneLoader.ImportMesh("", "./assets/bat/", "Bat.obj", scene, function(object) {
                // You can apply properties to object.
                bat2 = object[0];
                bat2.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
                bat2.rotation.z=180*Math.PI/2;
                bat2.rotation.y=45*Math.PI/2;
                bat2.rotation.x=180*Math.PI/2;
                bat2.position = new BABYLON.Vector3(10, -60, 0);
                bat2.actionManager = new BABYLON.ActionManager(scene);
                bat2.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function () {
                    batsound.play();
                }));
                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture("textures/bat.jpg", scene);
                mat.diffuseTexture = texture;
                bat2.material=mat;
                
            });

            const fieno= BABYLON.SceneLoader.ImportMesh("", "./assets/fieno/", "11543_BundleOfStraw_V2_l1.obj", scene, function(object) {
                // You can apply properties to object.
                fieno2 = object[0];
                fieno2.scaling = new BABYLON.Vector3(1, 1, 1);
                fieno2.rotation.z=180*Math.PI/2;
                fieno2.rotation.y=45*Math.PI/2;
                fieno2.rotation.x=180*Math.PI/2;
                fieno2.position = new BABYLON.Vector3(-3410, -60, 0);
                fieno2.actionManager = new BABYLON.ActionManager(scene);
                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture("textures/fieno.jpg", scene);
                mat.diffuseTexture = texture;
                fieno2.material=mat;
            });
            
            const house= BABYLON.SceneLoader.ImportMesh("", "./assets/farm/", "WoodHouse.obj", scene, function(object) {
                // You can apply properties to object.
                house2 = object[0];
                house2.scaling = new BABYLON.Vector3(100, 100, 100);
                house2.rotation.z=180*Math.PI/2;
                house2.rotation.y=45*Math.PI/2;
                house2.position = new BABYLON.Vector3(-3470, -100, 1000);
                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture("textures/legno.jpg", scene);
                mat.diffuseTexture = texture;
                house2.material=mat;
            });
            
            const house3= BABYLON.SceneLoader.ImportMesh("", "./assets/well/", "Medieval House.obj", scene, function(object) {
                hous = object[0];
                hous.scaling = new BABYLON.Vector3(60, 60, 60);
                hous.rotation.z=180*Math.PI/2;
                hous.rotation.y=135*Math.PI/2;
                hous.position = new BABYLON.Vector3(-3000, -100, 1000);
                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture("textures/casa.jpg", scene);
                mat.diffuseTexture = texture;
                hous.material=mat;
            });

            const house4= BABYLON.SceneLoader.ImportMesh("", "./assets/silo/", "20954_Farm_Silo_v1_NEW.obj", scene, function(object) {
                hous = object[0];
                hous.scaling = new BABYLON.Vector3(40, 40, 40);
                hous.rotation.z=90*Math.PI/2;
                hous.rotation.y=135*Math.PI/2;
                hous.rotation.x=135*Math.PI/2;
                hous.position = new BABYLON.Vector3(-2600, -100, -1300);

            });

            const house5= BABYLON.SceneLoader.ImportMesh("", "./assets/farm/", "WoodHouse.obj", scene, function(object) {
                // You can apply properties to object.
                house2 = object[0];
                house2.scaling = new BABYLON.Vector3(100, 100, 100);
                house2.rotation.z=180*Math.PI/2;
                house2.rotation.y=180*Math.PI/2;
                house2.position = new BABYLON.Vector3(-3470, -100, -1000);
                var mat = new BABYLON.StandardMaterial("mat", scene);
                var texture = new BABYLON.Texture("textures/legno2.jpg", scene);
                mat.diffuseTexture = texture;
                house2.material=mat;
            });

            const fire= BABYLON.SceneLoader.ImportMesh("", "./assets/tree/", "fireplace.obj", scene, function(object) {
                // You can apply properties to object.
                house2 = object[0];
                house2.scaling = new BABYLON.Vector3(10, 10, 10);
                house2.rotation.z=180*Math.PI/2;
                house2.rotation.y=180*Math.PI/2;
                house2.position = new BABYLON.Vector3(-2970, -100, -300);
                // Set up new rendering pipeline
            var pipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene);
            // Tone mapping
            scene.imageProcessingConfiguration.toneMappingEnabled = true;
            scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
            scene.imageProcessingConfiguration.exposure = 1;    
            });
            
         

            //Skybox
                const skybox = BABYLON.Mesh.CreateBox("skyBox", 8000.0, scene);
                const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
                skyboxMaterial.backFaceCulling = false;
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skybox.material = skyboxMaterial;
 



            



                //Smoke
        	var smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
        	smokeSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
        	smokeSystem.emitter = new BABYLON.Vector3(-2970, -80, -310); // the starting object, the emitter
            smokeSystem.minEmitBox = new BABYLON.Vector3(-5.5, 1, -4.5); // Starting all from
            smokeSystem.maxEmitBox = new BABYLON.Vector3(5.5, 30, 20.5); // To...
        	
        	smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
            smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        	
        	smokeSystem.minSize = 0.3;
            smokeSystem.maxSize = 8;
        
            smokeSystem.minLifeTime = 3;
            smokeSystem.maxLifeTime = 7.5;
        
            smokeSystem.emitRate = 490;
        
            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
            smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        
            smokeSystem.direction1 = new BABYLON.Vector3(-2.5, 30, -2.5);
            smokeSystem.direction2 = new BABYLON.Vector3(2.5, 30, 2.5);
        
            smokeSystem.minAngularSpeed = 0;
        	smokeSystem.maxAngularSpeed = Math.PI;
        
            smokeSystem.minEmitPower = 0.5;
            smokeSystem.maxEmitPower = 3.5;
            smokeSystem.updateSpeed = 0.005;
        
            smokeSystem.start();
        	
        	
        	
            // Create a particle system
            var fireSystem = new BABYLON.ParticleSystem("particles", 80000, scene);
        
            //Texture of each particle
            fireSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
        
            // Where the particles come from
            fireSystem.emitter = new BABYLON.Vector3(-2970, -80, -310); // the starting object, the emitter
            fireSystem.minEmitBox = new BABYLON.Vector3(-10.5, 2, -0.5); // Starting all from
            fireSystem.maxEmitBox = new BABYLON.Vector3(5.5, 30, 20.5); // To...
        
            // Colors of all particles
            fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
            fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
        
            // Size of each particle (random between...
            fireSystem.minSize = 4;
            fireSystem.maxSize = 18;
        
            // Life time of each particle (random between...
            fireSystem.minLifeTime = 0.2;
            fireSystem.maxLifeTime = 2;
        
            // Emission rate
            fireSystem.emitRate = 600;
        
            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
            // Set the gravity of all particles
            fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        
            // Direction of each particle after it has been emitted
            fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
            fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);
        
            // Angular speed, in radians
            fireSystem.minAngularSpeed = 0;
            fireSystem.maxAngularSpeed = Math.PI;
        
            // Speed
            fireSystem.minEmitPower = 1;
            fireSystem.maxEmitPower = 3;
            fireSystem.updateSpeed = 0.007;
        
            // Start the particle system
            fireSystem.start();

           
            return scene;
        };

        window.initFunction = async function() {               
            var asyncEngineCreation = async function() {
                try {
                return createDefaultEngine();
                } catch(e) {
                console.log("the available createEngine function failed. Creating the default engine instead");
                return createDefaultEngine();
                }
            }

            window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
window.scene = createScene();};
initFunction().then(() => {sceneToRender = scene        
    engine.runRenderLoop(function () {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
           