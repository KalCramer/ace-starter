import React, { Component } from 'react'
import Contacts from './components/missions';
import axios from 'axios'


class App extends Component {
    render() {
        return (
            <Contacts contacts={this.state.contacts} />
        )
    }

    state = {
        contacts: []
    };

    componentDidMount() {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + "YWRtaW46YWRtaW4=");
    headers.set('Referer', 'https://localhost:8080/services/');


axios.get('healthstatus/pulse/v1/missions', {
 headers: {
   Authorization: 'Basic ' + "YWRtaW46YWRtaW4=",
   Origin: 'https://localhost:8993/',
   'X-Requested-With': 'XmlHttpRequest'}
})    .then(response => this.setState({contacts: response.data}))


 /*   fetch('https://localhost:8993/services/healthstatus/pulse/v1/missions',
        {method:'GET',
         headers: headers,
        })
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                this.setState({ contacts: data })
            })
            .catch(console.log)*/
    }
}

export default App;