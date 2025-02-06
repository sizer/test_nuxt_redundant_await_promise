# TL;DR

- Vueのリアクティブデータを変更しても、同期的かつCPUを占有するような長い処理を実行すると、イベントループがブロックされブラウザのレンダリングが止まる場合がある。
- `await new Promise((resolve) => setTimeout(resolve, 0));` はタスクキューが空になるのを待つため、長い処理の前に書くことで画面の更新を待つことが出来る。

### イベントループ

> JavaScriptのイベントループは、非同期処理を管理する中核的な仕組みです。主に以下のコンポーネントで構成されています。
> 
> - コールスタック
>   - 同期的な処理が積まれる場所
>   - 後入れ先出し（LIFO）で処理される
> - タスクキュー（マクロタスク）
>   - setTimeout, setInterval, UIイベントなどの処理が入る
>   - コールスタックが空になってから処理される
> - マイクロタスクキュー
>   - Promise, process.nextTickなどの処理が入る
>   - 各マクロタスクの後に処理される
> 
> https://anveloper.com/2024/12/13/react-%E9%9D%9E%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86%E5%86%85%E3%81%AE%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/

## https://chatgpt.com/share/67a4cd3a-55e0-8000-b75d-1401da4e62d8

> `handleClickMeaningLessLongCalcTimeLogic` をクリックした際に `Status: started` が表示されない理由は、JavaScript の イベントループとレンダリングのタイミング によるものです。
> 
> ### 詳細な原因
> 1. Vue のリアクティブシステムと DOM 更新  
> `mystatusStore.setStatus("started")` を呼ぶことで、Vue のリアクティブシステムにより status が "started" に更新されます。  
> Vue はリアクティブデータの変更を検知すると、次のブラウザのレンダリングタイミングで DOM を更新 します。
> 
> 2. `meaninglessLongCalcTimeLogic` の影響  
> `handleClickMeaningLessLongCalcTimeLogic` では、 `mystatusStore.setStatus("started")` を呼んだ直後に、ブロッキング処理（`meaninglessLongCalcTimeLogic`） を実行しています。  
> `meaninglessLongCalcTimeLogic` は約 2 秒間、CPU を占有して イベントループをブロック します。
> 
> 3. ブラウザのレンダリングのタイミング  
> JavaScript の実行は 単一スレッド で動作します。  
> `handleClickMeaningLessLongCalcTimeLogic` 内のコードは、 すべての処理が終わるまで制御がブラウザに戻りません。  
> `setStatus("started")` でデータは更新されますが、Vue は次のレンダリングタイミング で UI を更新しようとします。  
> しかし、`meaninglessLongCalcTimeLogic` が ブラウザのレンダリングを阻害している ため、 `Status: started` の表示が更新される前に `setStatus("completed")` が実行されてしまいます。  
> 
> ### 対処方法
> イベントループをブロックしないようにすれば、`Status: started` が表示されます。
> 
> ### 方法1: `setTimeout(0)` を使う
> ```ts
> const handleClickMeaningLessLongCalcTimeLogicWithSetTimeoutZero = async () => {
>   mystatusStore.setStatus("started");
>   
>   // JavaScriptの実行を一度中断して、DOMの更新を待つ
>   await new Promise((resolve) => setTimeout(resolve, 0));
> 
>   meaninglessLongCalcTimeLogic();
> 
>   mystatusStore.setStatus("completed");
> };
> ```
> 
> ### ポイント
> 
> `setTimeout(0)` を入れることで、JavaScript の処理を 次のイベントループに送る。  
> これにより、Vue は setStatus("started") の変更を反映し、UI が更新されるタイミングを確保できる。
> 
> https://chatgpt.com/share/67a4cd3a-55e0-8000-b75d-1401da4e62d8