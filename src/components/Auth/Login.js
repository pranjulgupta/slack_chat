import React from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })

    }
    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);
    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true });
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedUser => {
                    console.log(signedUser);
                    this.setState({ loading: false })

                }).catch(err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });

                });

        }
        this.setState({ email: '', password: '' })
    }
    isFormValid = ({ email, password }) => email && password

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="blue" textAlign="center">
                        <Icon name="slack" color="yellow" />
                        Login To Slack
                   </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                placeholder="Email Address" onChange={this.handleChange} type="email" />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                placeholder="Password" onChange={this.handleChange} type="password" />
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (<Message error>
                        <h3>Error</h3>{this.displayErrors(errors)}
                    </Message>)}
                    <Message>don't have an account?<Link to="/register"> Register</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}
export default Login;