import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Contacts.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  

  useEffect(() => {
    fetchContacts();
  }, []); 

  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://contact-bfw1.onrender.com/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddContact = async () => {
    try {
      const response = await axios.post('https://contact-bfw1.onrender.com/contacts', {
        name,
        email,
        phone,
      });
      setContacts([...contacts, response.data]);
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await axios.delete(`https://contact-bfw1.onrender.com/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== response.data._id));
    } catch (error) { 
      console.error(error);
    }
  };

  const toggleFavorite = (id) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(id)) {
      updatedFavorites.delete(id);
    } else {
      updatedFavorites.add(id);
    }
    setFavorites(updatedFavorites);
  };

  const isFavorite = (id) => {
    return favorites.has(id);
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;

  const filteredContacts = contacts.filter((contact) => {
    const fullName = contact.name.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query);
  });

  return (
    <div>
      <h2>Contacts</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Contacts"
      />
      <ul>
        {filteredContacts.slice(indexOfFirstContact, indexOfLastContact).map((contact) => (
          <li key={contact._id}>
            <span>
              {isFavorite(contact._id) ? (
                <span
                  className="favorite-star"
                  onClick={() => toggleFavorite(contact._id)}
                >
                  &#9733;
                </span>
              ) : (
                <span
                  className="favorite-star"
                  onClick={() => toggleFavorite(contact._id)}
                >
                  &#9734;
                </span>
              )}
              {contact.name}, {contact.email}, {contact.phone}
            </span>
            <button onClick={() => handleDeleteContact(contact._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredContacts.length / contactsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <h2>Add New Contact</h2>
      <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Name"
  pattern="[A-Za-z ]+"
  title="Please enter only letters and spaces"
/>
<input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
  title="Please enter a valid email address"
/>
<input
  type="tel"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  placeholder="Phone"
  title="Please enter a valid phone number"
/>

      <button onClick={handleAddContact}>Add Contact</button>
    </div>
  );
};

export default Contacts;