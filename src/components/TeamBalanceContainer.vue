<script setup lang="ts">
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'
import { ref, computed, onBeforeMount } from 'vue'
import {
  fetchValorantMaps,
  Players,
  type PlayerStats,
  type Map,
  Games
} from '@/components/common/team-balancer.ts'

const currentPlayers = ref<PlayerStats[]>([])
const currentRating = ref<number | undefined>()
const currentPlayerName = ref<string>('')
const finalTeamA = ref<PlayerStats[]>([])
const finalTeamB = ref<PlayerStats[]>([])
const maps = ref<Map[]>()
const selectedGame = ref<Games | undefined>(undefined)
const randomizedMapSelect = ref<Map | null>()

const addPlayer = () => {
  if (currentPlayerName.value === '' || !currentRating.value ||
    (currentRating.value && currentRating.value < 1)) return
  currentPlayers.value.push({
    name: currentPlayerName.value,
    rating: currentRating.value ?? 0
  })
  currentRating.value = undefined
  currentPlayerName.value = ''
}

const removePlayer = (name: string) => {
  currentPlayers.value = currentPlayers.value.filter((item) => {
    return item.name !== name
  })
}

const balanceTeams = (players: PlayerStats[]): [PlayerStats[], PlayerStats[]] => {
  if (players.length % 2 !== 0) {
    throw new Error("The number of players must be even.");
  }
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
  const teamA: PlayerStats[] = [];
  const teamB: PlayerStats[] = [];
  let teamATotalRating = 0;
  let teamBTotalRating = 0;
  sortedPlayers.forEach(player => {
    if (teamATotalRating <= teamBTotalRating) {
      teamA.push(player);
      teamATotalRating += player.rating;
    } else {
      teamB.push(player);
      teamBTotalRating += player.rating;
    }
  });
  return [ teamA, teamB ];
}

const submitTeamBalancing = () => {
  const [teamA, teamB] = balanceTeams(currentPlayers.value)
  finalTeamA.value = teamA
  finalTeamB.value = teamB
}

const teamATotal = computed(() => {
  return finalTeamA.value.reduce((acc, player) => acc + player.rating, 0)
})

const teamBTotal = computed(() => {
  return finalTeamB.value.reduce((acc, player) => acc + player.rating, 0)
})

const randomMap = (): Map | null => {
  if (!maps.value) return null
  const filteredMaps = maps.value.filter((map) => map.inRotation)
  if (filteredMaps.length === 0) return null
  const randomIndex = Math.floor(Math.random() * filteredMaps.length)
  return filteredMaps[randomIndex]
}

const chooseMap = () => {
  randomizedMapSelect.value = randomMap()
}

const clearChosenMap = () => {
  randomizedMapSelect.value = null
}

onBeforeMount(async () => {
  maps.value = await fetchValorantMaps()
})
</script>

<template>
  <div class="team-balancer-container">
    <div class="team-balancer-container__grid">
      <div class="team-balancer-container__add-player">
        <h4>Add Player <i class="pi pi-user red"/></h4>
        <div class="team-balancer-container__add-player-row">
          <Select v-model="currentPlayerName"
                    :options="Players.sort((a, b) => a > b ? 1 : -1)"
                    placeholder="Player name"/>
          <InputNumber v-model="currentRating" placeholder="1 - 99"/>
          <Button @click.stop.prevent="addPlayer" severity="danger">
            <i class="pi pi-plus"/>
          </Button>
        </div>
      </div>
      <div class="team-balancer-container__current-players">
        <h4 class="white">Current Players <i class="pi pi-users red"/></h4>
        <ul v-if="currentPlayers.length > 0">
          <li v-for="(player, index) in currentPlayers" :key="index"
              @click.stop.prevent="() => removePlayer(player.name)" style="cursor: pointer;">
            {{ player.name }} - {{ player.rating }}
          </li>
        </ul>
        <ul v-else>
          <li>None</li>
        </ul>
      </div>
      <div class="team-balancer-container__results">
        <div class="team-balancer-container__results-column">
          <h4 class="white">Team A Total: {{ teamATotal }}</h4>
          <ul>
            <li v-for="(player, index) in finalTeamA" :key="index">
              {{ player.name }} - {{ player.rating }}
            </li>
          </ul>
        </div>
        <div class="team-balancer-container__results-column">
          <h4 class="white">Team B Total: {{ teamBTotal }}</h4>
          <ul>
            <li v-for="(player, index) in finalTeamB" :key="index">
              {{ player.name }} - {{ player.rating }}
            </li>
          </ul>
        </div>
      </div>
      <div class="team-balancer-container__submit-btn">
        <Button severity="danger" @click.stop.prevent="submitTeamBalancing">
          <i class="pi pi-check"/> Submit
        </Button>
      </div>
    </div>
    <div class="team-balancer-container__map-randomizer">
      <h4 class="white">
        Map Randomizer <i class="pi pi-map red"/>
      </h4>
      <p class="white"><i>Check the boxes next to the maps you would like to have in rotation</i></p>
      <div class="team-balancer-container__map-randomizer-buttons">
        <Select placeholder="Select Game" :options="[Games.Valorant]" v-model="selectedGame"/>
        <Button @click.stop.prevent="chooseMap" severity="danger">
          Randomize Map
        </Button>
        <Button @click.stop.prevent="clearChosenMap" severity="danger">
          Reset
        </Button>
      </div>
      <div class="team-balancer-container__map-randomizer-grid" v-if="selectedGame && !randomizedMapSelect">
        <div v-for="(map, index) in maps" :key="index"
             class="team-balancer-container__map-randomizer-grid-item">
          <Checkbox v-model="map.inRotation" binary/>
          <img :src="map.splash" alt="Map" width="200px"/>
        </div>
      </div>
      <div class="team-balancer-container__map-randomizer-selected" v-if="randomizedMapSelect">
        <img :src="randomizedMapSelect.splash" alt="selected map" width="400px"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.team-balancer-container {
  width: 60%;
  background-color: #181818;
  border-radius: 1rem;
  margin: auto;
  min-height: 35vh;
  &__grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
  &__map-randomizer {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 2rem;
    gap: 1rem;
    display: flex;
    flex-direction: column;
    &-buttons {
      display: flex;
      gap: 1rem;
    }
    &-selected {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    &-grid {
      padding-top: 1rem;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }
    }
  }
  &__results {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    &-column {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
  &__add-player {
    padding: 2rem;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-row {
      display: flex;
      gap: 1rem;
    }
  }
  &__current-players {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: start;
    margin-left: auto;
    margin-right: auto;
    padding-top: 1rem;
    text-align: right;
    width: 85%;
  }
  &__submit-btn {
    display: flex;
    margin-top: 2rem;
    height: 4vh;
    padding-right: 1.5rem;
    justify-content: end;
  }
}

ul {
  list-style: none;
  color: #ff5f5f;
}
</style>
