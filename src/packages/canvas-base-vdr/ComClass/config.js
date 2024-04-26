
const defaultImg = "data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzEyOTEwNzk2NDQ1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwOTggMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyNzIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjE0LjQ1MzEyNSIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik0zNjUuNzI4IDMyOS4xNTJxMCA0NS43MjgtMzIgNzcuNzI4dC03Ny43MjggMzItNzcuNzI4LTMyLTMyLTc3LjcyOCAzMi03Ny43MjggNzcuNzI4LTMyIDc3LjcyOCAzMiAzMiA3Ny43Mjh6TTk1MC44NDggNTQ4LjU3NmwwIDI1Ni04MDQuNTc2IDAgMC0xMDkuNzI4IDE4Mi44NDgtMTgyLjg0OCA5MS40MjQgOTEuNDI0IDI5Mi41NzYtMjkyLjU3NnpNMTAwNS43MjggMTQ2LjI3MmwtOTE0LjI3MiAwcS03LjQyNCAwLTEyLjg2NCA1LjQ0dC01LjQ0IDEyLjg2NGwwIDY5NC44NDhxMCA3LjQyNCA1LjQ0IDEyLjg2NHQxMi44NjQgNS40NGw5MTQuMjcyIDBxNy40MjQgMCAxMi44NjQtNS40NHQ1LjQ0LTEyLjg2NGwwLTY5NC44NDhxMC03LjQyNC01LjQ0LTEyLjg2NHQtMTIuODY0LTUuNDR6TTEwOTcuMTUyIDE2NC41NzZsMCA2OTQuODQ4cTAgMzcuNzI4LTI2Ljg0OCA2NC41NzZ0LTY0LjU3NiAyNi44NDhsLTkxNC4yNzIgMHEtMzcuNzI4IDAtNjQuNTc2LTI2Ljg0OHQtMjYuODQ4LTY0LjU3NmwwLTY5NC44NDhxMC0zNy43MjggMjYuODQ4LTY0LjU3NnQ2NC41NzYtMjYuODQ4bDkxNC4yNzIgMHEzNy43MjggMCA2NC41NzYgMjYuODQ4dDI2Ljg0OCA2NC41NzZ6IiBwLWlkPSI0MjczIj48L3BhdGg+PC9zdmc+"


const getTextContentList = params => request.get(`/custom/common/getTextContentList`, params)

export let textContentList = []

let uuid = 0;

export let zIndex = 0

function getUUID(){
    return uuid++
}

function getZIndex(){
    return zIndex++
}

export function getCurrentZ(){
    return zIndex
}
// 组件基类
class BasicComponent{
    constructor(type, name, tagIcon, option={}) {

        // 组件识别
        this.id = getUUID() // id
        this.type = type // 组件标识
        this.name = name // 组件名
        this.tagIcon = tagIcon // 组件icon

        // 组件操作
        this.resizable = option.resizable ||true // 可调整大小
        this.draggable = option.draggable || true // 可拖拽位置
        this.lockAspectRatio = option.lockAspectRatio || false // 锁定横纵比
        this.isText = option.isText || false // 是否是文本内容

        // 渲染/后端传值
        this.propName = option.propName || undefined // 字段名

        this.x = option.x || 0 // x坐标
        this.y = option.y || 0 // y坐标
        this.width = option.width || 0 // 宽度
        this.height = option.height || 0 // 高度
        this.zIndex = option.zIndex || getZIndex() // 图层顺序
        this.style = option.style || {}
    }
    getSizeStyle(){
        this.style.width = `${this.width}px`
        this.style.height = `${this.height}px`
        this.style.zIndex = this.zIndex
        return this.style
    }
    // 获取样式数据
    getStyle(){
        return this.style
    }
    // 获取向后端传的数据
    getUnityData(){
        return {
            originTemp:JSON.stringify(this),
            ...this.style,
            x:this.x,
            y:this.y,
            width:this.width,
            height:this.height,
            type:this.type,
            label:this.name,
        }
    }
    getApiData(){
        return {
            ...this.getUnityData(),
        }
    }
}

