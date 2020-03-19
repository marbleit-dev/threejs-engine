let scene, camera, renderer, objects, objects_backup, controls, i_object = 0, isAdded = true, isRuninng = false, speed = 0.01;

let urls = [
    'models/engine.gltf'
];

let runStop = document.getElementById('run-stop');
let disassemble = document.getElementById('disassemble');
let disassembleStatic = document.getElementById('disassemble-static');
let assemble = document.getElementById('assemble');
let assembleStatic = document.getElementById('assemble-static');

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 13);

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true });
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
    document.body.appendChild(renderer.domElement);

    lights = [
        new THREE.PointLight(0xffffff, 1),
        new THREE.PointLight(0xffffff, .25),
        new THREE.PointLight(0xffffff, .25),
        new THREE.PointLight(0xffffff, .25),
        new THREE.PointLight(0xffffff, .25)
    ];
    lights[0].position.set(0, 10, 10);
    lights[1].position.set(0, 0, -10);
    lights[2].position.set(10, 0, 0);
    lights[3].position.set(-10, 0, 0);
    lights[4].position.set(0, -10, -10);
    for (let i = 0; i < lights.length; i++) {
        scene.add(lights[i]);
    }

    let parentGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    let parentMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
    parentObject = new THREE.Mesh(parentGeometry, parentMaterial);
    scene.add(parentObject);

    objects = new Array();
    objects_backup = new Array();
    let loader = new THREE.GLTFLoader();
    urls.forEach(url => loadModel(loader, url, objects));
    urls.forEach(url => loadModel(loader, url, objects_backup));

    setTimeout(function() {render();}, 500);

    setTimeout(function() {
        runStop.disabled = false;
        disassemble.disabled = false;
        disassembleStatic.disabled = false;
    }, 1000);

    setTimeout(function() {controlsInit();}, 1400);
}

function render() {
    renderer.render(scene, camera);

    if (isAdded) {
        if (i_object < objects.length) {
            parentObject.add(objects[i_object]);
            i_object++;
        }
        else {
            isAdded = false;
        }
    }

    if (isRuninng) {
        runEngine();
    }

    if (!isRuninng && speed != 0) {
        stopEngine();
    }

    runStop.onclick = function() {
        switch (isRuninng) {
            case true:
                isRuninng = !isRuninng;
                runStop.innerHTML = "Run";
                break;
            default:
                isRuninng = !isRuninng;
                runStop.innerHTML = "Stop";
                break;
        }
    }

    disassemble.onclick = function() {
        disassembleAnimation();
    }

    disassembleStatic.onclick = function() {
        disassembleStaticAnimation();
    }

    assemble.onclick = function() {
        assembleAnimation();
    }

    assembleStatic.onclick = function() {
        assembleStaticAnimation();
    }

    requestAnimationFrame(render);
}

function loadModel(loader, url, objects) {
    loader.load(url, function (gltf) {
        for (i = 0; i < gltf.scene.children.length; i++) {
            objects.push(gltf.scene.children[i]);
        }
    }, function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, function (error) {
        console.error(error);
    });
}

function controlsInit() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.enablePan = false;
    controls.maxDistance = 40;
    controls.minDistance = 10;
    controls.saveState();
}

function runEngine() {
    for (i = 29; i <= 35; i++) {
        switch (i) {
            case 29:
            case 33:
                objects[i].rotation.y += speed;
                break;
            default:
                objects[i].rotation.y -= speed;
                break;
        }
        if (speed <= 1) {
            speed += 0.001;
        }
    }
}

function stopEngine() {
    for (i = 29; i <= 35; i++) {
        switch (i) {
            case 29:
            case 33:
                objects[i].rotation.y += speed;
                break;
            default:
                objects[i].rotation.y -= speed;
                break;
        }
        if (speed >= 0) {
            speed -= 0.002;
        }
        else {
            speed = 0;
        }
    }
}

