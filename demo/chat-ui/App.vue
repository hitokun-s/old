
<template>
    <div>
        <div class="dialog-wrapper">
            <i class="icon fa fa-user-circle"></i>
            <span class="dialog shadow dialog-mini">Add comments!</span>
        </div>
        <div class="dialog-wrapper" v-for="mes in messages">
            <i class="icon fa fa-user-circle"></i>
            <div class="dialog shadow dialog-mini"><span v-html="addBR(mes.value)"></span>
                <i class="fa fa-pencil my-button-edit" v-on:click="show(mes)"></i>
                <i class="fa fa-remove my-button-remove" v-on:click="remove(mes)"></i>
            </div>
        </div>
        
        <button class="btn" v-on:click="show">追加</button>
        
        <modal name="example" :width="400" :height="200">
            <div class="container my-container">
                <p>Write a comment</p>
                <textarea class="my-textarea" v-model="mes"></textarea>
                <div class="my-dialog-buttons">
                    <div class="col-xs-6">
                        <button type="button" class="btn" v-on:click="hide(false)">Cancel</button>
                    </div>
                    <div class="col-xs-6">
                        <button type="button" class="btn" v-on:click="hide(true)">Done</button>
                    </div>
                </div>
            </div>
        </modal>

        <v-dialog/>
    </div>
    
</template>

<script>

  import VModal from 'vue-js-modal'
  import _ from "lodash"
    
  export default {
    data: () => {
      return {
        id: 0,
        mes: "",
        messages: [
          {id:1, value:"edit me!"},
          {id:2, value:"edit me!"}
        ]
      }
    },
    computed:{
      lines: function(){
        var text = this.target;
        var lines = text.split(/\r|\r\n|\n/);
        return lines.length;
      }
    },
    methods: {
      show (mes) {
        this.mes = mes.value;
        this.id = mes.id;
        this.$modal.show('example');
      },
      hide (toSave) {
        if(toSave){
          if(this.id){
            _.find(this.messages, d => d.id == this.id).value = this.mes;
          }else{
            const newId = _.maxBy(this.messages, "id").id + 1;
            console.log(newId);
            this.messages.push({
              id: newId,
              value: this.mes
            })
          }
        }
        this.$modal.hide('example');
      },
      beforeClose (event) {
      },
      addBR(text){
        return text.split(/\r|\r\n|\n/).join("<br/>");
      },
      remove(mes){
        console.log("remove target id:" + mes.id);
        const self = this;
        this.$modal.show('dialog', {
          title: 'Really delete this comment?',
//          text: 'You are too awesome',
          buttons: [
            {
              title: 'Cancel',
              default: true
            },
            {
              title: 'Delete',
              handler: () => {
                _.remove(self.messages, { id: mes.id});
                self.$modal.hide('dialog');
                self.$forceUpdate();
              }
            }
          ]
        })
      }
    },
    watch:{

    }
  }

</script>

<style>
    .dialog {
        padding: 15px 15px 15px 15px;
        border-radius: 10px;
        display: block;
        word-break: break-all;
        position: relative;
    }
    .dialog-wrapper{
        padding-left: 50px; /* create space for icon */
        margin-bottom: 20px;
        position: relative;
    }
    .icon{
        position: absolute;
        margin-left: -50px;
        font-size: 37px;
    }
    .shadow{
        box-shadow: 0px 8px 20px 1px #ddd; /* 左右の向きpx 上下の向きpx ぼかしpx 広がりpx 色 内側指定; */
    }
    .dialog-mini{
        width: 50%;
    }
    
    .my-dialog-buttons{
        width:100%;
        position: absolute;
        bottom: 0px;
        left:0px;
        padding-bottom: 8px
    }
    .my-dialog-buttons button{
        width: 100%;
    }
    .my-textarea{
        width:100%;
        height:100%;
    }
    .my-container{
        padding-top: 5px;
        padding-bottom: 90px;
        position: relative;
        width: 100%;
        height: 100%
    }
    .my-button-edit{
        position: absolute;
        top: 0px;
        right:18px;
        cursor: pointer;
    }
    .my-button-remove{
        position: absolute;
        top: 0px;
        right:0px;
        cursor: pointer;
    }
</style>


