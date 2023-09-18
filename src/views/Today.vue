<template>
  <div>
    <h4 class="text-h4 pt-2">Расписание на {{ dayOfWeek }}</h4>
    <h5 class="text-h5">{{ isWeekEven ? "Четная" : "Нечетная" }} неделя</h5>
    <VCard class="mt-4">
      <ScheduleView :weekType="isWeekEven"/>
    </VCard>
  </div>
</template>

<script>
  import groupData from "@/config.json"
  import { isWeekEven } from '@/utils/date.js'
  import ScheduleView from '@/components/Schedule.vue'

  const dayNames = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
  const curDate = new Date()

  export default {
    components: { ScheduleView },
    computed: {
      dayOfWeek() {
        return dayNames[curDate.getDay()]
      },
      isWeekEven() {
        return isWeekEven(groupData.studyStartTS * 1000, curDate.getTime())
      },
    }
  }
</script>
