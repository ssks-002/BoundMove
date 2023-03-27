# BoundMove

AfterEffectにおけるバウンドアニメーション用のパネルドッキング可能なスクリプト

# 動作確認

After Effects CC 2022

# インストール

BoundMove.jsxをAdobe> Adobe After Effect 2022> Support Files> ScriptUI Panelsディレクトリに入れてください

# 使い方

ウィンドウメニューから起動してください

基本のレイアウトはOptionとApplyです　Optionで設定、Applyで適用
適用したヌルオブジェクトまたはトランスフォームエフェクトに対してキーフレームを打つと打った時間を基準にしてバウンドします
（エクスプレッション制御なので赤くなってる文字のところ）

エフェクトのDecay,Frequency,Amplitudeそれぞれのスライダー制御の名前は変えちゃダメです　レイヤーの名前で取得しているためです

また、create transform effectでは日本語版のエフェクト名を指定しているため、英語版では正しく動作しません
create null controllerオプションを使ってください

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



