<template>
  <div>
    <h4 class="text-h4">Расписание на {{ dayOfWeek }}</h4>
    <h5 class="text-h5">{{ isWeekEven ? "Четная" : "Нечетная" }} неделя</h5>
    <VCard class="mt-4">
      <ScheduleView :dow="curDay - 1" :weekType="isWeekEven"/>
    </VCard>
  </div>
</template>

<script>
  import schedConfig from "@/sched_config.json"
  import { isWeekEven } from '@/utils/date.js'
  import ScheduleView from '@/components/Schedule.vue'

  const dayNames = ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"]
  const initialDate = new Date()
  let curDate = null

  export default {
    data() {
      return {
        curDay: null,
        curTS: null,
      }
    },
    components: { ScheduleView },
    computed: {
      dayOfWeek() {
        return dayNames[this.curDay]
      },
      isWeekEven() {
        return isWeekEven(schedConfig.studyStartTS * 1000, this.curTS)
      },
    },
    methods: {
      updateDate() {
        curDate = new Date(initialDate)
        curDate.setDate(curDate.getDate() + parseInt(this.$route.params.offset))
        this.curDay = curDate.getDay()
        this.curTS = curDate.getTime()
      }
    },
    watch: {
      '$route.params'() {
        this.updateDate()
      }
    },
    created() {
      this.updateDate()
    }
  }
</script>
