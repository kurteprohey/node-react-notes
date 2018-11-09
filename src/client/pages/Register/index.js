import React from 'react';
import {registerUser} from 'Actions/account';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class RegisterContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordRepeat: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0 && this.state.password == this.state.passwordRepeat;
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const {dispatch} = this.props;
    const {email, password} = this.state;
    dispatch(registerUser(email, password)).then((data) => {
      // this.props.history.push('/');
      location.href = '/';
    });
  }
  render() {
    return (
      <div className="Register">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="passwordRepeat" bsSize="large">
            <ControlLabel>Password repeat</ControlLabel>
            <FormControl
              value={this.state.passwordRepeat}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Register
          </Button>
          <br/>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    
  };
}
export default connect(
  mapStateToProps
)(RegisterContainer);
