<template>
  <div id="root-container" class="wrapper">
    <div class="controller" >
      <md-field>
        <label>Search ...</label>
        <md-input v-model="searchQuery" @input="searchData()" class="searchbox" ></md-input>
      </md-field>
      <v-btn class="save-btn" dark @click="saveData()" >Save</v-btn>
    </div>
    <div id="hot-preview" v-if="!!hotSettings.data" >
      <HotTable ref="hottable" :root="root" :settings="hotSettings" @myAfterPaste="doSomething"></HotTable>
    </div>
    <div class="text-xs-center pagination-bar">
      <v-pagination v-if="!!hotSettings.data" :length="Math.ceil(totalRows/rowsPerPage)" v-model="page" :total-visible="10" @next="nextPage" @previous="prevPage" @input="selectPage" ></v-pagination>
      <div class="pagination-info" >
        <input list="options"  v-model="rowsPerPage" @input="changeRowsPerPage" />
          <datalist id="options" >
            <option value="10" />
            <option value="20" />
            <option value="50" />
            <option value="100" />
            <option value="500" />
            <option value="1000" />
          </datalist>
        &nbsp;/&nbsp;page
        </div>
    </div>
    <div v-if="saving" >Saving.....</div>
  </div>
</template>

<script>
/* eslint-disable */
  import HotTable from './vue-handsontable-official';
  import Vue from 'vue';
  import Vuetify from 'vuetify'
  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import { HomeUrl, Fields } from './config'
  import { HandsontableSettings, TableItemsConfig } from './handsontableSetting'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.min.css'
 
  Vue.use(Vuetify)
  Vue.use(VueAxios, axios)
  Vue.use(VueMaterial)

  export default {
    data: function() {TableItemsConfig
      const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      return {
        searchQuery: undefined,
        rendering: false,
        page: 1,
        countries: [],
        totalRows: 0,
        rowsPerPage: 10,
        saving: false,
        changedElments: [],
        root: 'test-hot',
        ids: [],
        hotSettings: Object.assign(HandsontableSettings, {
          data: undefined,
          width: w * 0.8,
          height: h * 0.7,
          afterChange: function(changes, source){
            this.rootElement.__vue__.$emit('myAfterPaste', changes);
          }
        })
      };
    },
    created() {
      this.getDataFromAPI()
    },
    methods: {
      doSomething: function (changes, source) {
        if (changes)
        changes.forEach( (change, index) => {
          const obj = []
          obj.id = this.$refs.hottable.table.getDataAtCell(change[0], 0)
          obj.prop = change[1]
          obj.value = change[3]
          this.changedElments.push(obj)
        })
      },
      saveData() {
        const data = this.changedElments
        if (data.length === 0) return
        const api = HomeUrl // http://13.211.42.88:9200/web/web
        let responseCount = data.length
        this.saving = true
        const comp = this
        data.forEach( (element, index) => {
          const property = element.prop
          const obj =  {};
          obj[property] = element.value
          axios.post(`${api}/${element.id}/_update`, {
            "doc": obj
          })
          .then(function (response) {
          
            responseCount --
            if (responseCount === 0) {
              comp.saving = false
              comp.changedElments = []
            }

          })
          .catch(function (error) {
            console.log(error);
          });
        });
      },
      searchData() {
        console.log(this.searchQuery)
        this.getDataFromAPI()
      },
      getDataFromAPI() {
        const api = `${HomeUrl}/_search`
        const cmp = this
       
        const search_fields = []
        TableItemsConfig.forEach(item => {
          search_fields.push(item.data)
        })
        let search_query = ''
        if (this.searchQuery) {
          search_query = {
            'multi_match' : {
              'query':      this.searchQuery,
              'type':       'best_fields',
              'fields':     search_fields
            }
          }
        } else {
          search_query = {
            'match_all': {}
          }
        }
        const query = {
          query:  search_query,
          sort: { '_id': { 'order': 'asc'} },
          size: this.rowsPerPage,
          from: (this.page - 1) * this.rowsPerPage
        }
        axios.get(api, {
          params: {
            source: JSON.stringify(query),
            source_content_type: 'application/json'
          }
        })
        .then(response => {
         const obj = response.data.hits.hits
          this.totalRows = response.data.hits.total
          const origin = (this.page-1)*this.rowsPerPage
          const data = []
          obj.forEach((element, index) => {
            let item = {}
            for (let key in Fields) {
              const itemobj =  {};
              itemobj[key] = element._source[key]
              item = Object.assign(item, itemobj)
            }
            data.push(Object.assign(item, {
              id: element._id,
              no: origin+index+1
            }))
          });
          this.hotSettings.data = data;
        })
        .catch(e => {
          this.errors.push(e)
        })
      },
       nextPage() {
         this.getDataFromAPI()
       },
       prevPage() {
         this.getDataFromAPI()
       },
       selectPage() {
          this.getDataFromAPI()
       },
       changeRowsPerPage() {
          if (this.rowsPerPage == '' || this.rowsPerPage == undefined) this.rowsPerPage = 10;
         this.getDataFromAPI()
       }
    },
    name: 'HelloWorld',
    components: {
      HotTable
    }
  }
</script>

<style>

  /* Top Section with Search box and Save button */

  .controller {
    width: 80vw;
    text-align: right;
    margin: auto;
    padding: 20px;
    padding-right: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  /* Search box */
  .controller div.md-field {
    margin-bottom: 10px;
    margin-right:30px;
    border-bottom: solid 1px lightgray;
  }

  /* Save Button */
  .save-btn {
    font-size: 1em;
    padding: 0.2em 1.5em;
    cursor: pointer;
    outline: none;
  }
  .save-btn:hover {
    background-color: aliceblue;
  }
  .save-btn:active {
    color: darkgray;
  }

  /* Handsontable CSS Customization */
  #root-container {
    position: relative;
  }

  #test-hot {
    margin: auto;
    border: solid 0.7px lightgray;
  }
  table tbody tr td:first-of-type {
    display: none;
  }
  table thead tr th:first-of-type {
    border-right: 1px solid #eaeaea !important;
  }
  table thead tr th:nth-of-type(2) {
    display: none;
  }  
  #hot-options {
    width: 200px;
    position: absolute;
    top: 0;
    left: 0;
    padding: 15px;
    font-size: 14px;
  }
  table th, table td {
    min-width: 100px;
    max-width: 300px;
    word-wrap: break-word;
    background: white;
  }
  .handsontableInput {
    max-width: 300px !important;
  }
  .handsontable td {
    padding: 5px !important;
  }
  .handsontable th {
    vertical-align: middle !important;
  }
  .handsontable .columnSorting {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .htSelectEditor {
    background: white;
    border: 1px solid royalblue;
  }

  /* Pagination Component at the bottom */
  .pagination-bar {
    position: relative;
  }
  .pagination__item {
    outline: none;
  }
  .pagination__item--active {
    border: solid 2px orange;
  }

  /* Items/page Component */
  .pagination-info {
    position: absolute;
    top: 5px;
    left: 10vw;
  }
    .pagination-info input {
    width: 60px;
    border: SOLID 1px lightgray;
    border-radius: 5px;
    padding: 5px 0 5px 10px;
    color: #222;
  }

</style>