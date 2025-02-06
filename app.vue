<template>
  <div style="display: flex; flex-direction: column; gap: 1rem; width: 50rem; margin: 0 auto;">
    <h1>My Status: {{ mystatusStore.status }}</h1>
    <button @click="mystatusStore.setStatus('default')">Set Status to default</button>

    <button @click="handleClickMeaningLessLongCalcTimeLogic">meaninglessLongCalcTimeLogic</button>

    <button @click="handleClickMeaningLessLongCalcTimeLogicWithSetTimeoutZero">meaninglessLongCalcTimeLogic with await
      new
      Promise((resolve) => setTimeout(resolve, 0))</button>

    <button @click="handleClickMeaningLessLongCalcTimeButAsyncLogic">meaninglessLongCalcTimeButAsyncLogic</button>
  </div>
</template>

<script lang="ts" setup>
import { useMystatusStore } from '~/stores/mystatus';

const mystatusStore = useMystatusStore();

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

const handleClickMeaningLessLongCalcTimeLogicWithSetTimeoutZero = async () => {
  mystatusStore.setStatus("started");

  // display "started" when thie line called
  await new Promise((resolve) => setTimeout(resolve, 0));

  meaninglessLongCalcTimeLogic();

  mystatusStore.setStatus("completed");
};

const handleClickMeaningLessLongCalcTimeButAsyncLogic = async () => {
  mystatusStore.setStatus("started");

  // never display "started"...
  await await new Promise((resolve) => {
    meaninglessLongCalcTimeLogic();
    resolve(null);
  });

  mystatusStore.setStatus("completed");
};

</script>