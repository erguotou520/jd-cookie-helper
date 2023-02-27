/* @refresh reload */
import { render } from 'solid-js/web'
import 'virtual:windi.css'
import AccountManage from './pages/account'

render(() => <AccountManage />, document.getElementById('root') as HTMLElement)
