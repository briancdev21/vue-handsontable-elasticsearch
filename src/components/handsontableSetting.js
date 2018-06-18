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
    columnName: 'User',
    data: Fields.user,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Alt Names Field: mutable
  {
    columnName: 'Date Created',
    data: Fields.date_created,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Latitude Field: mutable
  {
    columnName: 'Title',
    data: Fields.title,
    type: 'text',
    editor: 'text',
    colWidth: 150
  },
  // Longitude Field: mutable
  {
    columnName: 'Text',
    data: Fields.text,
    type: 'text',
    editor: 'text',
    colWidth: 400
  },
  // Population Field: mutable
  {
    columnName: 'Categories',
    data: Fields.categories,
    type: 'text',
    editor: 'text',
    colWidth: 200
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
