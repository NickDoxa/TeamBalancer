import axios from 'axios'

export interface PlayerStats {
  name: string
  rating: number
}

export interface Map {
  splash: string
  inRotation: boolean
}

export enum Games {
  Valorant = "VALORANT"
}

export const Players = [
  "Cayd",
  "Chopsticks",
  "Cloudy",
  "Doxa",
  "Drew Chili",
  "Duck",
  "G-blower",
  "Gabe",
  "Hudson",
  "Konky",
  "Lil Bippy",
  "Luci",
  "Omx",
  "Sham",
  "Tyler",
  "Will (Gay)",
  "WillHuh",
  "Willow",
  "Wishy",
  "Xanax",
  "Xander",
  "Trigger444",
]

export const fetchValorantMaps = async () => {
  try {
    const response = await axios.get('https://valorant-api.com/v1/maps')
    return response.data.data as Map[]
  } catch (error) {
    console.error('Error fetching maps:', error)
  }

}
