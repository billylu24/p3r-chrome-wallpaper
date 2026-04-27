var thisRef = this;

// JavaScriptで発生したエラーを取得
window.onerror = function(msg, url, line, col, error) {
    var errmsg = "file:" + url + "<br>line:" + line + " " + msg;
    l2dError(errmsg);
}

function live2dDriver()
{
    this.platform = window.navigator.platform.toLowerCase();
    
    this.live2DMgr = new LAppLive2DManager();

    this.isDrawStart = false;
    
    this.gl = null;
    this.canvas = null;
    
    this.dragMgr = null; /*new L2DTargetPoint();*/ // ドラッグによるアニメーションの管理
    this.viewMatrix = null; /*new L2DViewMatrix();*/
    this.projMatrix = null; /*new L2DMatrix44()*/
    this.deviceToScreen = null; /*new L2DMatrix44();*/
    
    this.drag = false; // ドラッグ中かどうか
    this.oldLen = 0;    // 二本指タップした時の二点間の距離
    
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lookResetTimer = null;
    this.lookTargetX = 0;
    this.lookTargetY = 0;
    this.lookCurrentX = 0;
    this.lookCurrentY = 0;
    this.lookLastTime = 0;
    this.lookAnimationFrame = null;
    this.lookMaxSpeed = 1.7;
    
    this.isModelShown = false;
    
    // モデル描画用canvasの初期化
    initL2dCanvas("glcanvas");
    
    // モデル用マトリクスの初期化と描画の開始
    init();
}


function initL2dCanvas(canvasId)
{
    this.canvas = document.getElementById(canvasId);

    // iframe 内部鼠标跟随：保留，鼠标在 character 小框内时仍然正常
    window.addEventListener("mousemove", onGlobalMouseMove, false);

    // 接收外层 newtab 的全屏鼠标位置
    window.addEventListener("message", onParentPointerMessage, false);

    // 只保留点击脸部切表情
    this.canvas.addEventListener("click", onCanvasClick, false);
}
function onGlobalMouseMove(event)
{
    var rect = thisRef.canvas.getBoundingClientRect();

    var localX = event.clientX - rect.left;
    var localY = event.clientY - rect.top;

    var vx = transformViewX(localX);
    var vy = transformViewY(localY);

    setSmoothLookTarget(vx, vy);
}
function clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

/*
 * 接收外层 newtab 发来的整页鼠标坐标。
 * data.xRatio / data.yRatio 是相对于整个 newtab viewport 的 0~1 比例。
 */
function onParentPointerMessage(event)
{
    if (event.origin !== window.location.origin) return;

    var data = event.data;

    if (!data || typeof data !== "object") return;

    if (data.type === "p3r-global-pointer") {
        onExternalGlobalPointer(data.xRatio, data.yRatio);
    }

    if (data.type === "p3r-global-pointer-leave") {
        lookFront();
    }
}

/*
 * 直接控制 Live2D 的 dragMgr。
 * 不再模拟 mousemove，因为你的源码真正需要的是 dragMgr.setPoint(vx, vy)。
 */
function onExternalGlobalPointer(xRatio, yRatio)
{
    if (!thisRef || !thisRef.canvas || !thisRef.dragMgr) return;

    var safeX = clamp(Number(xRatio) || 0, 0, 1);
    var safeY = clamp(Number(yRatio) || 0, 0, 1);

    /*
     * Live2D view 坐标：
     * x: 左 -1，右 +1
     * y: 上 +ratio，下 -ratio
     *
     * 你的 init() 里 ratio = canvas.height / canvas.width，
     * screenRect 是 left=-1, right=1, bottom=-ratio, top=ratio。
     */
    var ratio = thisRef.canvas.height / thisRef.canvas.width;

    var vx = safeX * 2 - 1;
    var vy = (1 - safeY * 2) * ratio;

    vx = clamp(vx, -1, 1);
    vy = clamp(vy, -ratio, ratio);

    setSmoothLookTarget(vx, vy);
}

function setSmoothLookTarget(x, y)
{
    if (!thisRef || !thisRef.dragMgr) return;

    thisRef.lookTargetX = x;
    thisRef.lookTargetY = y;

    if (!thisRef.lookLastTime) {
        thisRef.lookLastTime = performance.now();
    }

    if (thisRef.lookAnimationFrame) return;

    thisRef.lookAnimationFrame = requestAnimationFrame(updateSmoothLookTarget);
}

