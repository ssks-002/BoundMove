//変数と初期値宣言,初期化
var decayvalue = {};
var freqvalue = {};
var ampvalue = {};
var Pos = {};
var Sca = {};
var ScaValue = true;
var bynull = {};
var BynullValue = true;
var byeffect = {};
var divdimension = {};
var DivdimensionSelection = 0;
decayvalue.text = 3;
freqvalue.text = 3;
ampvalue.text =  50;
bynull.value = true;
divdimension.selection = DivdimensionSelection;


//ScriptIPanelのレイアウトと各イベント設定
var buttongroup = this.add("group", undefined);
buttongroup.orientation="row";

var optionbutton = buttongroup.add("button", undefined, "Option");

optionbutton.onClick = function(){   

    var option = new Window("window", "BoundMove");
    option.alignChildren="left";
    
    option.onClose = function(){
        optionbutton.enabled = true;
    };
    optionbutton.enabled = false;

    var setting = option.add("group", undefined);

    var decay = setting.add("group", undefined);
        var decaytext =  decay.add("statictext", undefined,"Decay");
        decayvalue = decay.add("edittext", undefined,  decayvalue ? decayvalue.text : "3");
    var freq = setting.add("group", undefined);
        var freqtext = freq.add("statictext", undefined,"Frequency");
        freqvalue = freq.add("edittext", undefined, freqvalue ? freqvalue.text : "3");
    var amp = setting.add("group", undefined);
        var amptext = amp.add("statictext", undefined,"Amplitude");
        ampvalue = amp.add("edittext",undefined, ampvalue ? ampvalue.text : "50");

    divdimension = setting.add("dropdownlist", undefined, ["XY-direction", "X-direction", "Y-direction", "Z-direction"]);
    divdimension.items[3].enabled = false;
    divdimension.selection = DivdimensionSelection;
    divdimension.onChange = function() {
        DivdimensionSelection = divdimension.selection.index;
        };
    
    var PorSoption = option.add("panel", undefined, "option1");
    PorSoption.orientation = "row";
    PorSoption.alignChildren = "light";
        Sca = PorSoption.add("radiobutton", undefined, "apply to scale");
        Sca.value = ScaValue;
        Sca.onClick = function() {
            ScaValue = true;
            divdimension.items[3].enabled = false;
          };
        Pos = PorSoption.add("radiobutton", undefined, "apply to position");
        Pos.value = !ScaValue;
        Pos.onClick = function() {
            ScaValue = false;
            if(bynull.value){
                divdimension.items[3].enabled = true;
            }
          };

    var NorEoptioncontainer = option.add("panel", undefined, "option2");
    var NorEoption = NorEoptioncontainer.add("group", undefined);
    NorEoption.orientation = "row";
    NorEoption.alignChildren = "left";
    
        bynull= NorEoption.add("radiobutton", undefined, "create null controller");
        bynull.value = BynullValue;
        bynull.onClick = function() {
            BynullValue = true;
            if(Pos.value){
                divdimension.items[3].enabled = true;
            }
          };
        byeffect = NorEoption.add("radiobutton", undefined, "create transform effect");
        byeffect.value = !BynullValue;
        byeffect.onClick = function() {
            BynullValue = false;
            divdimension.items[3].enabled = false;
          };

    option.layout.layout();
    option.onResize = function(){
        option.layout.resize();
        };

    ScaValue = Sca.value;

    option.show();
};

var applybutton = buttongroup.add('button', undefined,"Apply");

this.layout.layout();
this.onResize = function(){
    this.layout.resize();
    };

