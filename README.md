# BoundMove

Panel dockable script for bound animation in AfterEffect

# Operation confirmation

After Effects CC 2022

# install

Put BoundMove.jsx in the Adobe > Adobe After Effect 2022 > Support Files > ScriptUI Panels directory

# How to use

Start it from the window menu

The basic layout is Option and Apply　Setting with Option, applying with Apply

If you hit a keyframe on an applied null object or transform effect, it will bounce based on the keyframe
(The text is in red because it is expression control)

Do not change the names of the slider controls for Decay, Frequency, and Amplitude effects, as they are obtained using the layer name.

Also, because the effect name of the Japanese version is specified, **it will not work correctly in non-Japanese versions** (I don't understand the localize function well)

Multiple layers can be selected

## Option contents

Decay: Decay
Frequency: Vibration frequency
Amplitude: amplitude

This is the initial value and can be controlled with the slider control added after application. Negative values are also possible.

direction dropdown menu:

Specify the direction to apply

Z-direction is possible only when apply to position and create null controller is selected, and both the generated null object and the selected layer must be 3D objects.

apply to scale:

Apply a bounce effect to the scale

apply to positon:

Apply a bounce effect to the position

create null controller:

Control the layer you want to move with a null object. Enter a keyframe on the null transformation.
When overlapping multiple objects, apply it to the first null object created (because it is controlled by whip)

create transform effect:

Add and control the transformation along with slider control to the selected layer. Hit a keyframe on the transformation of the created effect.
______________________________________________________________________________________

AfterEffectにおけるバウンドアニメーション用のパネルドッキング可能なスクリプト

# 動作確認

After Effects CC 2022

# インストール

BoundMove.jsxをAdobe> Adobe After Effect 2022> Support Files> ScriptUI Panelsディレクトリに入れてください

# 使い方

ウィンドウメニューから起動してください

基本のレイアウトはOptionとApplyです　Optionで設定、Applyで適用

適用したヌルオブジェクトまたはトランスフォームエフェクトに対してキーフレームを打つとキーフレームを基準にしてバウンドします
（エクスプレッション制御なので赤くなってる文字のところ）

エフェクトのDecay,Frequency,Amplitudeそれぞれの**スライダー制御の名前は変えちゃダメ**です　レイヤーの名前で取得しているためです

また、日本語版のエフェクト名を指定しているため、**日本語版以外では正しく動作しません**（localize関数がよくわかりません）

複数レイヤー選択可能

## Option内容

Decay：減衰
Frequency：振動数
Amplitude：振幅

これは初期値であり適用後に追加されるスライダー制御で制御可能です　負の値も可能

directionドロップダウンメニュー：

適用する方向を指定します

Z-directionは後述のapply to positionかつcreate null controller選択時のみ可能かつ、生成されたヌルオブジェクトと選択したレイヤーがどちらとも3Dオブジェクトになっている必要があります

apply to scale：

スケールについてバウンド効果をかけます

apply to positon：

位置についてバウンド効果をかけます

create null controller：

ヌルオブジェクトで動かしたいレイヤーを制御します　ヌルのトランスフォームにキーフレームを打ってください
複数重ね掛けする場合は初めに作ったヌルオブジェクトに適用すること（ウィップで制御しているため）

create transform effect：

選択したレイヤーにスライダー制御とともにトランスフォームを追加し制御します　作成されたエフェクトの方のトランスフォームにキーフレームを打ってください



