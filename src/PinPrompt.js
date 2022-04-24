import React, {useEffect, useState} from 'react';
import { Modal, Button } from '@geist-ui/core' 

function PinPrompt(props){

    return (<>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>This is a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Some content contained within the modal.</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>Cancel</Modal.Action>
        <Modal.Action>Submit</Modal.Action>
        </>
    )

}

export default PinPrompt