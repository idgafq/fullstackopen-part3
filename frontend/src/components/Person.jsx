const Person = ({ person, remove }) => {
    return(
      <li>
        {person.name} {person.number}
        <button onClick={remove}>delete</button>
      </li>
    )
}

export default Person