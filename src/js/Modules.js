
//模型材质信息
var planeMat, RackMat, RackMat2, CargoMat, LineMat, RollTexture, RollMat;



//库区
class storageZone1{
    constructor(x,z,width,length,scene,name,textColor,font_size,textposition,col,row) {
        this.storageZone={
            x,z,width,length,col,row
        }
        this.init(x,z,width,length,scene,name,textColor,font_size,textposition)
    }
    //初始化库位
    init(x,z,width,length,scene,name,textColor,font_size,textposition,){
        this.x=x
        this.z=z
        this.width=width
        this.length=length
        this.scene=scene
        this.name=name
        this.textColor=textColor
        this.font_size=font_size
        this.textposition=textposition

        this.addArea()
        this.addPlane();
    }
    addArea() {
        let that=this

        new THREE.FontLoader().load('../ThreeJs/FZYaoTi_Regular.json',function(font){
            ////加入立体文字
            var text= new THREE.TextGeometry(that.name.split("$")[1],{
                // 设定文字字体
                font:font,
                //尺寸
                size:that.font_size,
                //厚度
                height:1
            });
            text.computeBoundingBox();
            //3D文字材质
            var m = new THREE.MeshStandardMaterial({color:"#" + that.textColor});
            var mesh = new THREE.Mesh(text,m)
            if(that.textposition == "左对齐"){
                mesh.position.x = that.x - that.width/2 + 10;
            }else if(that.textposition == "居中"){
                mesh.position.x = that.x - 15;
            }else if(that.textposition == "右对齐"){
                mesh.position.x = that.x + that.width/2 - 60;
            }
            mesh.position.y = 1.3;
            mesh.position.z = that.z + that.length/2 - 20;
            mesh.rotation.x = -Math.PI / 2.0;
            that.scene.add(mesh);
        });
    }
    addPlane() {
        var lineWidth = 8
        var geometry = new THREE.PlaneGeometry( lineWidth, this.length );
        var obj = new THREE.Mesh( geometry, LineMat );
        obj.position.set(this.x,1.5,this.z);
        obj.rotation.x = -Math.PI / 2.0;
        var obj2 = obj.clone();
        obj2.translateX(this.width);

        var geometry2 = new THREE.PlaneGeometry( lineWidth, this.width );
        var obj3 = new THREE.Mesh( geometry2, LineMat );
        obj3.position.set(this.x+this.width/2,1.5,this.z-this.length/2+lineWidth/2);
        obj3.rotation.x = -Math.PI / 2.0;
        obj3.rotation.z = -Math.PI / 2.0;
        var obj4 = obj3.clone();
        obj4.translateX(this.length-lineWidth);

        var group = new THREE.Group();
        group.add(obj);
        group.add(obj2);
        group.add(obj3);
        group.add(obj4);
        group.translateX(-this.width/2);
        this.scene.add( group );
    }
    //添加货架
    addShelfList(shelf_list){
        this.shelf_list=[]
        shelf_list.forEach((item,index)=>{
            this.shelf_list.push(new shelf(item,this.storageZone,index,this.scene))
        })
        return this.shelf_list
    }
    //添加货物
    addCargos(cargos_list){
        this.cargos_list=[]
        this.cargos_list_obj=[]
        this.shelf_list.forEach((item,index)=>{
            let w=this.storageZone.width/this.storageZone.col
            let offsetWidth=(index%this.storageZone.col)*w

            let h=this.storageZone.length/this.storageZone.row
            let offsetHeight=(parseInt((index)/this.storageZone.col))*h

            let positionX=-this.storageZone.width/2+item.planeLength/2+8+offsetWidth+this.storageZone.x
            let positionZ=-this.storageZone.length/2+8+offsetHeight+this.storageZone.z
            item.goodsLocation=[]
            for(var i = 0; i < item.layerNum; i++){
                let positionY=item.positionY*(i+1)
                for(var j = 0; j < item.columnNum; j++){
                    let x=cargos_list.find(x=>x.storageZoneId==item.storageZoneId&&x.shelfId==item.shelfId&&x.layerNember==i&&x.location==j)
                    //添加货物
                    if(x){
                        let cargo=new cargos(positionX, positionY, positionZ+item.planeWidth/item.columnNum/2 + (item.planeWidth/item.columnNum)*j, item,x,this.scene)
                        this.cargos_list.push(cargo)
                        this.cargos_list_obj.push(cargo.cargoObject)
                    }
                }
            }
        })
        return this.cargos_list_obj
    }
    //添加货位
    addLocation(){
        this.shelf_list.forEach((item,index)=>{
            let w=this.storageZone.width/this.storageZone.col
            let offsetWidth=(index%this.storageZone.col)*w

            let h=this.storageZone.length/this.storageZone.row
            let offsetHeight=(parseInt((index)/this.storageZone.col))*h

            let positionX=-this.storageZone.width/2+item.planeLength/2+8+offsetWidth+this.storageZone.x
            let positionZ=-this.storageZone.length/2+8+offsetHeight+this.storageZone.z
            item.goodsLocation=[]
            for(var i = 0; i < item.layerNum; i++){
                let positionY=item.positionY*(i+1)
                for(var j = 0; j < item.columnNum; j++){
                    item.addBoxLocation(positionX, positionY, positionZ+item.planeWidth/item.columnNum/2 + (item.planeWidth/item.columnNum)*j)

                }
            }
        })
    }
    removeLocation(){
        this.shelf_list.forEach(item=>{
            item.goodsLocation.forEach(goods=>{
                this.scene.remove(goods)
            })
        })
    }
}
//货架
class shelf{
    constructor(shelf_item,storageZone,index,scene) {
        this.scene=scene
        this.storageZone=storageZone
        this.init(shelf_item)
        this.goodsLocation=[]

        let w=this.storageZone.width/this.storageZone.col
        let offsetWidth=(index%this.storageZone.col)*w

        let h=this.storageZone.length/this.storageZone.row
        let offsetHeight=(parseInt((index)/this.storageZone.col))*h

        let positionX=-this.storageZone.width/2+this.planeLength/2+8+offsetWidth+this.storageZone.x
        let positionZ=-this.storageZone.length/2+8+offsetHeight+this.storageZone.z

        for(var i = 0; i < this.layerNum; i++){
            this.addRack(i,positionX,positionZ);
        }
     }
    /** x,y,z 整个模型在场景中的位置 */
    /** plane_x,plane_y,plane_z 货架板面的长高宽 */
    /** holder_x,holder_y,holder_z 货架支架的长高宽 */
    /** scene,name,num 要添加的场景,货架的名字,单层货架的库位数量 */
    init(shelf_item){
        this.storageZoneId=shelf_item.storageZoneId;
        this.shelfId=shelf_item.shelfId;
        this.shelfName=shelf_item.shelfName;
        this.planeLength= GET_PLANE_LENGTH();
        this.planeWidth=GET_PLANE_WIDTH();
        this.planeHeight=GET_PLANE_HEIGHT();
        this.holderLength=GET_HOLDER_LENGTH();
        this.holderWidth=GET_HOLDER_WIDTH();
        this.holderHeight=GET_HOLDER_HEIGHT();
        this.positionY=shelf_item.y;
        this.layerNum=GET_LAYER_NUM();
        this.columnNum=GET_COLUMN_NUM();
    }
    /** 放置单层货架 */
    addRack(numbers,positionX,positionZ) {
        let positionY=this.positionY*(numbers+1)
        let name= `${this.shelfName}`
        var plane = new THREE.BoxGeometry( this.planeLength, this.planeHeight, this.planeWidth/this.columnNum);

        for(var i = 0; i < this.columnNum; i++){
            var obj = new THREE.Mesh( plane, RackMat );
            obj.position.set(positionX , positionY, positionZ+this.planeWidth/this.columnNum/2 + (this.planeWidth/this.columnNum)*i) ;
            var msg = name+`-${numbers+1}-${+(GET_COLUMN_NUM() - i)}`;
            obj.name = msg;
            this.scene.add(obj);
        }
        var holder = new THREE.BoxGeometry( this.holderLength, this.holderHeight,  this.holderWidth );
        var obj2 = new THREE.Mesh( holder, RackMat2, 0 );
        var obj3 = new THREE.Mesh( holder, RackMat2, 0 );
        var obj4 = new THREE.Mesh( holder, RackMat2, 0 );
        var obj5 = new THREE.Mesh( holder, RackMat2, 0 );

        obj2.position.set(positionX-this.planeLength/2+this.holderLength/2,positionY-this.holderHeight/2-this.planeHeight/2,positionZ+ this.holderWidth/2);
        obj3.position.set(positionX+this.planeLength/2-this.holderLength/2,positionY-this.holderHeight/2-this.planeHeight/2,positionZ+ this.holderWidth/2);
        obj4.position.set(positionX-this.planeLength/2+this.holderLength/2,positionY-this.holderHeight/2-this.planeHeight/2,positionZ+this.planeWidth- this.holderWidth/2);
        obj5.position.set(positionX+this.planeLength/2-this.holderLength/2,positionY-this.holderHeight/2-this.planeHeight/2,positionZ+this.planeWidth- this.holderWidth/2);

        this.scene.add(obj2);
        this.scene.add(obj3);this.scene.add(obj4);this.scene.add(obj5);
    }
    addBoxLocation(positonX,positonY,positonZ) {
        var x =positonX
        var y = positonY + this.planeHeight/2;
        var z =positonZ;
        var geometry = new THREE.BoxGeometry( GET_BOX_SIZE(),1,GET_BOX_SIZE() );
        var lineMaterial = new THREE.MeshBasicMaterial({color:'rgb(0,31,45)',opacity:0,transparent:true,});
        const line = new THREE.Mesh(geometry, lineMaterial)
        line.position.set(x,y,z);
        line.name = '货位'
        this.scene.add(line)
        this.goodsLocation.push(line)
    }

}
//货物
class cargos{
    constructor(positionX, positionY, positionZ, shelf,x,scene) {
        this.positionX=positionX
        this.positionY=positionY
        this.positionZ=positionZ
        this.shelf=shelf
        this.cargo=x
        this.scene=scene

        this.addOneUnitCargos()
    }
    /** 添加单个货位上的货物 */
    addOneUnitCargos() {
        var x =this. positionX;
        var y = this.positionY + this.shelf.planeHeight/2+ GET_BOX_SIZE()/2;
        var z = this.positionZ;
        var geometry = new THREE.BoxGeometry( GET_BOX_SIZE(),GET_BOX_SIZE(),GET_BOX_SIZE() );
        var obj = new THREE.Mesh( geometry, CargoMat );
        obj.position.set(x,y,z);
        obj.name = "货物"+"-"+this.cargo.name;
        this.scene.add(obj);
        this.cargoObject=obj
    }
}




