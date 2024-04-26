import CanvasBaseVdr from './canvas-base-vdr/index.vue'

const components = [
    {name:'CanvasBaseVdr', component:CanvasBaseVdr}
]

const install = App => {
    components.forEach(({name, component})=>{
        App.component(name, component)
    })
}

export default {install}
