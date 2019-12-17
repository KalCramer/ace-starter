import React from 'react'


const Contacts = ({contacts}) => {
    return (
        <div>
            <center><h1>Contact List</h1></center>
                        <div id="map"></div>

            {contacts.map((contact, key) => (
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">{contact.streamId}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{contact.email}</h6>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Contacts
