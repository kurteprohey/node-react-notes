import React from 'react';
import {loginUser} from 'Actions/account';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
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
    dispatch(loginUser(email, password)).then((user) => {
      console.log('login successful');
      this.props.history.push('/');
    });
  }
  render() {
    return (
      <div className="Login">
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
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
          <br/>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
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
)(LoginContainer);
