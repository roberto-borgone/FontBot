export type WeatherData = {
    daily: {
        precipitation_sum: number[]
        precipitation_probability_max: number[],
        temperature_2m_max: number[],
        temperature_2m_min: number[]
    }
}