import React from 'react'
import Line from '../../layouts/Line'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub,faLinkedin } from '@fortawesome/free-brands-svg-icons'
import './Footer.css'

const Footer = () => {
    return (
        <div className='Footer'>
            <Line justify="between">
                <img className="footer-image" src="https://i.gifer.com/ZAbi.gif" alt="dasd"></img>
                <h2>Follow Us :</h2>
                <div className='follow'>
                    <h3  className="name">Yakov</h3>
                    <Line justify='between'>
                        <a href='https://github.com/yakov10105' target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon className='icon' icon={faGithub} size='2x' />
                        </a>
                        <a href='https://www.linkedin.com/in/yakov-kantor-47bb981bb/' target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon className='icon' icon={faLinkedin}  size='2x' />
                        </a>
                    </Line>

                </div>
                <div className='follow'>
                    <h3 className="name">Idan</h3>
                    <Line justify='between'>
                        <a href='https://github.com/IdanBarzI' target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon className='icon' icon={faGithub} size='2x' />
                        </a>
                        <a href='https://www.linkedin.com/in/idanbarz/' target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon className='icon' icon={faLinkedin} size='2x' />
                        </a>
                    </Line>
                </div>
                <img className="footer-image" src="https://i.gifer.com/ZAbi.gif" alt="dasd"></img>
            </Line>
        </div>
    )
}

export default Footer
