import React from 'react'

const UnAuthorizedPage = () => {
    return (
        <div className='error-page' 
            style={{
                'height': '50vh',
                'width': '100%',
                'background-color': 'aliceblue',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'opacity': '0.6',
            }}>
            <h1>You're not allowed to be here .</h1>
        </div>
    )
}

export default UnAuthorizedPage