/** 初始化材质信息 */
function initMat() {
    planeMat = new THREE.MeshLambertMaterial();
    RackMat = new THREE.MeshLambertMaterial();
    RackMat2 = new THREE.MeshPhongMaterial({color:0x1C86EE});
    CargoMat = new THREE.MeshLambertMaterial();
    LineMat = new THREE.MeshLambertMaterial();
    RollMat = new THREE.MeshLambertMaterial();

    new THREE.TextureLoader().load( '../../images/plane.png', function( map ) {
        planeMat.map = map;
        planeMat.transparent = true;
        planeMat.opacity = 0.8;
        planeMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "../../images/rack.png", function( map ) {
        RackMat.map = map;
        RackMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "../../images/box.png", function( map ) {
        CargoMat.map = map;
        CargoMat.needsUpdate = true;
    } );
    new THREE.TextureLoader().load( "../../images/line.png", function( map ) {
        LineMat.map = map;
        LineMat.needsUpdate = true;
    } );
    RollTexture = new THREE.TextureLoader().load( "../../images/biaoyu.png", function( map ) {
        RollMat.map = map;
        RollMat.needsUpdate = true;
        RollMat.transparent = true;
        RollMat.side = THREE.DoubleSide;
    } );
    RollTexture.wrapS = THREE.RepeatWrapping;
    RollTexture.wrapT=THREE.RepeatWrapping;
}
