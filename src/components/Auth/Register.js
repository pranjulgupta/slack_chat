import React from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import md5 from 'md5';
class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        UsersRef: firebase.database().ref('users')

    }
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })


    }

    isFormValid = () => {
        let errors = [];
        let error;
        if (this.isFormEmpty(this.state)) {
            error = { message: 'All fields are required' }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else if (!this.isPasswordValid(this.state)) {
            error = { message: 'Invalid Password or Password and ConfirmPassword Does not Match' }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else
            return true;
    }
    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;

    }
    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || passwordConfirmation.length < 6)
            return false;
        else if (password !== passwordConfirmation)
            return false;
        else
            return true
    }
    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);
    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(createUser => {
                console.log(createUser);
                createUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
                }).then(() => {
                    this.setState({ loading: false })
                    this.saveUser(createUser).then(() => {

                        console.log('user saved');
                        this.setState({ username: '', email: '', password: '', passwordConfirmation: '' })
                    })

                })
                    .catch(err => {
                        console.log(err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false })

                    })

            }).catch(err => {
                console.log(err);
                this.setState({ errors: this.state.errors.concat(err), loading: false })

            })
        }

    }
    saveUser = createUser => {

        return this.state.UsersRef.child(createUser.user.uid).set({
            name: createUser.user.displayName,
            avatar: createUser.user.photoURL

        })

    }
    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="blue" textAlign="center">
                        <Icon name="slack" color="yellow" />
                        Register For Slack
                   </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" value={username}
                                placeholder="Username" onChange={this.handleChange} type="text" />
                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                placeholder="Email Address" onChange={this.handleChange} type="email" />
                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                placeholder="Password" onChange={this.handleChange} type="password" />
                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" value={passwordConfirmation}
                                placeholder="Password Confirmation" onChange={this.handleChange} type="password" />
                            <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (<Message error>
                        <h3>Error</h3>{this.displayErrors(errors)}
                    </Message>)}
                    <Message>Already a user?<Link to="/login"> Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}
export default Register;