function updateSmoothLookTarget(timestamp)
{
    if (!thisRef || !thisRef.dragMgr) return;

    thisRef.lookAnimationFrame = null;

    var lastTime = thisRef.lookLastTime || timestamp;
    var deltaSec = Math.max(0.001, Math.min(0.05, (timestamp - lastTime) / 1000));
    var dx = thisRef.lookTargetX - thisRef.lookCurrentX;
    var dy = thisRef.lookTargetY - thisRef.lookCurrentY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var maxStep = thisRef.lookMaxSpeed * deltaSec;

    thisRef.lookLastTime = timestamp;

    if (distance <= Math.max(0.001, maxStep)) {
        thisRef.lookCurrentX = thisRef.lookTargetX;
        thisRef.lookCurrentY = thisRef.lookTargetY;
    } else {
        thisRef.lookCurrentX += dx / distance * maxStep;
        thisRef.lookCurrentY += dy / distance * maxStep;
    }

    thisRef.dragMgr.setPoint(thisRef.lookCurrentX, thisRef.lookCurrentY);

    if (distance > maxStep) {
        thisRef.lookAnimationFrame = requestAnimationFrame(updateSmoothLookTarget);
    }
}
function onCanvasClick(event)
{
    var rect = thisRef.canvas.getBoundingClientRect();

    var vx = transformViewX(event.clientX - rect.left);
    var vy = transformViewY(event.clientY - rect.top);

    thisRef.live2DMgr.tapEvent(vx, vy);
}

function init()
{    
    // 3Dバッファの初期化
    var width = this.canvas.width;
    var height = this.canvas.height;
    
    this.dragMgr = new L2DTargetPoint();

    // ビュー行列
    var ratio = height / width;
    var left = LAppDefine.VIEW_LOGICAL_LEFT;
    var right = LAppDefine.VIEW_LOGICAL_RIGHT;
    var bottom = -ratio;
    var top = ratio;

    this.viewMatrix = new L2DViewMatrix();

    // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
    this.viewMatrix.setScreenRect(left, right, bottom, top);
    
    // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
    this.viewMatrix.setMaxScreenRect(LAppDefine.VIEW_LOGICAL_MAX_LEFT,
                                     LAppDefine.VIEW_LOGICAL_MAX_RIGHT,
                                     LAppDefine.VIEW_LOGICAL_MAX_BOTTOM,
                                     LAppDefine.VIEW_LOGICAL_MAX_TOP); 

    this.viewMatrix.setMaxScale(LAppDefine.VIEW_MAX_SCALE);
    this.viewMatrix.setMinScale(LAppDefine.VIEW_MIN_SCALE);

    this.projMatrix = new L2DMatrix44();
    this.projMatrix.multScale(1, (width / height));

    // マウス用スクリーン変換行列
    this.deviceToScreen = new L2DMatrix44();
    this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    this.deviceToScreen.multScale(2 / width, -2 / width);
    
    
    // WebGLのコンテキストを取得する
    this.gl = getWebGLContext();
    if (!this.gl) {
        l2dError("Failed to create WebGL context.");
        return;
    }
    // OpenGLのコンテキストをセット
    Live2D.setGL(this.gl);

    // 描画エリアを白でクリア
    this.live2DMgr.createModel();
    this.live2DMgr.models[0].load(this.gl, LAppDefine.MODEL_SAKIKO);

    startDraw();
}


function startDraw() {
    if(!this.isDrawStart) {
        this.isDrawStart = true;
        (function tick() {
                draw(); // 1回分描画

                var requestAnimationFrame = 
                    window.requestAnimationFrame || 
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame || 
                    window.msRequestAnimationFrame;

                // 一定時間後に自身を呼び出す
                requestAnimationFrame(tick ,this.canvas);   
        })();
    }
}


function draw()
{
    // l2dLog("--> draw()");

    MatrixStack.reset();
    MatrixStack.loadIdentity();
    
    this.dragMgr.update(); // ドラッグ用パラメータの更新
    this.live2DMgr.setDrag(this.dragMgr.getX(), this.dragMgr.getY());
    
    // Canvasをクリアする
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    MatrixStack.multMatrix(projMatrix.getArray());
    MatrixStack.multMatrix(viewMatrix.getArray());
    MatrixStack.push();
    
    for (var i = 0; i < this.live2DMgr.numModels(); i++)
    {
        var model = this.live2DMgr.getModel(i);

        if(model == null) return;
        
        if (model.initialized && !model.updating)
        {
            model.update();
            model.draw(this.gl);
            
            if (!this.isModelShown && i == this.live2DMgr.numModels()-1) {
                this.isModelShown = !this.isModelShown;
                var btnChange = document.getElementById("btnChange");
                btnChange.textContent = "Change Model";
                btnChange.removeAttribute("disabled");
                btnChange.setAttribute("class", "active");
            }
        }
    }
    
    MatrixStack.pop();
}


function changeModel()
{
    var btnChange = document.getElementById("btnChange");
    btnChange.setAttribute("disabled","disabled");
    btnChange.setAttribute("class", "inactive");
    btnChange.textContent = "Now Loading...";
    this.isModelShown = false;
    
    this.live2DMgr.reloadFlg = true;
    this.live2DMgr.count++;

    this.live2DMgr.changeModel(this.gl);
}

/* ********** マウスイベント ********** */

/*
 * マウスホイールによる拡大縮小
 */
function modelScaling(scale)
{   
    var isMaxScale = thisRef.viewMatrix.isMaxScale();
    var isMinScale = thisRef.viewMatrix.isMinScale();
    
    thisRef.viewMatrix.adjustScale(0, 0, scale);

    // 画面が最大になったときのイベント
    if (!isMaxScale)
    {
        if (thisRef.viewMatrix.isMaxScale())
        {
            thisRef.live2DMgr.maxScaleEvent();
        }
    }
    // 画面が最小になったときのイベント
    if (!isMinScale)
    {
        if (thisRef.viewMatrix.isMinScale())
        {
            thisRef.live2DMgr.minScaleEvent();
        }
    }
}


