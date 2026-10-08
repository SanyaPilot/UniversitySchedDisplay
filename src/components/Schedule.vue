<template>
  <VTable v-if="lessons.length > 0" class="pt-1 px-2 text-body-1">
    <thead>
      <tr>
        <th class="px-1 text-center">#</th>
        <th class="px-1 text-center">Тип</th>
        <th class="px-1">
          <span>Пара</span><br>
          <span v-if="onMobile" class="text-caption">Преподаватель</span>
        </th>
        <th v-if="!onMobile" class="px-1 text-center">Преподаватель</th>
        <th class="px-0 text-center">Каб.</th>
        <th class="px-1 text-center">Время</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="lesson in lessons">
        <td class="px-1 py-2 text-center">{{ lesson.window ? "" : lesson.pos }}</td>
        <td class="px-1 py-2 text-center">
          <VChip v-if="lesson.window == false" :color="lesson.practical ? 'blue' : 'green'">{{ lesson.practical ? "ПЗ" : "ЛК" }}</VChip>
          <VChip v-else>ОК</VChip>
        </td>
        <td class="px-1 py-2">
          <span>{{ lesson.window ? "" : lesson.name }}</span><br>
          <span v-if="onMobile" class="text-caption">{{ lesson.window ? "" : lesson.teacher}}</span>
        </td>
        <td v-if="!onMobile" class="px-1 py-2 text-center">{{ lesson.window ? "" : lesson.teacher}}</td>
        <td class="px-0 py-2 text-center">{{ lesson.window ? "" : lesson.room}}</td>
        <td class="px-1 py-2 text-center">{{ lessonTimes[lesson.pos - 1] }}</td>
      </tr>
    </tbody>
  </VTable>
  <h5 v-else class="d-flex justify-center text-h5 py-4">🥳 Нет занятий!</h5>
</template>

<script>
  import schedConfig from "@/sched_config.json"
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
    data() {
      return {
        selectedGroup: window.localStorage.getItem('selectedGroup'),
        selectedAdditionalGroup: window.localStorage.getItem('selectedAdditionalGroup')
      }
    },
    computed: {
      lessonTimes() {
        let times = []
        let curTime = schedConfig.startTime
        for (const brTime of schedConfig.breaks) {
          let startTime = timestampToString(curTime)
          curTime += schedConfig.lessonLength
          let stopTime = timestampToString(curTime)
          times.push(startTime + " - " + stopTime)
          curTime += brTime
        }
        // And for the last lesson
        let startTime = timestampToString(curTime)
        curTime += schedConfig.lessonLength
        let stopTime = timestampToString(curTime)
        times.push(startTime + " - " + stopTime)

        return times
      },
      lessons() {
        const groupId = this.selectedGroup != undefined ? this.selectedGroup : 0
        const addGroupId = this.selectedAdditionalGroup != undefined ? this.selectedAdditionalGroup : 0
        const group = schedConfig.groups[groupId]
        const addGroup = schedConfig.additionalGroups[addGroupId]
        if (group == undefined || addGroup == undefined) return []
        const dow = this.dow != undefined ? this.dow : (curDate.getDay() - 1)

        let day = group.weeks[this.weekType ? 'even' : 'odd'][dow]
        let addDay = addGroup.weeks[this.weekType ? 'even' : 'odd'][dow]
        if (day === undefined || addDay === undefined) return []

        day = day != null ? day : []
        addDay = addDay != null ? addDay : []
        const lessonCount = Math.max(day.length, addDay.length)
        const mergedDay = []
        for (let i = 0; i < lessonCount; i++) {
          mergedDay.push(day[i] != null ? day[i] :
                         addDay[i] != null ? addDay[i] : null)
        }

        // Deep copy
        let temp = JSON.parse(JSON.stringify(mergedDay))

        let pos = 1
        // Remove prepending nulls
        while (temp[0] === null) {
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
    },
    activated() {
      // Fetch currently selected group again (to display right schedule if it was changed)
      this.selectedGroup = window.localStorage.getItem('selectedGroup')
    },
  }
</script>
