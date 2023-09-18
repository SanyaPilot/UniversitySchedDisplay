<template>
  <VApp>
    <VAppBar color="primary">
      <template v-slot:prepend>
        <VAppBarNavIcon @click.stop="drawer.opened = !drawer.opened"></VAppBarNavIcon>
      </template>
      
      <VScrollXReverseTransition>
        <VAppBarTitle v-show="titleShown">{{ headers[$route.name] }}</VAppBarTitle>
      </VScrollXReverseTransition>
    </VAppBar>

    <VNavigationDrawer
      v-model="drawer.opened"
      temporary
    >
      <VList
        color="primary"
        density="compact"
        nav
        mandatory
        v-model:selected="drawer.selectedItem"
      >
        <VListItem
          v-for="(item, i) in drawer.items"
          :key="i"
          @click.stop="changeMainView(item.view)"
          :prepend-icon="item.icon"
          :title="item.text"
          :value="item.view"
        />
      </VList>
    </VNavigationDrawer>

    <VMain class="px-4">
      <RouterView v-slot="{ Component }">
        <VScrollXReverseTransition>
          <VContainer fluid v-show="mainViewShown">
            <KeepAlive>
              <component :is="Component"/>
            </KeepAlive>
          </VContainer>
        </VScrollXReverseTransition>
      </RouterView>
    </VMain>
  </VApp>
</template>

<script>
  import groupData from "@/config.json"

  export default {
    data() {
      return {
        groupName: groupData.groupName,
        title: null,
        titleShown: false,
        mainViewShown: false,
        drawer: {
          opened: false,
          selectedItem: null,
          prevSelectedItem: null,
          items: [
            { text: "Сегодня", icon: 'mdi-calendar-today', view: 'today' },
            { text: "Все дни", icon: 'mdi-calendar-multiple', view: 'all' }
          ]
        },
        headers: {
          today: "Расписание на сегодня",
          all: "Расписание на все дни"
        }
      }
    },
    methods: {
      changeMainView(view) {
        if (this.drawer.prevSelectedItem == view) return

        this.titleShown = false
        this.mainViewShown = false

        setTimeout(function() {
          this.mainViewShown = true
          this.$router.push(view)
          this.drawer.prevSelectedItem = view
        }.bind(this), 400)

        setTimeout(function() {
          this.titleShown = true
          this.title = this.drawer.items.find((item) => item.view == view).text
        }.bind(this), 400)
      }
    },
    watch: {
      '$route.name'(value) {
        this.drawer.selectedItem = [value]
        if (this.drawer.prevSelectedItem == null) this.drawer.prevSelectedItem = this.drawer.selectedItem
      }
    },
    mounted() {
      this.titleShown = true
      this.mainViewShown = true
    }
  }
</script>
