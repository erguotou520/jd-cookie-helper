/* @refresh reload */
import { render } from 'solid-js/web'
import 'virtual:windi.css'
import JDLoginPage from './pages/jd'

render(() => <JDLoginPage />, document.getElementById('root') as HTMLElement)
