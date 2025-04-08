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
  "Duck",
  "Cayd",
  "Doxa",
  "Hudson",
  "Tyler",
  "Konky",
  "Xanax",
  "Cloudy",
  "Luci",
  "WillHuh",
  "Will (Gay)",
  "Gabe",
  "Willow",
  "Sham",
  "G-blower",
]

export const fetchValorantMaps = async () => {
  try {
    const response = await axios.get('https://valorant-api.com/v1/maps')
    return response.data.data as Map[]
  } catch (error) {
    console.error('Error fetching maps:', error)
  }

}
