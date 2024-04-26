<template>
  <div class="auto-right">
    <div class="tab-header">组件属性</div>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <el-form label-width="120px">
          <el-form-item label="字段名">
            <el-input style="width:200px" placeholder="请输入字段名" disabled v-model="props.typeInfo.name" />
          </el-form-item>
        </el-form>

        <div class="split">
          <div class="label">坐标属性</div>
          <div class="split-line"></div>
        </div>

        <!-- 固定属性 -->
        <el-form label-width="110px">
          <div style="margin-left: 60px; margin-bottom: 15px;">
            <el-checkbox-button v-model="props.typeInfo.resizable" title="可调整大小">可缩放</el-checkbox-button>
            <el-checkbox-button v-model="props.typeInfo.draggable" title="可拖拽">可拖拽</el-checkbox-button>
            <el-checkbox-button v-model="props.typeInfo.lockAspectRatio" title="锁定比例">锁定比例</el-checkbox-button>
          </div>
          <el-form-item label="X坐标">
            <el-input-number :min="0" placeholder="" v-model="props.typeInfo.x" style="width:185px" />
          </el-form-item>
          <el-form-item label="Y坐标">
            <el-input-number :min="0" placeholder="" v-model="props.typeInfo.y" style="width:185px" />
          </el-form-item>
          <el-form-item label="宽度">
            <el-input-number :min="0" placeholder="" v-model="props.typeInfo.width" style="width:185px" />
          </el-form-item>
          <el-form-item label="高度">
            <el-input-number :min="0" placeholder="" v-model="props.typeInfo.height" style="width:185px" />
          </el-form-item>
          <el-form-item label="图层">
            <el-input-number :min="0" v-model="props.typeInfo.zIndex" class="layer-input" style="width:85px"
              controls-position="right"></el-input-number>
            <el-button-group>
              <el-button style="width:50px;" class="right-button"
                @click="props.typeInfo.zIndex = getCurrentZ()">置顶</el-button>
              <el-button style="width:50px;" title="置顶" @click="props.typeInfo.zIndex = 0">置底</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>

        <div class="split" v-if="['tag'].includes(props.typeInfo.type)">
          <div class="label">输入内容</div>
          <div class="split-line"></div>
        </div>

        <el-form label-width="110px" v-if="['tag'].includes(props.typeInfo.type)">
          <el-form-item label="内容">
            <el-input v-model="props.typeInfo.textContent" type="textarea" style="width:200px"></el-input>
          </el-form-item>
        </el-form>

        <div class="split" v-if="['text'].includes(props.typeInfo.type)">
          <div class="label">文本属性</div>
          <div class="split-line"></div>
        </div>

        <el-form label-width="110px" v-if="['text'].includes(props.typeInfo.type)">
          <el-form-item label="文本类别">
            <el-select v-model="props.typeInfo.dictValue" style="width:200px"  @change="textDictChange">
              <el-option v-for="option in textContentList" :value="option.dictValue" :label="option.dictLabel"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="split" v-if="!['qrcode', 'barcode'].includes(props.typeInfo.type)">
          <div class="label" v-show="['text', 'tag'].includes(props.typeInfo.type)">字体属性</div>
          <div class="label" v-show="['rectangle'].includes(props.typeInfo.type)">矩形框属性</div>
          <div class="label" v-show="['image'].includes(props.typeInfo.type)">图片属性</div>
          <div class="split-line"></div>
        </div>

        <!--        字体属性-->
        <el-form size="small" label-width="110px" v-if="['text', 'tag'].includes(props.typeInfo.type)">
          <el-form label-width="120px">
            <el-form-item label="颜色">
              <el-color-picker v-model="props.typeInfo.style.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="字体大小">
              <el-input-number v-model="props.typeInfo.style.size" :min="1" placeholder="" />
            </el-form-item>
            <el-form-item label="字体">
              <el-select v-model="props.typeInfo.style.fontFamily">
                <el-option v-for="item in fontConfig" :value="item.value" :label="item.label"
                  :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="辅助线">
              <el-select v-model="props.typeInfo.style.textDecoration">
                <el-option v-for="item in styleConfig" :value="item.value" :label="item.label"
                  :key="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="水平对齐">
              <el-radio-group v-model="props.typeInfo.style.textAlign">
                <el-radio-button v-for="option in alignConfig" :key="option.value" :label="option.label"
                  :value="option.value">
                  {{ option.text }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="垂直对齐">
              <el-radio-group v-model="props.typeInfo.style.justifyContent">
                <el-radio-button v-for="option in verticalAlignConfig" :label="option.label" :value="option.value"
                  :key="option.value">
                  {{ option.text }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分行">
              <el-radio-group v-model="props.typeInfo.multiRow">
                <el-radio-button :label="false" :value="false">单行</el-radio-button>
                <el-radio-button :label="true" :value="true">多行</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="样式">
              <el-checkbox-button v-model="props.typeInfo.isBold">
                <span style="font-weight: bold">加粗</span>
              </el-checkbox-button>
              <el-checkbox-button v-model="props.typeInfo.isItalic">
                <span style="font-weight: normal;font-style: italic">斜体</span>
              </el-checkbox-button>
            </el-form-item>
          </el-form>
        </el-form>

        <!--        矩形属性-->
        <el-form size="small" label-width="90px" v-if="['rectangle'].includes(props.typeInfo.type)">
          <el-form label-width="120px">
            <el-form-item label="填充颜色">
              <el-color-picker v-model="props.typeInfo.style.background"></el-color-picker>
            </el-form-item>
            <el-form-item label="边框宽度">
              <el-input-number v-model="props.typeInfo.style.borderWidth_num" :min="0" placeholder="" />
            </el-form-item>
            <el-form-item label="边框颜色">
              <el-color-picker v-model="props.typeInfo.style.borderColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="边框圆角">
              <el-input-number v-model="props.typeInfo.style.borderRadius_num" :min="0" placeholder="" />
            </el-form-item>
          </el-form>
        </el-form>

        <!--        图片属性-->
        <el-form size="small" label-width="90px" v-if="['image'].includes(props.typeInfo.type)">
          <el-form label-width="120px">
            <el-form-item label="选取图片">
              <el-upload :limit="1"
                         :show-file-list="false"
                         :http-request="uploadHttpRequest"
                          :before-upload="handleBeforeUpload">
                <el-button type="primary" icon='upload'>选取图片</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-form>

      </el-scrollbar>
    </div>

  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import {
  alignConfig,
  fontConfig,
  styleConfig,
  verticalAlignConfig,
} from "../ComClass/comConfig.js";
import {getCurrentZ, textContentList} from "../ComClass/config.js";
import {ElMessage} from "element-plus";

const emit = defineEmits(['textDictChange'])

const props = defineProps({
  typeInfo: {
    type: Object,
    required: true
  }
})

function uploadHttpRequest(data) {
  let reader = new FileReader()
  reader.readAsDataURL(data.file)
  reader.onload = () => {
    const response = {
      status: true,
      data: reader.result
    }
    props.typeInfo.imgSrc = response.data
  }
}

function textDictChange(params){
  const label = textContentList.find(i=>i.dictValue == params).dictLabel
  emit('textDictChange',label)
}

// 图片上传
function handleBeforeUpload(file) {
  let isImg = false;
  let fileType = ['jpg', 'png', 'jpeg']
  let fileExtension = "";
  if (file.name.lastIndexOf(".") > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
  }
  isImg = fileType.some(type => {
    if (file.type.indexOf(type) > -1) return true;
    if (fileExtension && fileExtension.indexOf(type) > -1) return true;
    return false;
  });
  if (!isImg) {
    ElMessage.error(
      `文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
    );
    return false;
  }
}

</script>

<style lang="scss">
.auto-right {
  width: 100%;
  height: 100%;

  .tab-header {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #f1e8e8;
    color: #303133;
  }

  .field-box {
    box-sizing: border-box;
    height: calc(100% - 40px);

    .right-scrollbar {
      height: calc(100% - 40px);
    }
  }
}

.split {
  position: relative;
  height: 30px;
  line-height: 30px;
  margin-top: 5px;
  margin-bottom: 15px;

  .label {
    position: relative;
    margin: 0 15px;
    padding: 0px 20px;
    font-weight: 500;
    color: #303133;
    font-size: 14px;
    z-index: 2;
    background: #fff;
    display: inline-block;
  }

  .split-line {
    position: absolute;
    background: #e8eaec;
    height: 2px;
    width: 100%;
    top: calc(50% - 1px);
  }
}

.right-button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.layer-input {
  .el-input__wrapper {
    box-shadow: inset 0px 1px 0px #e6e8eb, inset 0px -1px 0px #e6e8eb, inset 1px 0px 0px #e6e8eb, inset -1px 0px 0px #f3f5f8;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;

    &.is-focus {
      box-shadow: inset 0px 1px 0px #398ee5, inset 0px -1px 0px #398ee5, inset -1px 0px 0px #398ee5, inset 1px 0px 0px #398ee5;
    }
  }
}
</style>
