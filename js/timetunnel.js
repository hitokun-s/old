var Timetunnel = function(id, imgPath, opt) {
                var self = this;
                var opt = opt || {};
                var v = opt.v || 0.008;
                var tunnel_back_color = opt.bkColor || 0x000000;
                var stats, scene, renderer;
                var camera, cameraControl;
                var viewElm = document.getElementById(id);
                var delegate = function() {
                };

                var callback = function() {
                    var w = viewElm.offsetWidth;
                    var h = viewElm.offsetHeight;
                    renderer.setSize(w, h);
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                };
                window.addEventListener('resize', callback, false);

                if (Detector.webgl) {
                    renderer = new THREE.WebGLRenderer({
                        antialias: true, // to get smoother output
                        preserveDrawingBuffer: true	// to allow screenshot
                    });
//                        renderer.setClearColorHex(tunnel_back_color, 1);
                    // uncomment if webgl is required
                } else {
                    alert("Your browser does not support WebGL. Sorry...");
                    Detector.addGetWebGLMessage();
                    return true;
                }
                //renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setSize(viewElm.offsetWidth, viewElm.offsetHeight);
                viewElm.appendChild(renderer.domElement);

                // add Stats.js - https://github.com/mrdoob/stats.js
//        stats = new Stats();
//        stats.domElement.style.position = 'absolute';
//        stats.domElement.style.bottom = '0px';
//        document.body.appendChild(stats.domElement);

                // create a scene
                scene = new THREE.Scene();

                // put a camera in the scene
                camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
                camera.position.set(0, 0, 7);
                camera.lookAt(scene.position)
                scene.add(camera);


                var light = new THREE.DirectionalLight(0xff8000, 1.5);
                light.position.set(1, 1, 0).normalize();
                scene.add(light);

                var light = new THREE.DirectionalLight(0xff8000, 1.5);
                light.position.set(-1, 1, 0).normalize();
                scene.add(light);

                var light = new THREE.PointLight(0x44FFAA, 15, 25);
                light.position.set(0, -3, 0);
                scene.add(light);



                // here you add your objects
                // - you will most likely replace this part by your own
                // -args ... radiusTop, radiusBottom, height, segmentsRadius, segmentsHeight, openEnded
                var geometry = new THREE.CylinderGeometry(1, 1, 30, 32, 1, true);
                texture = THREE.ImageUtils.loadTexture(imgPath);
                texture.wrapT = THREE.RepeatWrapping;

                var material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
                var mesh = new THREE.Mesh(geometry, material);
                mesh.rotation.x = Math.PI / 2;
                scene.add(mesh);
                mesh.flipSided = true;

                this.start = function() {
                    // renderer.setClearColorHex(tunnel_back_color, 1);
                    renderer.setClearColor(tunnel_back_color, 1);
                    scene.fog = new THREE.FogExp2(tunnel_back_color, 0.15);
                    animate();
                };
//
//                var time_indicator = $("#time_indicator");

                // animation loop
                var req_id;
                var animate = function() {

                    // loop on request animation loop
                    // - it has to be at the begining of the function
                    // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
                    req_id = requestAnimationFrame(animate);
                    render();
                    delegate();
                };

                // render the scene
                var render = function() {

                    // move the texture to give the illusion of moving thru the tunnel
                    texture.offset.y += v;
                    texture.offset.y %= 1;
                    texture.needsUpdate = true;

                    // move the camera back and forth
                    var seconds = Date.now() / 1000;
                    var radius = 0.70;
                    var angle = Math.sin(0.75 * seconds * Math.PI) / 4;
                    //angle	= (seconds*Math.PI)/4;
                    camera.position.x = Math.cos(angle - Math.PI / 2) * radius;
                    camera.position.y = Math.sin(angle - Math.PI / 2) * radius;
                    camera.rotation.z = angle;

                    // actually render the scene
                    renderer.render(scene, camera);
                };
                this.exit = function(callback) {
                    var flush = function(ini) {
                        var noudo = ini;
                        return function() {
                            if (noudo > 0.5) {
                                noudo = noudo * 1.05;
                                if (noudo > 6) {
                                    console.log("stopping...");
                                    self.stop();
                                    delegate = function() {
                                    };
                                    if (typeof (callback) == "function") {
                                        callback();
                                    }
                                    ;
                                    return;
                                }
                            } else {
                                noudo += 0.01;
                            }
                            renderer.setClearColorHex(0xffffff, noudo);
                            scene.fog = new THREE.FogExp2(0xffffff, noudo);
                        };
                    };
                    delegate = flush(0.15);
                };
                this.stop = function() {
                    console.log("RequestID:" + req_id);
                    cancelAnimationFrame(req_id);
                };
                this.accel = function(){
                    v += 0.005;
                };
                this.brake = function(){
                    v -= 0.005;
                };
            };