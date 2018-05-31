const ElasticSearchIndex = 'web'
const ElasticSearchMapping = 'web'

export const HomeUrl = `http://13.211.42.88:9200/${ElasticSearchIndex}/${ElasticSearchMapping}`

// A List of Params in an Item from ElasticSearch

export const Fields = {
  name: 'name',
  alt_names: 'alt_names',
  latitude: 'latitude',
  longitude: 'longitude',
  country_code: 'country_code',
  population: 'population'
}
