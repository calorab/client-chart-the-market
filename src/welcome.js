import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Aux from '../../hoc/Aux/Aux'
// import { setInterval } from 'timers'

class Welcome extends Component {

    handleSlideDisplay() {
        // Here's the outline of my idea
        // slides.map(element => {
        //     let slide = [...html with element data]
        //     setInterval(() => {return slide}), 3000)
        // })
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
                    <h2> Chart the market uses the BarChart API to bring you not only dinamic, custom charts for global markets 
                            but many other investment tools and recommendations. </h2>
                    <Link to='/chartmain' >Try it out!</Link>
                </section>
            </Aux>
        )
    }
}

export default Welcome;