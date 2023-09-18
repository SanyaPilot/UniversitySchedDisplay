<template>
  <VTable v-if="lessons != null" class="pt-1 px-2">
    <thead>
      <tr>
        <th class="px-2">#</th>
        <th class="px-2">Тип</th>
        <th class="px-2">
          <span>Пара</span><br>
          <span v-if="onMobile" class="text-caption">Преподаватель</span>
        </th>
        <th v-if="!onMobile" class="px-2">Преподаватель</th>
        <th class="px-2">Кабинет</th>
        <th class="px-2">Время</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="lesson in lessons">
        <td class="px-2 py-2">{{ lesson.window ? "" : lesson.pos }}</td>
        <td class="px-2 py-2">
          <VChip v-if="lesson.window == false" :color="lesson.practical ? 'blue' : 'green'">{{ lesson.practical ? "ПЗ" : "ЛК" }}</VChip>
          <VChip v-else>Окно</VChip>
        </td>
        <td class="px-2 py-2">
          <span>{{ lesson.window ? "" : lesson.name }}</span><br>
          <span v-if="onMobile" class="text-caption">{{ lesson.window ? "" : lesson.teacher}}</span>
        </td>
        <td v-if="!onMobile" class="px-2 py-2">{{ lesson.window ? "" : lesson.teacher}}</td>
        <td class="px-2 py-2">{{ lesson.window ? "" : lesson.room}}</td>
        <td class="px-2 py-2">{{ lessonTimes[lesson.pos - 1] }}</td>
      </tr>
    </tbody>
  </VTable>
  <h5 v-else class="d-flex justify-center text-h5 py-4">🥳 Нет занятий!</h5>
</template>

<script>
  import groupData from "@/config.json"
  import { timestampToString, isWeekEven } from '@/utils/date.js'

  const curDate = new Date()

  export default {
    name: "ScheduleView",
    props: {
      dow: {
        type: Number,
      },
      weekType: {
        type: Boolean,
        required: true
      }
    },
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
      lessons() {
        let dow = this.dow == undefined ? (curDate.getDay() - 1) : this.dow
        const day = groupData.weeks[this.weekType ? 'even' : 'odd'][dow]
        if (day == undefined) return null

        // Deep copy
        let temp = JSON.parse(JSON.stringify(day))

        let pos = 1
        // Remove prepending nulls
        while (temp[0] == null) {
          temp.shift()
          pos++
        }
        // Append real position to lessons and replace nulls
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] == null) {
            temp[i] = { window: true, pos: pos }
          } else {
            temp[i].window = false
            temp[i].pos = pos
          }
          pos++
        }
        return temp
      },
      onMobile() {
        return this.$vuetify.display.xs
      }
    }
  }
</script>