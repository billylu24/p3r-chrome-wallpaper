function LAppLive2DManager() {
    // console.log("--> LAppLive2DManager()");

    // モデルデータ
    this.models = [];  // LAppModel

    //  サンプル機能
    this.count = -1;
    this.reloadFlg = false; // モデル再読み込みのフラグ
    this.reactionResetTimer = null;

    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager);

}

LAppLive2DManager.prototype.createModel = function () {
    // console.log("--> LAppLive2DManager.createModel()");

    var model = new LAppModel();
    this.models.push(model);

    return model;
}


LAppLive2DManager.prototype.changeModel = function (gl) {
    // console.log("--> LAppLive2DManager.update(gl)");

    if (this.reloadFlg) {
        // モデル切り替えボタンが押された時、モデルを再読み込みする
        this.reloadFlg = false;
        var no = parseInt(this.count % 5);

        var thisRef = this;
        // switch (no)
        // {
        //     case 0: // ハル
        //         this.releaseModel(1, gl);
        //         this.releaseModel(0, gl);
        //         // OpenGLのコンテキストをセット
        //         this.createModel();
        //         this.models[0].load(gl, LAppDefine.MODEL_HARU);
        //         break;
        // case 1: // しずく
        //     this.releaseModel(0, gl);
        //     this.createModel();
        //     this.models[0].load(gl, LAppDefine.MODEL_SHIZUKU);
        //     break;
        // case 2: // わんこ
        //     this.releaseModel(0, gl);
        //     this.createModel();
        //     this.models[0].load(gl, LAppDefine.MODEL_WANKO);
        //     break;
        // case 3: // Epsilon2.1モデル
        //     this.releaseModel(0, gl);
        //     this.createModel();
        //     this.models[0].load(gl, LAppDefine.MODEL_EPSILON);
        //     break;
        // case 4: // 複数モデル
        //     this.releaseModel(0, gl);
        //     // 一体目のモデル
        //     this.createModel();
        //     this.models[0].load(gl, LAppDefine.MODEL_HARU_A, function() {
        //         // 二体目のモデル
        //         thisRef.createModel();
        //         thisRef.models[1].load(gl, LAppDefine.MODEL_HARU_B);
        //     });
        //     break;
        //     case 2: // さきこ
        //         console.log("sakikodayo")
        //         this.releaseModel(0, gl);
        //         this.createModel();
        //         this.models[0].load(gl, LAppDefine.MODEL_SAKIKO);
        //         break;
        //     default:
        //         break;
        // }
        console.log("sakikodayo")
        this.releaseModel(0, gl);
        this.createModel();
        this.models[0].load(gl, LAppDefine.MODEL_SAKIKO);
    }
};


LAppLive2DManager.prototype.getModel = function (no) {
    // console.log("--> LAppLive2DManager.getModel(" + no + ")");

    if (no >= this.models.length) return null;

    return this.models[no];
};


/*
 * モデルを解放する
 * ないときはなにもしない
 */
LAppLive2DManager.prototype.releaseModel = function (no, gl) {
    // console.log("--> LAppLive2DManager.releaseModel(" + no + ")");

    if (this.models.length <= no) return;

    this.models[no].release(gl);

    delete this.models[no];
    this.models.splice(no, 1);
};


/*
 * モデルの数
 */
LAppLive2DManager.prototype.numModels = function () {
    return this.models.length;
};


/*
 * ドラッグしたとき、その方向を向く設定する
 */
LAppLive2DManager.prototype.setDrag = function (x, y) {
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].setDrag(x, y);
    }
}


LAppLive2DManager.prototype.startRandomMotion = function (name, priority) {
    for (var i = 0; i < this.models.length; i++) {
        var model = this.models[i];
        if (model && model.initialized && !model.updating) {
            model.startRandomMotion(name, priority || LAppDefine.PRIORITY_FORCE);
        }
    }
}


LAppLive2DManager.prototype.setRandomExpression = function () {
    for (var i = 0; i < this.models.length; i++) {
        var model = this.models[i];
        if (model && model.initialized && !model.updating) {
            model.setRandomExpression();
        }
    }
}


LAppLive2DManager.prototype.startRandomReaction = function () {
    var groups = [
        LAppDefine.MOTION_GROUP_SMILE,
        LAppDefine.MOTION_GROUP_NOD,
        LAppDefine.MOTION_GROUP_THINKING,
        LAppDefine.MOTION_GROUP_SURPRISED,
        LAppDefine.MOTION_GROUP_SHAME,
        LAppDefine.MOTION_GROUP_SIGH,
        LAppDefine.MOTION_GROUP_SERIOUS,
        LAppDefine.MOTION_GROUP_BYE
    ];
    var group = groups[parseInt(Math.random() * groups.length)];

    this.setRandomExpression();
    this.startRandomMotion(group, LAppDefine.PRIORITY_FORCE);
    this.scheduleReactionReset();
}

LAppLive2DManager.prototype.scheduleReactionReset = function () {
    var thisRef = this;

    if (this.reactionResetTimer) {
        clearTimeout(this.reactionResetTimer);
    }

    this.reactionResetTimer = setTimeout(function () {
        thisRef.reactionResetTimer = null;
        thisRef.resetReaction();
    }, 4200);
}

LAppLive2DManager.prototype.resetReaction = function () {
    for (var i = 0; i < this.models.length; i++) {
        var model = this.models[i];
        if (model && model.initialized && !model.updating) {
            model.setExpression("f01");
        }
    }
}


/*
 * 画面が最大になったときのイベント
 */
LAppLive2DManager.prototype.maxScaleEvent = function () {
    if (LAppDefine.DEBUG_LOG)
        console.log("Max scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_IN,
            LAppDefine.PRIORITY_NORMAL);
    }
}


/*
 * 画面が最小になったときのイベント
 */
LAppLive2DManager.prototype.minScaleEvent = function () {
    if (LAppDefine.DEBUG_LOG)
        console.log("Min scale event.");
    for (var i = 0; i < this.models.length; i++) {
        this.models[i].startRandomMotion(LAppDefine.MOTION_GROUP_PINCH_OUT,
            LAppDefine.PRIORITY_NORMAL);
    }
}


/*
 * タップしたときのイベント
 */
LAppLive2DManager.prototype.tapEvent = function (x, y) {
    for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].hitTest(LAppDefine.HIT_AREA_HEAD, x, y)) {
            this.startRandomReaction();
            return true;
        }

        if (this.models[i].hitTest(LAppDefine.HIT_AREA_HAND, x, y)) {
            this.startRandomReaction();
            return true;
        }

        if (this.models[i].hitTest(LAppDefine.HIT_AREA_BODY, x, y)) {
            this.startRandomReaction();
            return true;
        }
    }
    this.startRandomReaction();
    return false;
};

