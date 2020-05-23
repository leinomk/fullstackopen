import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/persons'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState({})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const deleteContact = (person) => {
    if (window.confirm(`Delete ${person.name}?`)){
      personService
        .remove(person.id)
        .then(() => {
          const personRemoved = persons
                                  .filter(contact => 
                                    contact.id !== person.id)
          setPersons(personRemoved)
          const message = {
            text: `Removed ${person.name}`,
            type: "notificationMessage"
          }
          console.log(message)
          setMessage(message)
          setTimeout(() => {
            setMessage({})
          }, 5000)
      })
    }
  }

  const changeNumber = (contact) => {
    const message = `${contact.name} is already added to the phonebook, replace the old number with a new one?`

    if (window.confirm(message)){
      const changedContact = {...contact, number: newNumber.trim()}

      personService
        .update(contact.id, changedContact)
        .then(returnedContact => {
          setPersons(persons.map(person => person.id !== contact.id
                                                     ? person
                                                     : returnedContact))
          const message = {
            text: `Number for ${contact.name} was changed`,
            type: "notificationMessage"
          }
          setMessage(message)
          setTimeout(() => {
            setMessage({})
          }, 5000)
        })
        .catch(error => {
          const message = {
            text: `Information of ${contact.name} has already been removed from server`,
            type: "errorMessage"
          }
          setMessage(message)
          setTimeout(() => {
            setMessage({})
          }, 5000)
          setPersons(persons.filter(p => p.id !== contact.id))
        })
      setNewName('')
      setNewNumber('')
    }
  }

  const addName = (event) => {
    event.preventDefault()
    const name = newName.trim()
    
    if ( name === "") {
      setNewName('')
    }
    else if (persons.findIndex(person => person.name === name) > -1) {
      changeNumber(persons.find(person => person.name === name))
    }
    else {
      const personObject = {
        name,
        number: newNumber.trim()
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          const message = {
            text: `Added ${personObject.name}`,
            type: "notificationMessage"
          }
          setMessage(message)
          setTimeout(() => {
            setMessage({})
          }, 5000)
        })
    } 
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = (filter.trim() === "")
    ? persons
    : persons.filter(person => person.name
                               .toLowerCase()
                               .indexOf(filter
                               .trim()
                               .toLowerCase()) !== -1)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} /> 
      <h2>Add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <div>
        {personsToShow.map((person, i) => 
          <Person 
            key={i}
            person={person}
            deletePerson={() => deleteContact(person)}
          />
        )}
      </div>
    </div>
  )

}

export default App
