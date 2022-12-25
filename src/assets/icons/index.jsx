import settingIcon from './NUT-E.png';
import volumnIcon from './NUT-C2.png';
import muteIcon from './NUT-C1.png';
import rocketIcon from './NUT-B2.png';
import menuIcon from './NUT-A.png';
import speedIcon from './NUT-D1.png';
import workIcon from './NUT-D2.png';
import controllerLeft from './one.png';
import controllerRight from './two.png';
import inputBg from '../images/background-input.png';

export const SettingIcon = ({ ...rest }) => <div id='icon' >
    <img src={settingIcon} alt={settingIcon} {...rest} />
</div>

export const VolumnIcon = ({ ...rest }) => <div id='icon' >
    <img src={volumnIcon} alt={volumnIcon} {...rest} />
</div>

export const RocketIcon = ({ ...rest }) => <div id='icon' >
    <img src={rocketIcon} alt={rocketIcon} {...rest} />
</div>

export const MenuIcon = ({ ...rest }) => <div id='icon' >
    <img src={menuIcon} alt={menuIcon} {...rest} />
</div>

export const ControllerLeft = ({ ...rest }) => {
    const handleUp = () => {
        console.log('up')
    }
    const handleDown = () => {
        console.log('down');
    }
    return (
        <div id='controller' >
            <img src={controllerLeft} alt={controllerLeft} {...rest} useMap="#controller" />
            <map name="controller">
                <area shape="circle" coords="209,144,120" title="Circle" onClick={handleUp} />
                <area shape="circle" coords="213,400,106" title="Circle" onClick={handleDown} />             {/* <area shape="circle" style={{ cursor: "pointer" }} coords="60,50,100" alt="Computer" onClick={handleControllerUp} /> */}
            </map>
        </div>)
}


export const ControllerRight = ({ ...rest }) => {
    return (< div id='controller' >
        <img src={controllerRight} alt={controllerRight} {...rest} />
    </div >)

}

export {
    settingIcon,
    volumnIcon,
    muteIcon,
    speedIcon,
    workIcon,
    inputBg
}