function disassembleAnimation() {
    stopEngine();
    isRuninng = false;
    runStop.disabled = true;
    runStop.innerHTML = "Run";
    this.tl = new TimelineMax({paused: true});
    disassemble.disabled = true;
    disassembleStatic.disabled = true;
    assemble.disabled = true;
    assembleStatic.disabled = true;
    for (let i = 0; i < objects.length - 1; i++) {
        if (i == 0) {
            this.tl.to(
                objects[i].position,
                .75,
                {
                    x: (Math.random() - 0.5) * 20,
                    y: (Math.random() - 0.5) * 10 + 15,
                    z: (Math.random() - 0.5) * 10,
                    ease: Expo.easeOut
                }
            );
        }
        else {
            this.tl.to(
                objects[i].position,
                .75,
                {
                    x: (Math.random() - 0.5) * 20,
                    y: (Math.random() - 0.5) * 10 + 15,
                    z: (Math.random() - 0.5) * 10,
                    ease: Expo.easeOut
                },
                "=-.7"
            );
        }
    }
    this.tl.to(disassemble, 0, {disabled: false, innerHTML: "Shuffle"});
    this.tl.to(disassembleStatic, 0, {disabled: false, innerHTML: "Static Shuffle"});
    this.tl.to(assemble, 0, {disabled: false});
    this.tl.to(assembleStatic, 0, {disabled: false});
    this.tl.play();
}

function disassembleStaticAnimation() {
    stopEngine();
    isRuninng = false;
    runStop.disabled = true;
    runStop.innerHTML = "Run";
    this.tl = new TimelineMax({paused: true});
    disassemble.disabled = true;
    disassembleStatic.disabled = true;
    assemble.disabled = true;
    assembleStatic.disabled = true;
    controls.enabled = false;
    controls.reset();
    this.tl.to(camera.position, 1, {x: 0, y: 7, z: 25, ease: Expo.easeOut});
    for (let i = 0; i < objects.length - 1; i++) {
        this.tl.to(
            objects[i].position,
            .75,
            {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 10 + 15,
                z: (Math.random() - 0.5) * 10,
                ease: Expo.easeOut
            },
            "=-.7"
        );
    }
    this.tl.to(camera.position, .5, {x: 0, y: 0, z: 13, ease: Expo.easeOut});
    this.tl.to(controls, 0, {enabled: true});
    this.tl.to(disassemble, 0, {disabled: false, innerHTML: "Shuffle"});
    this.tl.to(disassembleStatic, 0, {disabled: false, innerHTML: "Static Shuffle"});
    this.tl.to(assemble, 0, {disabled: false});
    this.tl.to(assembleStatic, 0, {disabled: false});
    this.tl.play();
}

function assembleAnimation() {
    this.tl = new TimelineMax({paused: true});
    disassemble.disabled = true;
    disassembleStatic.disabled = true;
    assemble.disabled = true;
    assembleStatic.disabled = true;
    for (let i = 0; i < objects.length - 1; i++) {
        if (i == 0) {
            this.tl.to(
                objects[i].position,
                .75,
                {
                    x: objects_backup[i].position.x,
                    y: objects_backup[i].position.y,
                    z: objects_backup[i].position.z,
                    ease: Expo.easeOut
                }
            );
        }
        else {
            this.tl.to(
                objects[i].position,
                .75,
                {
                    x: objects_backup[i].position.x,
                    y: objects_backup[i].position.y,
                    z: objects_backup[i].position.z,
                    ease: Expo.easeOut
                },
                "=-.7"
            );
        }
    }
    this.tl.to(runStop, 0, {disabled: false});
    this.tl.to(disassemble, 0, {disabled: false, innerHTML: "Disassemble"});
    this.tl.to(disassembleStatic, 0, {disabled: false, innerHTML: "Static Disassemble"});
    this.tl.play();
}

function assembleStaticAnimation() {
    this.tl = new TimelineMax({paused: true});
    disassemble.disabled = true;
    disassembleStatic.disabled = true;
    assemble.disabled = true;
    assembleStatic.disabled = true;
    controls.enabled = false;
    controls.reset();
    this.tl.to(camera.position, 1, {x: 0, y: 10, z: 28, ease: Expo.easeOut});
    for (let i = 0; i < objects.length - 1; i++) {
        this.tl.to(
                objects[i].position,
                .75,
                {
                    x: objects_backup[i].position.x,
                    y: objects_backup[i].position.y,
                    z: objects_backup[i].position.z,
                    ease: Expo.easeOut
                },
                "=-.7"
            );
    }
    this.tl.to(camera.position, .5, {x: 0, y: 0, z: 13, ease: Expo.easeOut});
    this.tl.to(controls, 0, {enabled: true});
    this.tl.to(runStop, 0, {disabled: false});
    this.tl.to(disassemble, 0, {disabled: false, innerHTML: "Disassemble"});
    this.tl.to(disassembleStatic, 0, {disabled: false, innerHTML: "Static Disassemble"});
    this.tl.play();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();