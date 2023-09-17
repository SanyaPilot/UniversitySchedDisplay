<template>
  <div>
    <h4 class="text-h4 pt-4">Расписание на {{ dayOfWeek }}</h4>
    <h5 class="text-h5">{{ isWeekEven ? "Четная" : "Нечетная" }} неделя</h5>
    <VTable v-if="lessons != undefined" class="pt-1">
      <thead>
        <tr>
          <th>#</th>
          <th>Тип</th>
          <th>Пара</th>
          <th>Преподаватель</th>
          <th>Кабинет</th>
          <th>Время</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lesson, idx) in lessons">
          <td>{{ lesson != null ? (idx + 1) : "" }}</td>
          <td>
            <VChip v-if="lesson != null" :color="lesson.practical ? 'blue' : 'green'">{{ lesson.practical ? "ПЗ" : "ЛК" }}</VChip>
            <VChip v-else>Окно</VChip>
          </td>
          <td>{{ lesson != null ? lesson.name : "" }}</td>
          <td>{{ lesson != null ? lesson.teacher : "" }}</td>
          <td>{{ lesson != null ? lesson.room : "" }}</td>
          <td>{{ lessonTimes[idx] }}</td>
        </tr>
      </tbody>
    </VTable>
    <h5 v-else class="d-flex justify-center text-h5 pt-4">🥳 Сегодня нет занятий!</h5>
  </div>
</template>

<script>
  import groupData from "@/config.json"
  import { timestampToString, isWeekEven } from '@/utils/date.js'

  const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  const curDate = new Date()

  export default {
    computed: {
      lessonTimes() {
        let times = []
        let curTime = groupData.startTime
        for (const brTime of groupData.breaks) {
          let startTime = timestampToString(curTime)
          curTime += groupData.lessonLength
          let stopTime = timestampToString(curTime)
          times.push(startTime + " - " + stopTime)
          curTime += brTime
        }
        // And for the last lesson
        let startTime = timestampToString(curTime)
        curTime += groupData.lessonLength
        let stopTime = timestampToString(curTime)
        times.push(startTime + " - " + stopTime)

        return times
      },
      dayOfWeek() {
        return dayNames[curDate.getDay()]
      },
      isWeekEven() {
        return isWeekEven(groupData.studyStartTS * 1000, curDate.getTime())
      },
      lessons() {
        return groupData.weeks[this.isWeekEven ? 'even' : 'odd'][curDate.getDay() - 1]
      }
    }
  }
</script>
