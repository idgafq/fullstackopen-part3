const Filter = ({ name, filter, setFilter }) => {
    return (
        <div>
            filter shown with
            <input
                name={name}
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
            />
        </div>
    )
}

export default Filter