<script setup>
import { addableComTypes } from "../ComClass/config.js";
import { canvasSizeOptions } from "../ComClass/canvasConfig.js";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";

const emit = defineEmits(["addItem","backgroundSizeChange"])

const { proxy } = getCurrentInstance();
// 默认选中7.5寸@EPA黑白红色
const defaultCanvas = canvasSizeOptions.find(i => i.value == 66)
const deviceListSelect = params => request.get(`/backend/getDeviceListByLabel`, { params })
const deviceOptions = ref([])
const canvasForm = ref({
  size: defaultCanvas,
  width: defaultCanvas.width,
  height: defaultCanvas.height,
  color: defaultCanvas.color
})

const data = reactive({
  formData:{
    templateName:'',
    templateStatus:1,
    deviceTypeId:'',
  },
  rules:{
    templateName:[{required:true, message:"请输入模版名称"}],
    deviceTypeId:[{required:true, message:"请选择设备类型"}],
    templateStatus:[{required:true, message:"请选择模板状态"}],

  }
})
const {formData, rules} = toRefs(data)

function typeSizeChange(e) {
  const { width, height, color, value } = canvasSizeOptions.find(i => i.value == e)
  canvasForm.value = {
    size: value,
    width,
    height,
    color
  }
  emit("backgroundSizeChange", canvasForm.value)
}
typeSizeChange(defaultCanvas.value)
function colorChange(e) {
  canvasForm.value.color = e
  emit("backgroundSizeChange", canvasForm.value)
}

// 添加物体
function addItem(param) {
  emit("addItem", param)
}
function getSubmit(func){
    proxy.$refs.InfoFormRef.validate(func)
}
function getData(){
  return formData.value
}
function loadData(data){
  formData.value = {
    templateName:data.templateName,
    templateStatus:Number(data.templateStatus),
    deviceTypeId:data.deviceTypeId,
  }
}
defineExpose({
  getSubmit,
  getData,
  loadData
})

</script>

<template>
  <el-scrollbar class="left-scrollbar">
    <div class="components-list">

      <div class="form-item">
        <div class="components-title">
          模版信息
        </div>
        <el-form ref="InfoFormRef" label-width="80px" :model="formData" :rules="rules">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="formData.templateName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="设备类型" prop="deviceTypeId">
            <el-select placeholder="请选择" v-model="formData.deviceTypeId" >
              <el-option v-for="(item, index) in deviceOptions" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="templateStatus">
            <el-radio-group v-model="formData.templateStatus">
              <el-radio :label="1" :value="1">启动</el-radio>
              <el-radio :label="2" :value="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-item">
        <div class="components-title">
          组件类型
        </div>
        <div class="com-type-box">
          <div v-for="item in addableComTypes" :key="item.name" class="type-item" @click="addItem(item)">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="form-item">
        <div class="components-title">
          屏幕参数
        </div>
        <el-form label-width="50px" :model="canvasForm">
          <el-form-item label="类型">
            <el-select disabled placeholder="请选择类型" v-model="canvasForm.size" @change="typeSizeChange">
              <el-option v-for="(item, index) in canvasSizeOptions" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="宽度">
            <el-input disabled v-model="canvasForm.width"><template #append>px</template></el-input>
          </el-form-item>
          <el-form-item label="高度">
            <el-input disabled v-model="canvasForm.height"><template #append>px</template></el-input>
          </el-form-item>
          <el-form-item  label="颜色">
            <el-color-picker disabled v-model="canvasForm.color" @change="colorChange"></el-color-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped lang="scss">
.left-scrollbar {
  overflow: hidden;
  height: 100%;

  .components-list {
    padding: 8px;
    box-sizing: border-box;
    height: 100%;

    .components-item {
      display: inline-block;
      width: 48%;
      margin: 1%;
      transition: transform 0ms !important;
    }

    .components-title {
      display: flex;
      font-size: 14px;
      color: #222;
      margin: 6px 2px 10px;
      padding-left:10px;

      .svg-icon {
        color: #666;
        font-size: 18px;
        margin-right: 5px;
      }
    }
  }
}

.form-item{
  padding:10px 10px;
  border-top:2px solid #e8eaec;
  &:last-child{
    margin-bottom: 0px;
    padding-bottom:0px;
  }
  &:first-child{
    padding-top:0;
    border-top:0px solid #000;
  }
}
.com-type-box {
  display: flex;
  flex-wrap: wrap;

  .type-item {
    cursor: pointer;
    user-select: none;

    &:nth-child(2n) {
      margin-left: 5px;
    }

    &:hover {
      color: #787be8;
      border: 1px #787be8 dashed;
      background: #f4f5fd;
    }

    border:1px rgba(255, 255, 255, 0) dashed;
    margin-bottom: 5px;
    font-size: 12px;
    color:#333333;
    box-sizing: border-box;
    height:35px;
    width:calc(50% - 2.5px);
    background-color: #f4f5fd;
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left:10px;

    .item-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
