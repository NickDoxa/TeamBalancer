<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { ref, computed } from 'vue'

interface PlayerStats {
  name: string
  rating: number
}

const currentPlayers = ref<PlayerStats[]>([])
const currentRating = ref<number | undefined>()
const currentPlayerName = ref<string>('')
const finalTeamA = ref<PlayerStats[]>([])
const finalTeamB = ref<PlayerStats[]>([])

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
</script>

<template>
  <div class="team-balancer-container">
    <div class="team-balancer-container__add-player">
      <h4>Add Player</h4>
      <div class="team-balancer-container__add-player-row">
        <InputText v-model="currentPlayerName" placeholder="Player name"/>
        <InputNumber v-model="currentRating" placeholder="1 - 99"/>
        <Button @click.stop.prevent="addPlayer" severity="danger">
          <i class="pi pi-plus"/>
        </Button>
      </div>
    </div>
    <div class="team-balancer-container__current-players">
      <h4 class="white">Current Players <i class="pi pi-user"/></h4>
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
    <div></div>
    <div class="team-balancer-container__submit-btn">
      <Button severity="danger" @click.stop.prevent="submitTeamBalancing">
        <i class="pi pi-check"/> Submit
      </Button>
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
  </div>
</template>

<style scoped lang="scss">
.team-balancer-container {
  width: 60%;
  background-color: #181818;
  border-radius: 1rem;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  min-height: 30vh;
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
    margin-top: 1rem;
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
