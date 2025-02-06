<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; width: 50rem; margin: 0 auto;">
    <h1>
      mystatusStore.status: {{ mystatusStore.status }} <br>
      storeToRefs(mystatusStore).status: {{ mystatusRef }}
    </h1>
    <button @click="mystatusStore.setStatus('default')">Set Status to default</button>

    <h2>Failed: never display "started"...</h2>
    <button @click="handleClickMeaningLessLongCalcTimeLogic">meaninglessLongCalcTimeLogic</button>
    <button @click="handleClickMeaningLessLongCalcTimeButAsyncLogic">meaninglessLongCalcTime - ButAsyncLogic</button>
    <button @click="handleClickMeaningLessLongCalcTimeLogicWithNextTick">meaninglessLongCalcTimeLogic -
      await nextTick();</button>
    <button @click="handleClickMeaningLessLongCalcTimeLogicWithRequestAnimationFrame">meaninglessLongCalcTimeLogic -
      requestAnimationFrame</button>

    <h2>Success: display "started"</h2>
    <button @click="handleClickMeaningLessLongCalcTimeLogicWithSetTimeoutZero">meaninglessLongCalcTimeLogic - with await
      new
      Promise((resolve) => setTimeout(resolve, 0))</button>

  </div>
</template>

<script lang="ts" setup>
import { useMystatusStore } from '~/stores/mystatus';

const mystatusStore = useMystatusStore();
const {
  status: mystatusRef
} = storeToRefs(mystatusStore);

const meaninglessLongCalcTimeLogic = (): void => {
  const start = Date.now();

  while (true) {
    if (Date.now() - start > 2_000) {
      break;
    }
    Math.sqrt(Math.random() * 1_000);
  }
}

const handleClickMeaningLessLongCalcTimeLogic = () => {
  mystatusStore.setStatus("started");

  // never display "started"...
  meaninglessLongCalcTimeLogic();

  mystatusStore.setStatus("completed");
};

const handleClickMeaningLessLongCalcTimeButAsyncLogic = async () => {
  mystatusStore.setStatus("started");

  // never display "started"...
  await new Promise((resolve) => {
    meaninglessLongCalcTimeLogic();
    resolve(null);
  });

  mystatusStore.setStatus("completed");
};

const handleClickMeaningLessLongCalcTimeLogicWithNextTick = async () => {
  mystatusStore.setStatus("started");

  // never display "started"...
  await nextTick();
  meaninglessLongCalcTimeLogic();

  mystatusStore.setStatus("completed");
};

const handleClickMeaningLessLongCalcTimeLogicWithRequestAnimationFrame = async () => {
  mystatusStore.setStatus("started");

  // never display "started"...
  requestAnimationFrame(meaninglessLongCalcTimeLogic);

  mystatusStore.setStatus("completed");
};

const handleClickMeaningLessLongCalcTimeLogicWithSetTimeoutZero = async () => {
  mystatusStore.setStatus("started");

  // display "started" when thie line called
  await new Promise((resolve) => setTimeout(resolve, 0));

  meaninglessLongCalcTimeLogic();

  mystatusStore.setStatus("completed");
};
</script>