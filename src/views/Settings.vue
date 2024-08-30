<template>
  <div>
    <v-card variant="outlined" class="w-sm-66 w-lg-50 ma-sm-auto">
      <v-list>
        <v-list-item lines="two">
          <v-list-item-title>Группа</v-list-item-title>
          <v-list-item-subtitle>Тут можно выбрать свою группу / подгруппу</v-list-item-subtitle>
          <template v-slot:append="">
            <v-list-item-action class="ml-0">
              <v-select
                v-model="selectedGroup"
                :items="groupItems"
                item-title="name"
                item-value="value"
                return-object
                @update:modelValue="saveGroup"
                :menu-props="{ offsetX: true }"
                hide-details
                variant="outlined"
              ></v-select>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>
  
<script>
  import schedConfig from "@/sched_config.json"

  export default {
    data() {
      return {
        selectedGroup: null
      }
    },
    computed: {
      groupItems() {
        let temp = []
        for (let i = 0; i < schedConfig.groups.length; i++) {
          temp.push({name: schedConfig.groups[i].name, value: i})
        }
        return temp
      }
    },
    methods: {
      saveGroup() {
        console.log(this.selectedGroup.value)
        window.localStorage.setItem('selectedGroup', this.selectedGroup.value)
      }
    },
    created() {
      let groupId = window.localStorage.getItem('selectedGroup')
      if (groupId == null) {
        groupId = 0
      }
      this.selectedGroup = this.groupItems[groupId]
    }
  }
</script>