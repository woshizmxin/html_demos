import Mine from './components/mine'
import App from './components/app'

export default [{
    path: '/mine',
    component: Mine
},{
    path: '/index',
    component: App
},{
    path: '/',
    redirect: '/index'
},{
    path: '*',
    redirect: '/index'
}]