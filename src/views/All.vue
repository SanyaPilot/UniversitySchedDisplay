<template>
  <div class="d-flex justify-space-between align-center pt-4">
    <h4 class="text-h4 mt-n3">Общее расписание</h4>
    <VSelect
      v-model="weekType"
      label="Тип недели"
      :items="weekItems"
      item-title="name"
      item-value="value"
      class="flex-grow-0 mt-2"
      style="width: 10em;"
      variant="outlined"
      density="compact"
    ></VSelect>
  </div>
  <VCard class="mt-4">
    <VTabs v-model="selectedDay" bg-color="primary">
      <VTab value="0">Пн</VTab>
      <VTab value="1">Вт</VTab>
      <VTab value="2">Ср</VTab>
      <VTab value="3">Чт</VTab>
      <VTab value="4">Пт</VTab>
      <VTab value="5">Сб</VTab>
      <VTab value="6">Вс</VTab>
    </VTabs>
    <ScheduleView :dow="intSelectedDay" :weekType="weekType"/>
  </VCard>
</template>

<script>
  import schedConfig from "@/sched_config.json"
  import ScheduleView from '@/components/Schedule.vue'
  import { isWeekEven } from '@/utils/date.js'

  const curDate = new Date()

  export default {
    components: { ScheduleView },
    data() {
      return {
        selectedDay: curDate.getDay() - 1,
        weekType: isWeekEven(schedConfig.studyStartTS * 1000, curDate.getTime()),
        weekItems: [
          { name: "Нечетная", value: false },
          { name: "Четная", value: true }
        ]
      }
    },
    computed: {
      intSelectedDay() {
        return parseInt(this.selectedDay)
      }
    }
  }
</script>