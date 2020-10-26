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
                    onClick={() => setIsOpen(!isOpen) }
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
                            <Donor key={organization.orgname} orgname={organization.orgname}>urrrr</Donor>
                        )
                    })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function Donor({orgname}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [candidates, setCandidates] = React.useState({});
        React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetch(`/api/donors/${orgname}`).
        then((response) => response.json()).
        then((donor) => {
            console.log("Got donor response", donor);
            setCandidates(donor.donor);
        })
    }, [isOpen, orgname]) // dependency list (if these change, the function gets called)   
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} onClick={() => {setIsOpen(true)}} variant="link" eventKey={orgname}>
                    {orgname}
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={orgname}>
                    <ReactBootstrap.Card.Body>
                    <h3>{orgname} donated {candidates.totals.d_perc}% to Democrats and {candidates.totals.r_perc}% to Republicans.</h3>
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
        content.push(<Industry key={industry.catcode} catcode={industry.catcode} catname={industry.catname}/>);
    }
    return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
}

function NavBar() {
    return (
        <div>
            <ReactBootstrap.Navbar bg="dark" variant="dark">
            <ReactBootstrap.Navbar.Brand href="#home">Campaign Finance App</ReactBootstrap.Navbar.Brand>
            <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
            <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                <ReactBootstrap.Nav className="mr-auto">
                    <ReactBootstrap.Nav.Link href="#home">Home</ReactBootstrap.Nav.Link>
                    <ReactRouterDOM.Link to="/industries" className="nav-link" >Industries</ReactRouterDOM.Link> 
                </ReactBootstrap.Nav>
                <ReactBootstrap.Form inline>
                    <ReactBootstrap.FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <ReactBootstrap.Button variant="outline-success">Search</ReactBootstrap.Button>
                </ReactBootstrap.Form>
            </ReactBootstrap.Navbar.Collapse>
        </ReactBootstrap.Navbar> 
        </div>
    )
}

function App() {
    return (
            <ReactRouterDOM.BrowserRouter>
                <NavBar />
                <ReactRouterDOM.Switch>
                    <ReactRouterDOM.Route path="/industries" exact>
                        <AllIndustries />
                    </ReactRouterDOM.Route>
                    {/* <ReactRouterDOM.Route path="/about" exact>
                        <AllDonors />
                    </ReactRouterDOM.Route> */}
                </ReactRouterDOM.Switch>
            </ReactRouterDOM.BrowserRouter>
    );
}


ReactDOM.render(<App />, document.getElementById('root'))


//have list of possibilities
//as user types, you check if there's a match
//React router version 5