<template>
  <div class="auto-form-view">
    <div class="left-content">
      <div class="action-bar">
        <el-button link type="primary" class="copy-btn-main" icon="DocumentCopy" @click="handleCopy">复制</el-button>
        <el-button link type="primary" class="copy-btn-main" icon="Remove" @click="handleDelete">删除</el-button>
        <el-button link class="delete-btn" icon="Delete" @click="handleClear">清空</el-button>
      </div>
      <div class="auto-form-left">
        <LeftForm ref="leftFormRef" @add-item="addItem" @backgroundSizeChange="backgroundSizeChange"/>
      </div>
      <div class="auto-form-context">
        <el-scrollbar class="center-scrollbar" :noresize="true">
          <div class="canvas-wrapper">
            <TempCanvas
                :com-list="comList"
                :backgroundSizeStyle="backgroundSizeStyle"
                @onActivated="onActivated"
                @onDrag="onDrag"
                @onResize="onResize" />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="auto-form-right">
      <RightForm :type-info="typeInfo" @text-dict-change="textDictChange" />
    </div>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";
import RightForm from "./Com/RightForm.vue"
import LeftForm from "./Com/LeftForm.vue";
import TempCanvas from "./Com/TempCanvas.vue";
import {typeMap} from "./ComClass/config.js";
import {ElMessage, ElMessageBox} from "element-plus";

const { proxy } = getCurrentInstance();

const comList = ref([]) // 组件列表
const typeInfo = ref({
  style:{}
}) // 组件类型
const backgroundSizeStyle = ref({}) // 组件背景大小

function textDictChange(params){
  typeInfo.value.dictLabel = params
}

/**添加组件 */
function addItem(param) {
  comList.value.push(new param.class)
  console.log(comList.value)
}

/**激活组件 */
function onActivated(param) {
  typeInfo.value = param
}

/**拖动组件 */
function onDrag(row) {
  typeInfo.value = Object.assign(typeInfo.value, row)
}

/**调整组件大小 */
function onResize(row) {
  typeInfo.value = Object.assign(typeInfo.value, row)
}

/**更改背景大小 */
function backgroundSizeChange(row) {
  backgroundSizeStyle.value = {
    width: row.width + "px",
    height: row.height + 'px',
    background: row.color
  }
}

/**删除组件 */
function handleDelete() {
  if(!comList.value.length) return proxy.$modal.msgWarning('请先选中模版！')
  comList.value = comList.value.filter(item => item.id !== typeInfo.value.id)
}

/**复制组件 */
function handleCopy(){
  const clone = JSON.parse(JSON.stringify(typeInfo.value))
  comList.value.push(new typeMap[clone.type](clone))
}

/**清空组件 */
function handleClear() {
  if(!comList.value.length) return ElMessage.warning("请先添加模版！")
  ElMessageBox.confirm('确定要清空所有组件吗？').then(() => {
    setTimeout(() => {
      comList.value = []
    }, 1000)
  }).catch(() => { });
}

</script>

<style lang="scss">
$geo-basic-footer-height: 1px;


$selectedColor: #f6f7ff;
$lighterBlue: #409EFF;

.auto-form-view {
  height: calc(100% - $geo-basic-footer-height);
  display: flex;
  position: relative;
  width: 100%;
  background-color: white;

  .left-content {
    width: calc(100% - 350px);

    .action-bar {
      position: relative;
      height: 45px;
      padding: 0 15px;
      box-sizing: border-box;
    ;
      border: 1px solid #f1e8e8;
      display: flex;
      justify-content: right;
      align-items: center;

      .delete-btn {
        color: #F56C6C;
      }
    }
  }

  .auto-form-left,
  .auto-form-right {
    flex: 1;
    position: absolute;
    border: 1px solid #eee;
    height: 100%;
  }

  .auto-form-left {
    width: 300px;
    left: 0;
    top: 45px;
    height: calc(100% - 45px);
  }

  .auto-form-right {
    width: 350px;
    right: 0;
    top: 0;

    .right-scrollbar {
      .el-scrollbar__view {
        padding: 12px 18px 15px 15px;
      }
    }

  }

  .auto-form-context {
    background-image: url(./assets/tempGenerat.jpg);
    width: calc(100% - 300px);
    height: calc(100vh - 84px - 45px);
    box-sizing: border-box;
    margin: 0 350px 0 300px;


    .center-scrollbar {
      height: calc(100% - 45px);
    }

    .el-scrollbar__view {
      height: 100%;
    }

    .drawing-item {
      position: relative;
      cursor: move;

      &.unfocus-bordered:not(.activeFromItem)>div:first-child {
        border: 1px dashed #ccc;
      }

      .el-form-item {
        padding: 12px 10px;
      }
    }

    .drawing-row-item {
      position: relative;
      cursor: move;
      box-sizing: border-box;
      border: 1px dashed #ccc;
      border-radius: 3px;
      padding: 0 2px;
      margin-bottom: 15px;

      .drawing-row-item {
        margin-bottom: 2px;
      }

      .el-col {
        margin-top: 22px;
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .drag-wrapper {
        width: 100%;
        min-height: 80px;
      }

      &.active-from-item {
        border: 1px dashed $lighterBlue;
      }

      .component-name {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 12px;
        color: #bbb;
        display: inline-block;
        padding: 0 6px;
      }
    }

    .drawing-item,
    .drawing-row-item {
      &:hover {
        .el-form-item {
          background: $selectedColor;
          border-radius: 6px;
        }

        .drawing-item-copy,
        .drawing-item-delete {
          display: initial;
        }
      }

      .drawing-item-copy,
      .drawing-item-delete {
        display: none;
        position: absolute;
        top: -10px;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 50%;
        font-size: 12px;
        border: 1px solid;
        cursor: pointer;
        z-index: 1;
      }

      .drawing-item-copy {
        right: 56px;
        border-color: $lighterBlue;
        color: $lighterBlue;
        background: #fff;

        &:hover {
          background: $lighterBlue;
          color: #fff;
        }
      }

      .drawing-item-delete {
        right: 24px;
        border-color: #F56C6C;
        color: #F56C6C;
        background: #fff;

        &:hover {
          background: #F56C6C;
          color: #fff;
        }
      }
    }
  }
}

.center-scrollbar {
  display: flex;
  justify-content: center;
}

.canvas-wrapper {
  position: relative;
  margin-top: 100px;
}
</style>