/*
 * クリックされた方向を向く
 * タップされた場所に応じてモーションを再生
 */
function modelTurnHead(event)
{
    thisRef.drag = true;
    
    var rect = event.target.getBoundingClientRect();
    
    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var vx = transformViewX(event.clientX - rect.left);
    var vy = transformViewY(event.clientY - rect.top);
    
    if (LAppDefine.DEBUG_MOUSE_LOG)
        l2dLog("onMouseDown device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    thisRef.lastMouseX = sx;
    thisRef.lastMouseY = sy;

    setSmoothLookTarget(vx, vy); // その方向を向く
    
    // タップした場所に応じてモーションを再生
    thisRef.live2DMgr.tapEvent(vx, vy);
}


/*
 * マウスを動かした時のイベント
 */
function followPointer(event)
{    
    var rect = event.target.getBoundingClientRect();
    
    var sx = transformScreenX(event.clientX - rect.left);
    var sy = transformScreenY(event.clientY - rect.top);
    var vx = transformViewX(event.clientX - rect.left);
    var vy = transformViewY(event.clientY - rect.top);
    
    if (LAppDefine.DEBUG_MOUSE_LOG)
        l2dLog("onMouseMove device( x:" + event.clientX + " y:" + event.clientY + " ) view( x:" + vx + " y:" + vy + ")");

    if (thisRef.drag)
    {
        thisRef.lastMouseX = sx;
        thisRef.lastMouseY = sy;

        setSmoothLookTarget(vx, vy); // その方向を向く
    }
}


/*
 * 正面を向く
 */
function lookFront()
{
    setSmoothLookTarget(0, 0);
}


function mouseEvent(e)
{
    e.preventDefault();
    
    if (e.type == "mousewheel") {

        if (e.clientX < 0 || thisRef.canvas.clientWidth < e.clientX || 
        e.clientY < 0 || thisRef.canvas.clientHeight < e.clientY)
        {
            return;
        }
        
        if (e.wheelDelta > 0) modelScaling(1.1); // 上方向スクロール 拡大
        else modelScaling(0.9); // 下方向スクロール 縮小

        
    } else if (e.type == "mousedown") {

        // 右クリック以外なら処理を抜ける
        if("button" in e && e.button != 0) return;
        
        modelTurnHead(e);
        
    } else if (e.type == "mousemove") {
        
        followPointer(e);
        
    } else if (e.type == "mouseup") {
        
        // 右クリック以外なら処理を抜ける
        if("button" in e && e.button != 0) return;
        
        lookFront();
        
    } else if (e.type == "mouseout") {
        
        lookFront();
        
    } else if (e.type == "contextmenu") {
        
        changeModel();
    }

}


function touchEvent(e)
{
    e.preventDefault();
    
    var touch = e.touches[0];
    
    if (e.type == "touchstart") {
        if (e.touches.length == 1) modelTurnHead(touch);
        // onClick(touch);
        
    } else if (e.type == "touchmove") {
        followPointer(touch);
        
        if (e.touches.length == 2) {
            var touch1 = e.touches[0];
            var touch2 = e.touches[1];
            
            var len = Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2);
            if (thisRef.oldLen - len < 0) modelScaling(1.025); // 上方向スクロール 拡大
            else modelScaling(0.975); // 下方向スクロール 縮小
            
            thisRef.oldLen = len;
        }
        
    } else if (e.type == "touchend") {
        lookFront();
    }
}


/* ********** マトリックス操作 ********** */

function transformViewX(deviceX)
{
    var screenX = this.deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得。
    return viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値。
}


function transformViewY(deviceY)
{
    var screenY = this.deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得。
    return viewMatrix.invertTransformY(screenY); // 拡大、縮小、移動後の値。
}


function transformScreenX(deviceX)
{
    return this.deviceToScreen.transformX(deviceX);
}


function transformScreenY(deviceY)
{
    return this.deviceToScreen.transformY(deviceY);
}


/*
* WebGLのコンテキストを取得する
*/
function getWebGLContext()
{
    var NAMES = [ "webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];

    for( var i = 0; i < NAMES.length; i++ ){
        try{
            var ctx = this.canvas.getContext(NAMES[i], {premultipliedAlpha : true});
            if(ctx) return ctx;
        }
        catch(e){}
    }
    return null;
};


/*
* 画面ログを出力
*/
function l2dLog(msg) {
    if(!LAppDefine.DEBUG_LOG) return;
    
    var myconsole = document.getElementById("myconsole");
    myconsole.innerHTML = myconsole.innerHTML + "<br>" + msg;
    
    console.log(msg);
}


/*
* 画面エラーを出力
*/
function l2dError(msg)
{
    if(!LAppDefine.DEBUG_LOG) return;
    
    l2dLog( "<span style='color:red'>" + msg + "</span>");
    
    console.error(msg);
};
