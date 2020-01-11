import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk';
import firebase from 'firebase'
import Icon from 'react-native-vector-icons/Ionicons'



var config = {
    apiKey: '',
    authDomain: 'app5fb.firebaseio.com/',
    databaseURL: 'https://app5fb.firebaseio.com/'
}


const firebaseRef = firebase.initializeApp(config)

console.log(firebaseRef)

export default class FBLogin extends Component {
    constructor(props) {
        super(props);
        this.unsubscriber = null; //listeners
        this.state = {
            isAuthenticated: false,
            typedEmail: '',
            typedPassword: '',
            user: null,
        };
    }
    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
            // console.log(`changed User : ${JSON.stringify(changedUser.toJSON())}`);
            this.setState({ user: changedUser });
        });
    }
    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }
    onAnonymousLogin = () => {
        firebase.auth().signInAnonymously()
            .then(() => {
                console.log(`Login EMAIL successfully`);
                this.setState({
                    isAuthenticated: true,
                });
            })
            .catch((error) => {
                console.log(`Login failed. Error = ${error}`);
            });
    }
    onRegister = () => {
        firebase.auth().createUserWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
            .then((loggedInUser) => {
                this.setState({ user: loggedInUser })
                console.log(`Register with user : ${JSON.stringify(loggedInUser.user.email)}`);
            }).catch((error) => {
                console.log(`Register fail with error: ${error}`);
            });
    }
    onLogin = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.typedEmail, this.state.typedPassword)
            .then((loggedInUser) => {
                console.log(`Login with user : ${JSON.stringify(loggedInUser.user.email)}`);
            }).catch((error) => {
                console.log(`Login fail with error: ${error}`);
            });
    }
    onLoginFacebook = () => {
        LoginManager
            .logInWithReadPermissions(['public_profile'])
            .then((result) => {
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancelled the request'));
                }
                console.log(`Login FB success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                console.log(`Facebook Login with user : ${JSON.stringify(currentUser.user.displayName)}`);
            })
            .catch((error) => {
                console.log(`Facebook login fail with error: ${error}`);
            });
    }
    onGitLogin = () => {
        var provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;

            var user = result.user;
            console.log('USER', user)

        }).catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('ERROR GIT:', errorMessage)

            var email = error.email;

            var credential = error.credential;

        });


    }
    onLoginGoogle = () => alert('Hello')
    // onLoginGoogle = () => {
    //     GoogleSignin
    //     .signIn()
    //     .then((data) => {
    //       // create a new firebase credential with the token
    //       const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);

    //       // login with credential
    //       return firebase.auth().signInWithCredential(credential);
    //     })
    //     .then((currentUser) => {
    //       console.warn(JSON.stringify(currentUser));
    //     })
    //     .catch((error) => {
    //       console.log(`Login fail with error: ${error}`);
    //     });
    // }
    render() {
        return (
            <View>
                <TouchableOpacity
                    containerStyle={{
                        padding: 10,
                        width: 150,
                        margin: 20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(73,104,173)'
                    }}
                    style={{ fontSize: 18, color: 'white' }}
                    onPress={this.onLoginGoogle}
                >
                    <Icon name="logo-google" size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                    containerStyle={{
                        padding: 10,
                        width: 150,
                        margin: 20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(73,104,173)'
                    }}
                    style={{ fontSize: 18, color: 'white' }}
                    onPress={this.onGitLogin}
                >
                    <Icon name="logo-github" size={40} />
                </TouchableOpacity>


                <TouchableOpacity
                    containerStyle={{
                        padding: 10,
                        width: 150,
                        margin: 20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(73,104,173)'
                    }}
                    style={{ fontSize: 18, color: 'white' }}
                    onPress={this.onLoginFacebook}
                >
                    <Icon name="logo-facebook" size={40} color="darkblue" />
                </TouchableOpacity>

                <TouchableOpacity
                    containerStyle={{
                        padding: 10,
                        width: 150,
                        margin: 20,
                        borderRadius: 4,
                        backgroundColor: 'rgb(73,104,173)'
                    }}
                    style={{ fontSize: 18, color: 'white' }}
                    onPress={this.onAnonymousLogin}
                >
                    <Icon name="ios-person" size={40} color="grey" />
                </TouchableOpacity>

                <Text style={{ margin: 20, fontSize: 15, }}>{this.state.isAuthenticated == true ? 'Logged in anonymous' : ''}</Text>
                <Icon name="ios-mail" size={40} color="red" />
                <TextInput style={{
                    height: 40,
                    width: 200,
                    margin: 10,
                    padding: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    color: 'black'
                }}
                    keyboardType='email-address'
                    placeholder='Enter your email'
                    autoCapitalize='none'
                    onChangeText={
                        (text) => {
                            this.setState({ typedEmail: text });
                        }
                    }
                />
                <TextInput
                    style={{
                        height: 40,
                        width: 200,
                        margin: 10,
                        padding: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                        color: 'black'
                    }}
                    keyboardType='default'
                    placeholder='Enter your password'
                    secureTextEntry={true}
                    onChangeText={
                        (text) => {
                            this.setState({ typedPassword: text });
                        }
                    }
                />
                <View style={{ flexDirection: 'row' }}>
                    <Button containerStyle={{
                        padding: 10,
                        borderRadius: 4,
                        margin: 10,
                        backgroundColor: 'green'
                    }}
                        title='Register'
                        style={{ fontSize: 17, color: 'white' }}
                        onPress={this.onRegister}
                    />
                    <Button containerStyle={{
                        padding: 10,
                        margin: 5,
                        borderRadius: 4,
                        backgroundColor: 'blue'
                    }}
                        style={{ fontSize: 17, color: 'white' }}
                        onPress={this.onLogin}
                        title='Log In'
                    />
                </View>




                <Icon name="logo-twitter" size={40} color="blue" />
            </View>


        )
    }
}
