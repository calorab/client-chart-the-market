import React, {Component} from 'react'
import Aux from '../../hoc/Aux/Aux'
import { setInterval } from 'timers'

class Welcome extends Component {

    handleSlideDisplay() {
        // Here's the outline of my idea
        // slides.map(element => {
        //     let slide = [...html with element data]
        //     setInterval(() => {return slide}), 3000)
        // })
    }
    
    handleCarousel() {

    }

    render() {
        return (
            <Aux>
                {/* 
                    I want 2 parts here:
                        top: something interesting (graphic, video, explainer, counuter, etc)
                        bottom: eventually signup/login, at first features
                */}
                <section className='welcomeVideo' >
                    {/* display video/gif/media */}
                </section>
                <section>
                    <h3>Features</h3>
                    <ul>
                        <li>feature 1</li>
                        <li>feature 2</li>
                        <li>feature 3</li>
                        <li>feature 4</li>
                        <li>feature 5</li>
                    </ul>
                </section>
            </Aux>
        )
    }
}

export default Welcome;