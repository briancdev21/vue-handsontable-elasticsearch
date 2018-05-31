import { Fields } from './config'

export const TableItemsConfig = [
  // 'Id' Field: immutable
  {
    columnName: 'Id',
    data: 'id',
    type: 'text',
    readOnly: true,
    colWidth: 0
  },
  // 'No' Field: immutable
  {
    columnName: 'No',
    data: 'no',
    readOnly: true,
    type: 'text',
    colWidth: 80
  },
  // Name Field: mutable
  {
    columnName: 'Name',
    data: Fields.name,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Alt Names Field: mutable
  {
    columnName: 'Alt Names',
    data: Fields.alt_names,
    type: 'text',
    editor: 'text',
    colWidth: 400
  },
  // Latitude Field: mutable
  {
    columnName: 'Latitude',
    data: Fields.latitude,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Longitude Field: mutable
  {
    columnName: 'Longitude',
    data: Fields.longitude,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Country Code Field: mutable
  {
    columnName: 'Country',
    data: Fields.country_code,
    type: 'dropdown',
    editor: 'select',
    selectOptions: ['ac', 'ad', 'af', 'au', 'ben'],
    colWidth: 150
  },
  // Population Field: mutable
  {
    columnName: 'Population',
    data: Fields.population,
    type: 'text',
    editor: 'text',
    colWidth: 150
  }
]

const colHeaders = []
let colWidths = []
TableItemsConfig.forEach(item => {
  colHeaders.push(item.columnName)
  colWidths.push(item.colWidth)
})
colWidths = colWidths.slice(1)

export const HandsontableSettings = {
  colHeaders: colHeaders,
  columns: TableItemsConfig,
  colWidths: colWidths,
  autoColumnSize: {
    samplingRatio: 23
  },
  maxRows: 1000,
  rowHeaders: true,
  columnSorting: true,
  manualColumnResize: false
}
