class SceneModel{
    constructor() {
        //初始化scence、camera、render、light、controls、stats、composer
        this.init()
        //初始化材质
        this.initMaterail()
        //初始化场景模型
        this.initContent();
        //点击高亮物体
        this.clickLighter()
        // 窗口变动触发的方法
        document.addEventListener('resize', this.onWindowResize, false);

    }
    // 窗口变动触发的方法
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    init(){
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initLight();
        this.initControls();
        this.initStats()
        this.selectedObjects = [];
        this.composer = new THREE.ThreeJs_Composer(this.renderer, this.scene, this.camera,this.selectedObjects);

    }
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( this.scene.background, 3000, 5000 );
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(0, 800, 1200);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x4682B4,1.0);
        document.body.appendChild(this.renderer.domElement);
    }
    initLight() {
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3 );//模拟远处类似太阳的光源
        directionalLight.color.setHSL( 0.1, 1, 0.95 );
        directionalLight.position.set( 0, 200, 0).normalize();
        this.scene.add( directionalLight );

        var ambient = new THREE.AmbientLight( 0xffffff, 1 ); //AmbientLight,影响整个场景的光源
        ambient.position.set(0,0,0);
        this.scene.add( ambient );
    }
    initControls() {
        this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.5;
        // 视角最小距离
        this.orbitControls.minDistance = 100;
        // 视角最远距离
        this.orbitControls.maxDistance = 5000;
        // 最大角度
        this.orbitControls.maxPolarAngle = Math.PI/2.2;
    }
    initGUI(options){
        this.options=options
        this.gui = new dat.GUI()
        this.gui.domElement.style = 'position:absolute;top:0px;right:0px;height:600px';
        this.gui.add(this.options, 'batchNo').name("物料批号：").listen();
        this.gui.add(this.options, 'qty').name("数量：").listen();
        this.gui.add(this.options, 'qtyUom').name("单位：").listen();
        this.gui.add(this.options, 'qty2').name("件数：").listen();
        this.gui.add(this.options, 'startMove').name("进入编辑模式").listen();
        this.gui.add(this.options, 'endMove').name("退出编辑模式:").listen();
    }
    initDrag(cargosObjects){
        this.dragControls = new THREE.DragControls( cargosObjects, this.camera, this.renderer.domElement );
        this.dragControls.addEventListener( 'dragstart', ( event )=> {
            this.dragObject=event.object
            this.dragNewObject={
                x:event.object.position.x,
                y:event.object.position.y,
                z:event.object.position.z
            }
            this.orbitControls.enabled = false;
        } );
        this.dragControls.addEventListener( 'dragend',  ( event )=> {
            this.dragObject.position.set(this.dragNewObject.x,this.dragNewObject.y,this.dragNewObject.z);
            this.dragObject=null
            this.orbitControls.enabled = true;

        } );
    }
    clickLighter(){
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        var doorMap={
            'door-left1':true,
            'door-right1':true,
            'door-left2':true,
            'door-right2':true
        }
        window.addEventListener( 'click', (event)=>{
            var x, y;
            if ( event.changedTouches ) {
                x = event.changedTouches[ 0 ].pageX;
                y = event.changedTouches[ 0 ].pageY;
            } else {
                x = event.clientX;
                y = event.clientY;
            }
            mouse.x = ( x / window.innerWidth ) * 2 - 1;
            mouse.y = - ( y / window.innerHeight ) * 2 + 1;
            raycaster.setFromCamera( mouse, this.camera );

            var intersects = raycaster.intersectObjects( [ this.scene ], true );

            if(intersects.length === 0){
                document.getElementById('label').style.display='none'
                return;
            }
            if(intersects[0].object.name === "地面" || (intersects[0].object.name === "") || (intersects[0].object.name === "墙面")){
                document.getElementById('label').style.display='none'//隐藏说明性标签
                this.selectedObjects.pop();
            }else{
                let doc= document.getElementById('label')
                doc.style.display='block'// 显示说明性标签
                doc.style.left=x+'px'
                doc.style.top=y-40+'px'
                doc.innerHTML=intersects[0].object.name
                this.selectedObjects.pop();
                this.selectedObjects.push( intersects[0].object );
                // outlinePass.selectedObjects = selectedObjects;//给选中的线条和物体加发光特效
            }
            if(Object.keys(doorMap).includes(intersects[0].object.name)){
                let y;
                if(doorMap[intersects[0].object.name]){
                    y=intersects[0].object.name.includes('left')?-0.5*Math.PI:0.5*Math.PI
                }else{
                    y=0
                }
                new TWEEN.Tween(intersects[0].object.rotation).to({
                    y: y
                }, 5000).easing(TWEEN.Easing.Elastic.Out).onComplete(function(){
                }).start();

                doorMap[intersects[0].object.name] = !doorMap[intersects[0].object.name]
            }
            var Msg = intersects[0].object.name
            if(Msg.includes("货物")) {
                this.options.batchNo =Msg.split('-')[1] ;
                this.options.qty = "100";
                this.options.qtyUom = "kg";
                this.options.qty2 = "10";
            }
        });
    }
    initStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
    }
    initMaterail(){
        this.matArrayA=[new THREE.MeshPhongMaterial({color: 0xafc0ca}),  //前  0xafc0ca :灰色
            new THREE.MeshPhongMaterial({color: 0xafc0ca}),  //后
            new THREE.MeshPhongMaterial({color: 0xd6e4ec}),  //上  0xd6e4ec： 偏白色
            new THREE.MeshPhongMaterial({color: 0xd6e4ec}),  //下
            new THREE.MeshPhongMaterial({color: 0xafc0ca}),  //左    0xafc0ca :灰色
            new THREE.MeshPhongMaterial({color: 0xafc0ca}),]  //右

        this.matArrayB=[new THREE.MeshPhongMaterial({color: 0xafc0ca}),  //前  0xafc0ca :灰色
            new THREE.MeshPhongMaterial({color: 0x9cb2d1}),  //后  0x9cb2d1：淡紫
            new THREE.MeshPhongMaterial({color: 0xd6e4ec}),  //上  0xd6e4ec： 偏白色
            new THREE.MeshPhongMaterial({color: 0xd6e4ec}),  //下
            new THREE.MeshPhongMaterial({color: 0xafc0ca}),  //左   0xafc0ca :灰色
            new THREE.MeshPhongMaterial({color: 0xafc0ca}),]  //右

    }
    initContent(){
        this.createFloor();
        this.createCubeWall(10, 200, 1400, this.matArrayB, -1295, 100, 0,0,  "墙面");
        this.createCubeWall(10, 200, 1400, this.matArrayB, 1295, 100, 0,1,  "墙面");
        this.createCubeWall(10, 200, 2600, this.matArrayB,0, 100, -700,1.5,  "墙面");
        var wall = this.returnWallObject(2600, 200, 10, 0, this.matArrayB, 0, 100, 700, "墙面");
        var door_cube1 = this.returnWallObject(200, 180, 10, 0, this.matArrayB, -600, 90, 700, "door1");
        var door_cube2 = this.returnWallObject(200, 180, 10, 0, this.matArrayB, 600, 90, 700, "door2");
        var window_cube1 = this.returnWallObject(100, 100, 10, 0, this.matArrayB, -900, 90, 700, "window1");
        var window_cube2 = this.returnWallObject(100, 100, 10, 0, this.matArrayB, 900, 90, 700, "window2");
        var window_cube3 = this.returnWallObject(100, 100, 10, 0, this.matArrayB, -200, 90, 700, "window3");
        var window_cube4 = this.returnWallObject(100, 100, 10, 0, this.matArrayB, 200, 90, 700, "window4");
        var objects_cube = [];
        objects_cube.push(door_cube1);
        objects_cube.push(door_cube2);
        objects_cube.push(window_cube1);
        objects_cube.push(window_cube2);
        objects_cube.push(window_cube3);
        objects_cube.push(window_cube4);
        this.createResultBsp(wall, objects_cube);
        //为墙面安装门
        this.createDoor_left(100, 180, 2, 0, -700, 90, 700, "door-left1");
        this.createDoor_right(100, 180, 2, 0, -500, 90, 700, "door-right1");
        this.createDoor_left(100, 180, 2, 0, 500, 90, 700, "door-left2");
        this.createDoor_right(100, 180, 2, 0, 700, 90, 700, "door-right2");
        //为墙面安装窗户
        this.createWindow(100, 100, 2, 0, -900, 90, 700, "window");
        this.createWindow(100, 100, 2, 0, 900, 90, 700, "window");
        this.createWindow(100, 100, 2, 0, -200, 90, 700, "window");
        this.createWindow(100, 100, 2, 0, 200, 90, 700, "window");
    }
    //创建地板
    createFloor(){
        var loader = new THREE.TextureLoader();
        let that=this
        loader.load("../../images/floor.jpg",function(texture){
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( 10, 10 );
            var floorGeometry = new THREE.BoxGeometry(2600, 1400, 1);
            var floorMaterial = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.y = -0.5;
            floor.rotation.x = Math.PI / 2;
            floor.name = "地面";
            that.scene.add(floor);
        });
    }
    //创建墙壁
    createCubeWall(width,height,depth,material,x,y,z,angle,name){
        var cubeGeometry=new THREE.BoxGeometry(width,height,depth)
        var cube=new THREE.Mesh(cubeGeometry,material)
        cube.position.x=x
        cube.position.y=y
        cube.position.z=z
        cube.rotation.y += angle*Math.PI;
        cube.name = name;
        this.scene.add(cube);
    }
    //返回墙对象
    returnWallObject(width, height, depth, angle, material, x, y, z, name){
        var cubeGeometry = new THREE.BoxGeometry(width, height, depth);
        var cube = new THREE.Mesh( cubeGeometry, material );
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.rotation.y += angle*Math.PI;
        cube.name = name;
        return cube;
    }
    createResultBsp(bsp,objects_cube){
        var material = new THREE.MeshPhongMaterial({color:0x9cb2d1,specular:0x9cb2d1,shininess:30,transparent:true,opacity:1});
        var BSP = new ThreeBSP(bsp);
        objects_cube.forEach(item=>{
            BSP = BSP.subtract(new ThreeBSP(item));
        })
        var result = BSP.toMesh(material);
        result.material.flatshading = THREE.FlatShading;
        result.geometry.computeFaceNormals();  //重新计算几何体侧面法向量
        result.geometry.computeVertexNormals();
        result.material.needsUpdate = true;  //更新纹理
        result.geometry.buffersNeedUpdate = true;
        result.geometry.uvsNeedUpdate = true;
        this.scene.add(result);
    }
    //创建门_左侧
    createDoor_left(width, height, depth, angle, x, y, z, name){
        var loader = new THREE.TextureLoader();
        loader.load("../../images/door_left.png",(texture)=>{
            var doorgeometry = new THREE.BoxGeometry(width, height, depth);
            doorgeometry.translate(50, 0, 0);
            var doormaterial = new THREE.MeshBasicMaterial({map:texture,color:0xffffff});
            doormaterial.opacity = 1.0;
            doormaterial.transparent = true;
            var door = new THREE.Mesh( doorgeometry,doormaterial);
            door.position.set(x, y, z);
            door.rotation.y += angle*Math.PI;  //-逆时针旋转,+顺时针
            door.name = name;
            this.scene.add(door);
        });
    }
    //创建门_右侧
    createDoor_right(width, height, depth, angle, x, y, z, name){
        var loader = new THREE.TextureLoader();
        loader.load("../../images/door_right.png",(texture)=>{
            var doorgeometry = new THREE.BoxGeometry(width, height, depth);
            doorgeometry.translate(-50, 0, 0);
            var doormaterial = new THREE.MeshBasicMaterial({map:texture,color:0xffffff});
            doormaterial.opacity = 1.0;
            doormaterial.transparent = true;
            var door = new THREE.Mesh( doorgeometry,doormaterial);
            door.position.set(x, y, z);
            door.rotation.y += angle*Math.PI;  //-逆时针旋转,+顺时针
            door.name = name;
            this.scene.add(door);
        });
    }
    //创建窗户
    createWindow(width, height, depth, angle, x, y, z, name){
        var loader = new THREE.TextureLoader();
        loader.load("../../images/window.png",(texture)=>{
            var windowgeometry = new THREE.BoxGeometry(width, height, depth);
            var windowmaterial = new THREE.MeshBasicMaterial({map:texture,color:0xffffff});
            windowmaterial.opacity = 1.0;
            windowmaterial.transparent = true;
            var window = new THREE.Mesh( windowgeometry,windowmaterial);
            window.position.set(x, y, z);
            window.rotation.y += angle*Math.PI;  //-逆时针旋转,+顺时针
            window.name = name;
            this.scene.add(window);
        });
    }
}
