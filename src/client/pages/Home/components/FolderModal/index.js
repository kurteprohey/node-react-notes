import React from 'react';
import {Button, Modal, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {TYPE_FOLDER} from 'Constants/misc';

export default class FolderModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // define initial state shape
    let state = this.state = {
      name: '',
      type: TYPE_FOLDER
    };
    if (props.selectedItem) {
      state = Object.assign({}, state, {
        name: props.selectedItem.name,
        _id: props.selectedItem._id
      });
    }
    this.state = state;
  }
  validateForm() {
    return this.state.name.length > 0;
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSubmit() {
    this.props.onSave(this.state);
  }
  render() {
    const {onSave, onCancel} = this.props;
    return(
      <Modal show={true} onHide={onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Create your folder here</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name" bsSize="large">
            <ControlLabel>Folder Name</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </FormGroup>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="success" disabled={!this.validateForm()} onClick={this.handleSubmit}>Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}