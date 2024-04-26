<script setup>

import { ref } from 'vue'

const typeArr = ref(['text', 'tag', 'qrcode', 'barcode', 'rectangle', 'image'])

const props = defineProps(["comList", "backgroundSizeStyle"])
const emit = defineEmits(["addItem","onDrag","onActivated"])

const v_line = ref([])
const h_line = ref([])

/** 计算辅助线 */
function getRefLineParams(params){
  const {vLine, hLine} = params;
  v_line.value = vLine
  h_line.value = hLine
}

/** 点击组件类型事件 */
function onActivated(param) {
  emit("onActivated", param)
}
/** 拖动位置事件 */
function onDrag(x, y) {
  emit("onDrag", { x: Math.floor(x), y: Math.floor(y) })
}
/** 调整大小事件 */
function onResize(x, y, width, height) {
  emit("onResize", { x: Math.floor(x), y: Math.floor(y), width: Math.floor(width), height: Math.floor(height) })
}

</script>

<template>
  <div class="blank-canvas" :style="backgroundSizeStyle">
    <VueDragResizeRotate
      v-for="com in comList" :key="com.name" :x="com.x" :y="com.y" :w="com.width" :h="com.height" :snap="true" :z="com.zIndex"
      :draggable="com.draggable" :resizable="com.resizable" :lock-aspect-ratio="com.lockAspectRatio"
      :parent="true" @activated="onActivated(com)" @dragging="onDrag" @resizing="onResize"
      @refLineParams="getRefLineParams"
      class-name="vdr-com" class-name-active="vdr-com-active" class-name-handle="vdr-com-handle"
    >
      <div class="drag-inner"
           v-if="typeArr.includes(com.type)"
           :style="com.getStyle()"
      >
        <span v-if="['text'].includes(com.type)">{{ com.dictLabel }}</span>
        <span v-if="['tag'].includes(com.type)">{{ com.textContent }}</span>
        <img v-if="com.type=='qrcode'" src="../assets/defaultQrCode.png" alt="" style="width:100%;height:100%">
        <img v-if="com.type=='barcode'" src="../assets/defaultBarCode.png" alt="" style="width:100%;height:100%">
        <img v-if="com.type == 'image'" :src="com.imgSrc" alt="" style="width:100%;height:100%">
      </div>
    </VueDragResizeRotate>
    <span
      class="ref-line v-line"
      v-for="(item,index) in v_line"
      :key="'v_'+index"
      v-show="item.display"
      :style="{
        left:item.position,
        top:item.origin,
        height:item.lineLength
      }"
    ></span>
    <span
        class="ref-line h-line"
        v-for="(item, index) in h_line"
        :key="'h_' + index"
        :style="{
          top: item.position,
          left: item.origin,
          width: item.lineLength
        }"
    />
  </div>
</template>

<style scoped lang="scss">
.blank-canvas {
  width: 640px;
  height: 384px;
  background: white;
  position: relative;
  box-sizing: border-box;
}

.drag-inner {
  cursor: move;
  user-select: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

::v-deep .vdr-com{
  //border:none;
  border: 1px dashed #d0d0d0;
  position:absolute;
}

::v-deep .vdr-com-active{
  border: 1px dashed #000000;
}

::v-deep .vdr-com-handle{
  display: block;
  position:absolute;
  background: #3f9dfd;
  height:5px !important;
  width:5px !important;
}

::v-deep .ref-line {
  position: absolute;
  background-color: rgb(219, 89, 110);
  z-index: 9999;
}
::v-deep .v-line {
  width: 1px;
}
::v-deep .h-line {
  height: 1px;
}
</style>
