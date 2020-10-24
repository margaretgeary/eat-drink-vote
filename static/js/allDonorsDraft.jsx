function Industry({ catcode, catname }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [donors, setDonors] = React.useState({}); //donors is being set to: industry: organizations: orgname
    React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetch(`/api/industries/${catcode}`).
            then((response) => response.json()).
            then((industry) => {
                console.log("Got industry response", industry);
                setDonors(industry.industry);
            })
    }, [isOpen, catcode]) // dependency list (if these change, the function gets called)
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-controls={`collapse-${catcode}`}
                    aria-expanded={isOpen}
                >
                    {catname}
                </ReactBootstrap.Button>
            </ReactBootstrap.Card.Header>
            {donors.organizations &&
                <ReactBootstrap.Collapse in={isOpen}>
                    <ReactBootstrap.Card.Body>
                        {donors.organizations.map(organization => {
                            return (
                                <Donor key={organization.donor_id} donor_id={organization.donor_id} org_name={organization.org_name}>urrrr</Donor>
                            )
                        })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function Donor({ donor_id, org_name }) {
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
                <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} onClick={() => { setIsOpen(true) }} variant="link" eventKey={donor_id}>
                    {org_name}
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={donor_id}>
                    <ReactBootstrap.Card.Body>
                        <h3>{org_name} donated {candidates.totals.d_perc}% to Democrats and {candidates.totals.r_perc}% to Republicans.</h3>
                        {candidates.candidates.map(candidate => {
                            return (
                                <React.Fragment key={candidate.firstlast}>
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
//search bar-show nothing on screen until they search for something that matches
//then you find corresponding thing and show that
//is there a match? if there is a match figure out how to display one that is matching
//use regular expression
//one search bar with radio feature where user selects what they're searching for
function AllIndustries() {
    const [industries, setIndustries] = React.useState([]);
    React.useEffect(() => {
        fetch('/api/industries').
            then((response) => response.json()).
            then((industries) => setIndustries(industries.industries));
    }, [])
    if (industries.length === 0) return <div>Loading...</div>
    const content = []
    for (const industry of industries) {
        content.push(<Industry key={industry.catcode} catcode={industry.catcode} catname={industry.catname} />);
    }
    return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>

}

ReactDOM.render(<AllIndustries />, document.getElementById('root'))


//have list of possibilities
//as user types, you check if there's a match