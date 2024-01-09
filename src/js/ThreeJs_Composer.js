


THREE.ThreeJs_Composer = function ( _renderer, _scene, _camera, _selectedObjects) {
    var composer = new THREE.EffectComposer( _renderer );
    var renderPass = new THREE.RenderPass( _scene, _camera );
    composer.addPass( renderPass );
    var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), _scene, _camera );
    outlinePass.edgeStrength = 5;//包围线浓度
    outlinePass.edgeGlow = 0.5;//边缘线范围
    outlinePass.edgeThickness = 2;//边缘线浓度
    outlinePass.pulsePeriod = 2;//包围线闪烁频率
    outlinePass.visibleEdgeColor.set( '#ffffff' );//包围线颜色
    outlinePass.hiddenEdgeColor.set( '#190a05' );//被遮挡的边界线颜色
    composer.addPass( outlinePass );
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );
    outlinePass.selectedObjects = _selectedObjects;
    return composer;
}



AddShelfLisghter = function ( _renderer, _scene, _camera,shelf_list) {

    var composer = new THREE.EffectComposer( _renderer );
    var renderPass = new THREE.RenderPass( _scene, _camera );
    var selectedObjects = [];
    composer.addPass( renderPass );
    var outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), _scene, _camera );

    outlinePass.visibleEdgeColor.set('rgba(152,245,255,0.61)'); // 边缘可见部分发颜色 sColor[0].color
    outlinePass.hiddenEdgeColor.set('rgba(234,71,100,0)' ); // 边缘遮挡部分发光颜色 sColor[1].color
    outlinePass.edgeStrength = 0.5; //边框的亮度
    outlinePass.edgeGlow = Number(2); //光晕[0,1]
    outlinePass.edgeThickness = Number(0.5); //边缘浓度
    outlinePass.pulsePeriod = Number(); //呼吸闪烁的速度 闪烁频率 ，默认0 ，值越大频率越低
    outlinePass.clear = true;
    composer.addPass( outlinePass );
    var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );
    if (shelf_list.length>0)
        shelf_list.forEach(item=>{
            item.goodsLocation.forEach(item1=>{
                selectedObjects.push( item1);
            })
        })
    outlinePass.selectedObjects = selectedObjects;//给选中的线条和物体加发光特效
    return composer;

}
