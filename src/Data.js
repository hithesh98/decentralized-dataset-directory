import React, {useEffect, useState} from 'react';

function Data(props){
    const id = props.match.params.hash
    console.log(id)
    return (<>
    data page: {id}
    </>)
}

export default Data