// 字体类型
class FontCom extends  BasicComponent{
    constructor(type,name,tagIcon ,option={}) {
        super(type,name,tagIcon,option);
        this.width = option.width || 100 // 宽度
        this.height = option.height || 45 // 高度
        this.isText = option.isText || true // 判断是否是文本信息
        this.multiRow = option.multiRow || false // 单行/多行
        this.isBold = option.isBold || false // 加粗
        this.isItalic = option.isItalic || false // 斜体
        this.style = option.style || {
            size : 22, // 字体大小
            textAlign : "center", // 水平布局
            justifyContent:"center", // 垂直布局
            color : "#000000", //  字体颜色
            fontFamily : "微软雅黑", //  字体
            textDecoration : "none", //  下划线
        }
    }
    getStyle(){
        this.getSizeStyle()
        this.style.fontSize = `${this.style.size}px`
        this.style.fontWeight = this.isBold?'bold':'normal'
        this.style.fontStyle = this.isItalic?'italic':'normal'
        this.style.whiteSpace = this.multiRow?'wrap':'nowrap'
        return this.style
    }
}

// 文本类
class TextCom extends FontCom{
    constructor(option={}) {
        super('text','文本','input',option);
        this.dictLabel = option.dictLabel || textContentList[0].dictLabel  // 文本字典key
        this.dictValue = option.dictValue || textContentList[0].dictValue  // 文本字典value

        this.style.textAlign = option.style?.textAlign || 'center'
    }
    getApiData(){
        return {
            ...this.getUnityData(),
            dictLabel:this.dictLabel,
            dictValue:this.dictValue,
        }
    }
}

// 标识类
class TagCom extends FontCom{
    constructor(option={}) {
        super('tag','标识','input',option);
        this.textContent = option.textContent || '标识'  // 文本内容
        this.style.textAlign = option.style?.textAlign || 'left'
    }
    getApiData(){
        return {
            ...this.getUnityData(),
            content:this.textContent
        }
    }
}

// 二维码
class QrCodeCom extends BasicComponent{
    constructor(option={}) {
        super('qrcode','二维码','input',option);
        this.width = option.width || 100 // 宽度
        this.height = option.height || 100 // 高度
    }
}

// 条形码
class BarCodeCom extends BasicComponent{
    constructor(option={}) {
        super('barcode','条形码','input',option);
        this.width = option.width || 100 // 宽度
        this.height = option.height || 60 // 高度
    }
}

// 矩形框
class RectangleCom extends BasicComponent{
    constructor(option={}) {
        super('rectangle','矩形框','input', option);
        this.width = option.width || 100 // 宽度
        this.height = option.height || 60 // 高度
        this.style = option.style || {
            borderStyle:'solid',
            background : "#FFFFFF", // 背景颜色
            borderRadius_num : 0, // 圆角
            borderWidth_num : 3, // 边框粗细
            borderColor : "#FF7D00", // 边框颜色
        }
    }
    getStyle(){
        this.getSizeStyle()
        this.style.borderRadius = `${this.style.borderRadius_num}px`
        this.style.borderWidth = `${this.style.borderWidth_num}px`
        return this.style
    }
}


// 图片类
class ImageCom extends BasicComponent{
    constructor(option={}) {
        super('image','图片','input', option);
        this.width = option.width || 100 // 宽度
        this.height = option.height || 100 // 高度
        // 图片背景
        this.imgSrc = option.imgSrc || defaultImg
    }
    getApiData(){
        return {
            ...this.getUnityData(),
            imgSrc:this.imgSrc
        }
    }
}

export const typeMap = {
    'text':TextCom,
    'tag':TagCom,
    'qrcode':QrCodeCom,
    'barcode':BarCodeCom,
    'rectangle':RectangleCom,
    'image':ImageCom,
}

export const addableComTypes = [
    {
        name:'文本',
        tagIcon: 'input',
        class:TextCom
    },
    {
        name:'标识',
        tagIcon: 'input',
        class:TagCom
    },
    {
        name:'二维码',
        tagIcon: 'input',
        class:QrCodeCom
    },
    {
        name:'条形码',
        tagIcon: 'input',
        class:BarCodeCom
    },
    {
        name:'矩形框',
        tagIcon: 'input',
        class:RectangleCom
    },
    {
        name:'图片',
        tagIcon: 'input',
        class:ImageCom
    },
]