applybutton.onClick = function (){

//主処理
    app.beginUndoGroup("BoundMove");

    var actlayers = app.project.activeItem.selectedLayers;

    if(actlayers.length  !== 0 ){
        if(divdimension.selection == null){
            alert("Invalid option")
        }else{
            for(var i=0; i < actlayers.length; i++){
                var item = actlayers[i];

                // create null controller
                if(bynull.value){

                        // 親子関係のあるヌルオブジェクトを選択したレイヤーのひとつ下に作成する
                        var nullLayer = item.containingComp.layers.addNull();
                        nullLayer.moveBefore(item);
                        item.parent = nullLayer;
                        var NullSprop = nullLayer.property("Scale");
        
                        // スライダー制御のエフェクトを作成する
                        var effectdecay = nullLayer.property("Effects").addProperty("ADBE Slider Control");
                        effectdecay.name = "decay";
                        effectdecay("ADBE Slider Control-0001").setValue(decayvalue ? decayvalue.text : 3);

                        var effectfreq = nullLayer.property("Effects").addProperty("ADBE Slider Control");
                        effectfreq.name = "freq";
                        effectfreq("ADBE Slider Control-0001").setValue(freqvalue ? freqvalue.text : 3);

                        var effectamp = nullLayer.property("Effects").addProperty("ADBE Slider Control");
                        effectamp.name = "amp";
                        effectamp("ADBE Slider Control-0001").setValue(ampvalue ? ampvalue.text : 50);

                    //apply to position
                    if(Pos.value){           

                    var NullProp = nullLayer.property("Position")

                        //XY-direction
                        if(divdimension.selection == 0){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-Position";
                            effectfreq.name = "freq-Position";
                            effectamp.name = "amp-Position";
                            nullLayer.name = "Bound-Position";
                            NullProp.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-Position")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-Position")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-Position")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp, Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
                            
                        //X-direction
                        }else if(divdimension.selection == 1){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-X-Position";
                            effectfreq.name = "freq-X-Position";
                            effectamp.name = "amp-X-Position";
                            nullLayer.name = "Bound-X-Position";
                            NullProp.expression =
                                'decay = thisComp.layer(thisLayer.name).effect("decay-X-Position")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-X-Position")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-X-Position")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
                        
                        //Y-direction        
                        }else if(divdimension.selection == 2){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-Y-Position";
                            effectfreq.name = "freq-Y-Position";
                            effectamp.name = "amp-Y-Position";
                            nullLayer.name = "Bound-Y-Position";
                            NullProp.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-Y-Position")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-Y-Position")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-Y-Position")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [0,Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
                        
                        //Z-direction  
                        }else if(divdimension.selection == 3){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-Z-Position";
                            effectfreq.name = "freq-Z-Position";
                            effectamp.name = "amp-Z-Position";
                            nullLayer.name = "Bound-Z-Position";
                            NullProp.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-Z-Position")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-Z-Position")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-Z-Position")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [0,0,Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
                        };
                    }else{
                        
                    //apply to scale
                    var NullSprop = nullLayer.property("Scale");

                        //XY-direction
                        if(divdimension.selection == 0){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-Scale";
                            effectfreq.name = "freq-Scale";
                            effectamp.name = "amp-Scale";
                            nullLayer.name = "Bound-Scale";
                            NullSprop.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-Scale")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-Scale")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-Scale")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp,Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
    
                        //X-direction
                        }else if(divdimension.selection == 1){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-X-Scale";
                            effectfreq.name = "freq-X-Scale";
                            effectamp.name = "amp-X-Scale";
                            nullLayer.name = "Bound-X-Scale";
                            NullSprop.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-X-Scale")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-X-Scale")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-X-Scale")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';

                        //Y-direction        
                        }else if(divdimension.selection == 2){
                            var effectdecay = nullLayer.property("Effects")("decay");
                            var effectfreq = nullLayer.property("Effects")("freq");
                            var effectamp = nullLayer.property("Effects")("amp");
                            effectdecay.name = "decay-Y-Scale";
                            effectfreq.name = "freq-Y-Scale";
                            effectamp.name = "amp-Y-Scale";
                            nullLayer.name = "Bound-Y-Scale";
                            NullSprop.expression = 
                                'decay = thisComp.layer(thisLayer.name).effect("decay-Y-Scale")("スライダー");\n' +
                                'freq = thisComp.layer(thisLayer.name).effect("freq-Y-Scale")("スライダー");\n' +
                                'amp = thisComp.layer(thisLayer.name).effect("amp-Y-Scale")("スライダー");\n' +
                                'n = 0;\n' +
                                'if (numKeys > 0){\n' +
                                '    n = nearestKey(time).index;\n' +
                                '    if (key(n).time > time){\n' +
                                '        n--;\n' +
                                '    }\n' +
                                '}\n' +
                                'if (n == 0){\n' +
                                '    t = 0;\n' +
                                '}else{\n' +
                                '    t = time - key(n).time;\n' +
                                '}\n' +
                                'value + [0,Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];'; 
                        };
                    };
                    
                // create transform effect
                }else{

                    // スライダー制御のエフェクトを作成する
                    var effectdecay = item.property("Effects").addProperty("ADBE Slider Control");
                    effectdecay.name = "decay";
                    effectdecay("ADBE Slider Control-0001").setValue(decayvalue ? decayvalue.text : 3);

                    var freq = item.property("Effects").addProperty("ADBE Slider Control");
                    freq.name = "freq";
                    freq("ADBE Slider Control-0001").setValue(freqvalue ? freqvalue.text : 3);

                    var amp = item.property("Effects").addProperty("ADBE Slider Control");
                    amp.name = "amp";
                    amp("ADBE Slider Control-0001").setValue(ampvalue ? ampvalue.text : 50);

                    // トランスフォームのエフェクトを作成する
                    var transform = item.property("Effects").addProperty("トランスフォーム");

                    //apply to position
                    if(Pos.value){
                        var Pprop = transform.property("位置");

                        //XY-direction
                        if(divdimension.selection == 0){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-Position";
                            effectfreq.name = "freq-Position";
                            effectamp.name = "amp-Position";
                            transform.name = "Bound-Position"
                            Pprop.expression = 
                                            'decay = thisComp.layer(thisLayer.name).effect("decay-Position")("スライダー");\n' +
                                            'freq = thisComp.layer(thisLayer.name).effect("freq-Position")("スライダー");\n' +
                                            'amp = thisComp.layer(thisLayer.name).effect("amp-Position")("スライダー");\n' +
                                            'n = 0;\n' +
                                            'if (numKeys > 0){\n' +
                                            '    n = nearestKey(time).index;\n' +
                                            '    if (key(n).time > time){\n' +
                                            '        n--;\n' +
                                            '    }\n' +
                                            '}\n' +
                                            'if (n == 0){\n' +
                                            '    t = 0;\n' +
                                            '}else{\n' +
                                            '    t = time - key(n).time;\n' +
                                            '}\n' +
                                            'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp, Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];'
                        
                        //X-direction
                        }else if(divdimension.selection == 1){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-X-Position";
                            effectfreq.name = "freq-X-Position";
                            effectamp.name = "amp-X-Position";
                            transform.name = "boundcontroller-X-Position"
                            Pprop.expression =
                                            'decay = thisComp.layer(thisLayer.name).effect("decay-X-Position")("スライダー");\n' +
                                            'freq = thisComp.layer(thisLayer.name).effect("freq-X-Position")("スライダー");\n' +
                                            'amp = thisComp.layer(thisLayer.name).effect("amp-X-Position")("スライダー");\n' +
                                            'n = 0;\n' +
                                            'if (numKeys > 0){\n' +
                                            '    n = nearestKey(time).index;\n' +
                                            '    if (key(n).time > time){\n' +
                                            '        n--;\n' +
                                            '    }\n' +
                                            '}\n' +
                                            'if (n == 0){\n' +
                                            '    t = 0;\n' +
                                            '}else{\n' +
                                            '    t = time - key(n).time;\n' +
                                            '}\n' +
                                            'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];'

                        //Y-direction
                        }else if(divdimension.selection == 2){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-Y-Position";
                            effectfreq.name = "freq-Y-Position";
                            effectamp.name = "amp-Y-Position";
                            transform.name = "boundcontroller-Y-Position"
                            Pprop.expression =
                                            'decay = thisComp.layer(thisLayer.name).effect("decay-Y-Position")("スライダー");\n' +
                                            'freq = thisComp.layer(thisLayer.name).effect("freq-Y-Position")("スライダー");\n' +
                                            'amp = thisComp.layer(thisLayer.name).effect("amp-Y-Position")("スライダー");\n' +
                                            'n = 0;\n' +
                                            'if (numKeys > 0){\n' +
                                            '    n = nearestKey(time).index;\n' +
                                            '    if (key(n).time > time){\n' +
                                            '        n--;\n' +
                                            '    }\n' +
                                            '}\n' +
                                            'if (n == 0){\n' +
                                            '    t = 0;\n' +
                                            '}else{\n' +
                                            '    t = time - key(n).time;\n' +
                                            '}\n' +
                                            'value + [0, Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];'

                        //Z-direction                     
                        }else if(divdimension.selection == 3){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-Z-Position";
                            effectfreq.name = "freq-Z-Position";
                            effectamp.name = "amp-Z-Position";
                            transform.name = "boundcontroller-Z-Position"
                            Pprop.expression =
                                            'decay = thisComp.layer(thisLayer.name).effect("decay-Z-Position")("スライダー");\n' +
                                            'freq = thisComp.layer(thisLayer.name).effect("freq-Z-Position")("スライダー");\n' +
                                            'amp = thisComp.layer(thisLayer.name).effect("amp-Z-Position")("スライダー");\n' +
                                            'n = 0;\n' +
                                            'if (numKeys > 0){\n' +
                                            '    n = nearestKey(time).index;\n' +
                                            '    if (key(n).time > time){\n' +
                                            '        n--;\n' +
                                            '    }\n' +
                                            '}\n' +
                                            'if (n == 0){\n' +
                                            '    t = 0;\n' +
                                            '}else{\n' +
                                            '    t = time - key(n).time;\n' +
                                            '}\n' +
                                            'value + [0,0, Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];'
                        };

                    //apply to scale                    
                    }else{
                        Sprop_h = transform.property("スケールの高さ");
                        Sprop_w = transform.property("スケールの幅");

                        //XY-direction
                        if(divdimension.selection == 0){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-Scale";
                            effectfreq.name = "freq-Scale";
                            effectamp.name = "amp-Scale";
                            transform.name = "boundcontroller-Scale"
                            Sprop_h.expression = 
                                        'decay = thisComp.layer(thisLayer.name).effect("decay-Scale")("スライダー");\n' +
                                        'freq = thisComp.layer(thisLayer.name).effect("freq-Scale")("スライダー");\n' +
                                        'amp = thisComp.layer(thisLayer.name).effect("amp-Scale")("スライダー");\n' +
                                        'n = 0;\n' +
                                        'if (numKeys > 0){\n' +
                                        '    n = nearestKey(time).index;\n' +
                                        '    if (key(n).time > time){\n' +
                                        '        n--;\n' +
                                        '    }\n' +
                                        '}\n' +
                                        'if (n == 0){\n' +
                                        '    t = 0;\n' +
                                        '}else{\n' +
                                        '    t = time - key(n).time;\n' +
                                        '}\n' +
                                        'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';

                            Sprop_w.expression =
                                        'decay = thisComp.layer(thisLayer.name).effect("decay-Scale")("スライダー");\n' +
                                        'freq = thisComp.layer(thisLayer.name).effect("freq-Scale")("スライダー");\n' +
                                        'amp = thisComp.layer(thisLayer.name).effect("amp-Scale")("スライダー");\n' +
                                        'n = 0;\n' +
                                        'if (numKeys > 0){\n' +
                                        '    n = nearestKey(time).index;\n' +
                                        '    if (key(n).time > time){\n' +
                                        '        n--;\n' +
                                        '    }\n' +
                                        '}\n' +
                                        'if (n == 0){\n' +
                                        '    t = 0;\n' +
                                        '}else{\n' +
                                        '    t = time - key(n).time;\n' +
                                        '}\n' +
                                        'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';

                        //X-direction
                        }else if(divdimension.selection == 1){
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-X-Scale";
                            effectfreq.name = "freq-X-Scale";
                            effectamp.name = "amp-X-Scale";
                            transform.name = "boundcontroller-X-Scale"
                            Sprop_w.expression = 
                                        'decay = thisComp.layer(thisLayer.name).effect("decay-X-Scale")("スライダー");\n' +
                                        'freq = thisComp.layer(thisLayer.name).effect("freq-X-Scale")("スライダー");\n' +
                                        'amp = thisComp.layer(thisLayer.name).effect("amp-X-Scale")("スライダー");\n' +
                                        'n = 0;\n' +
                                        'if (numKeys > 0){\n' +
                                        '    n = nearestKey(time).index;\n' +
                                        '    if (key(n).time > time){\n' +
                                        '        n--;\n' +
                                        '    }\n' +
                                        '}\n' +
                                        'if (n == 0){\n' +
                                        '    t = 0;\n' +
                                        '}else{\n' +
                                        '    t = time - key(n).time;\n' +
                                        '}\n' +
                                        'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';

                        //Y-direction    
                        }else{
                            var effectdecay = item.property("Effects")("decay");
                            var effectfreq = item.property("Effects")("freq");
                            var effectamp = item.property("Effects")("amp");
                            effectdecay.name = "decay-Y-Scale";
                            effectfreq.name = "freq-Y-Scale";
                            effectamp.name = "amp-Y-Scale";
                            transform.name = "boundcontroller-Y-Scale"
                            Sprop_h.expression = 
                                        'decay = thisComp.layer(thisLayer.name).effect("decay-Y-Scale")("スライダー");\n' +
                                        'freq = thisComp.layer(thisLayer.name).effect("freq-Y-Scale")("スライダー");\n' +
                                        'amp = thisComp.layer(thisLayer.name).effect("amp-Y-Scale")("スライダー");\n' +
                                        'n = 0;\n' +
                                        'if (numKeys > 0){\n' +
                                        '    n = nearestKey(time).index;\n' +
                                        '    if (key(n).time > time){\n' +
                                        '        n--;\n' +
                                        '    }\n' +
                                        '}\n' +
                                        'if (n == 0){\n' +
                                        '    t = 0;\n' +
                                        '}else{\n' +
                                        '    t = time - key(n).time;\n' +
                                        '}\n' +
                                        'value + [Math.sin(t*freq*2*Math.PI)/Math.exp(decay*t)*amp];';
                        };
                    };
                };
            };
        };
    }else{
        alert("No item selected");
    };

    app.endUndoGroup();
    
};
