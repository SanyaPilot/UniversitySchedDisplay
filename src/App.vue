<template>
  <VApp>
    <VAppBar color="primary">
      <template v-slot:prepend>
        <VAppBarNavIcon @click.stop="drawer.opened = !drawer.opened"></VAppBarNavIcon>
      </template>
      
      <VScrollXReverseTransition>
        <VAppBarTitle v-show="titleShown">{{ headers[$route.path] }}</VAppBarTitle>
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
          @click.stop="changeMainView(item)"
          :prepend-icon="item.icon"
          :title="item.text"
          :value="item.path"
        />
      </VList>
    </VNavigationDrawer>

    <VMain>
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
  export default {
    data() {
      return {
        title: null,
        titleShown: false,
        mainViewShown: false,
        drawer: {
          opened: false,
          selectedItem: null,
          prevSelectedItem: null,
          items: [
            { text: "Сегодня", icon: 'mdi-calendar-today', path: '/day/0', view: 'day', params: { offset: 0 } },
            { text: "Завтра", icon: 'mdi-calendar-today', path: '/day/1', view: 'day', params: { offset: 1 } },
            { text: "Все дни", icon: 'mdi-calendar-multiple', path: '/all', view: 'all' },
            { text: "Настройки", icon: 'mdi-cog', path: '/settings', view: 'settings' }
          ]
        },
        headers: {
          "/day/0": "Расписание на сегодня",
          "/day/1": "Расписание на завтра",
          "/all": "Расписание на все дни",
          "/settings": "Настройки"
        }
      }
    },
    methods: {
      changeMainView(item) {
        if (this.drawer.prevSelectedItem == item.path) return

        this.titleShown = false
        this.mainViewShown = false

        setTimeout(function() {
          this.mainViewShown = true
          this.$router.push({ name: item.view, params: item.params})
          this.drawer.prevSelectedItem = item.id
        }.bind(this), 400)

        setTimeout(function() {
          this.titleShown = true
          this.title = this.drawer.items.find((item) => item.view == item.view).text
        }.bind(this), 400)
      }
    },
    watch: {
      '$route.path'(value) {
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
