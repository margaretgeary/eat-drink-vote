function Donor({ donor }) {
    const { donor_id, org_name } = donor;
    const [isOpen, setIsOpen] = React.useState(false);
    const [candidates, setCandidates] = React.useState({});
        React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetch(`/api/donors/${donor_id}`).
        then((response) => response.json()).
        then((donor) => {
            console.log("Got donor response", donor);
            setCandidates(donor.donor);
        })
    }, [isOpen, donor_id]) // dependency list (if these change, the function gets called)
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} onClick={() => {setIsOpen(true)}} variant="link" eventKey={donor_id}>
                    {org_name}
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={donor.donor_id}>
                    <ReactBootstrap.Card.Body>
                    <h>{donor.org_name} donated ${candidates.totals.d_perc}% to Democrats and {candidates.totals.r_perc}% to Republicans.</h>
                    {candidates.candidates.map(candidate => {
                        return (
                            <React.Fragment>
                                <div><p>{candidate.firstlast}, {candidate.party}-{candidate.state}</p>
                                    <p>${candidate.total.toLocaleString()}</p></div>
                                <br></br>
                            </React.Fragment>
                        )
                    })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Accordion.Collapse>
            }
        </ReactBootstrap.Card>
    )
}
//loop through candidate list and make list of jsx elements and put list into line 33(like trading cards lab)

function AllDonors() {
    const [donors, setDonors] = React.useState([]);
    React.useEffect(() => {
        fetch('/api/donors').
        then((response) => response.json()).
        then((donors) => setDonors(donors.donors));
    }, [])
    if (donors.length === 0) return <div>Loading...</div>
    const content = []
    for (const donor of donors) {
        content.push(<Donor key={donor.donor_id} donor={donor}/>);
    }
    return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>

}

ReactDOM.render(<AllDonors />, document.getElementById('root'))