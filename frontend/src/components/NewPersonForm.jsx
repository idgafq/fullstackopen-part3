const NewPersonForm = ({ newName, setNewName, newNumber, setNewNumber, addPerson }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name:
                <input
                    name='name'
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                />
            </div>
            <div>
                number:
                <input
                    name='number'
                    value={newNumber}
                    onChange={(event) => setNewNumber(event.target.value)}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default NewPersonForm