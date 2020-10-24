import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link } from 'react-router'

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
                            <Donor key={organization.donor_id} donor_id={organization.donor_id} org_name={organization.org_name}>urrrr</Donor>
                        )
                    })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function Donor({donor_id, org_name}) {
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
function NavBar() {
    return (
        // <div>hi margaret</div>
        <ReactBootstrap.Navbar bg="dark" variant="dark">
            <ReactBootstrap.Navbar.Brand href="#home">Campaign Finance App</ReactBootstrap.Navbar.Brand>
            <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
            <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                <ReactBootstrap.Nav className="mr-auto">
                    <ReactBootstrap.Nav.Link href="#home">Home</ReactBootstrap.Nav.Link>
                    <ReactBootstrap.Nav.Link href="#about">About</ReactBootstrap.Nav.Link>
                    <ReactBootstrap.NavDropdown title="Browse" id="basic-nav-dropdown">
                        <ReactBootstrap.NavDropdown.Item href="#action/3.1">Industries</ReactBootstrap.NavDropdown.Item>
                        <ReactBootstrap.NavDropdown.Item href="#action/3.2">Companies</ReactBootstrap.NavDropdown.Item>
                        <ReactBootstrap.NavDropdown.Item href="#action/3.3">Candidates</ReactBootstrap.NavDropdown.Item>
                    </ReactBootstrap.NavDropdown>
                </ReactBootstrap.Nav>
                <ReactBootstrap.Form inline>
                    <ReactBootstrap.FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <ReactBootstrap.Button variant="outline-success">Search</ReactBootstrap.Button>
                </ReactBootstrap.Form>
            </ReactBootstrap.Navbar.Collapse>
        </ReactBootstrap.Navbar>
    )

}

function About(){
    return (
        <div>Hello!</div>
    )

}


//     const [industries, setIndustries] = React.useState([]);
//     React.useEffect(() => {
//         fetch('/api/industries').
//         then((response) => response.json()).
//         then((industries) => setIndustries(industries.industries));
//     }, [])
//     if (industries.length === 0) return <div>Loading...</div>
//     const content = []
//     for (const industry of industries) {
//         content.push(<Industry key={industry.catcode} catcode={industry.catcode} catname={industry.catname}/>);
//     }
//     return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>

// }

ReactDOM.render((
    <div>
        <NavBar />
        {/* <BrowserRouter>
            <Route path="#about" component={About}/>
        </BrowserRouter> */}
    </div>
    ), 
    document.getElementById('root'))


//have list of possibilities
//as user types, you check if there's a match
