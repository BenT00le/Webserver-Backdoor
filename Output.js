import React, { Component } from 'react';

class Output extends Component
{
    //this will need to be given a UID key
    //for getting the correct data from DB
    render()
    {
        return
        (
            <div>
                {props.out}
            </div>
        );
    }
}

export default Output