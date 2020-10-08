function Movie(props) {
    const { movie } = props;
    return (
        <div>
            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>
            <p>{movie.release_date}</p>
            <p><img src={`${movie.poster_path}`} height='100px' width='100px'/></p>
        </div>
    )
}

function AllMovie() {
    const [movies, setMovies] = React.useState([]);
    React.useEffect(() => {
        fetch('/api/movies').
        then((response) => response.json()).
        then((movies) => setMovies(movies.movies));
    }, [])
    if (movies.length === 0) return <div>Loading...</div>
    const content = []
    for (const movie of movies) {
        content.push(<Movie key={movie.id} movie={movie}/>);
    }
    return <div>{content}</div>
}



ReactDOM.render(<AllMovie/>, document.getElementById('root'))