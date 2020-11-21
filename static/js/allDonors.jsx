function Donor({ orgname, totalAmount }) {
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
    }, [isOpen, orgname]) 
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} onClick={() => { setIsOpen(true) }} variant="link" eventKey={orgname}>
                    <h5>{orgname}</h5>
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={orgname}>
                    <ReactBootstrap.Card.Body>
                        <br></br><h5>{orgname} gave {candidates.totals.d_perc}% to Democrats and {candidates.totals.r_perc}% to Republicans.</h5><br></br>
                        <div>
                            <ReactBootstrap.Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <td><strong>Amount</strong></td>
                                        <td><strong>Party-State</strong></td>
                                        <td><strong>Candidate</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                {candidates.candidates.map(candidate => 
                                    <tr key={candidate.firstlast}>
                                        <td>${candidate.total.toLocaleString()}</td>
                                        <td>{candidate.party}-{candidate.state}</td>
                                        <td>{candidate.firstlast}</td>
                                    </tr>   
                            
                                )}
                                </tbody>
                            </ReactBootstrap.Table>
                        </div>
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Accordion.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function Industry({ catcode, catname, openCatname, setOpenCatname, searchResult }) {
    const [donors, setDonors] = React.useState({}); 
    const isOpen = catname==openCatname;
    // const isOpen = true;
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
    }, [isOpen, catcode]) 
    const sortedDonation = donors.total_donated ? Object.entries(donors.total_donated)
        .filter(entry => entry[0].toLowerCase().includes(searchResult))
        .sort(([, amount1], [, amount2]) => amount2 - amount1)
        .reduce((r, [orgname, amount]) => ({ ...r, [orgname]: amount }), {}) : {};
    if (sortedDonation.length >= 0) {
        return <div></div>;
    }
    
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Button 
                    onClick={() => setOpenCatname(catname) }
                    aria-controls={`collapse-${catcode}`}
                    aria-expanded={isOpen}
                    >
                        <h4>{catname}</h4>
                </ReactBootstrap.Button>
            </ReactBootstrap.Card.Header>
            {donors.organizations &&
                <ReactBootstrap.Collapse in={isOpen}> 
                    <ReactBootstrap.Card.Body>
                    {Object.keys(sortedDonation).map(organization => {

                        return (
                            <Donor key={organization} orgname={organization} totalAmount={sortedDonation[organization]}></Donor>
                        )
                    })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function AllIndustries({ searchResult }) {
    console.log("hi margaret search result is:", searchResult)
    const [industries, setIndustries] = React.useState([]);
    const [openCatname, setOpenCatname] = React.useState(null)
    React.useEffect(() => {
        fetch('/api/industries').
        then((response) => response.json()).
        then((industries) => setIndustries(industries.industries));
    }, [])
    if (industries.length === 0) return <div>Loading...</div>
    const content = []
    for (const industry of industries) {
        content.push(<Industry key={industry.catcode} catcode={industry.catcode} catname={industry.catname} openCatname={openCatname} setOpenCatname={setOpenCatname} searchResult={searchResult}/>);
    }
    return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
}


function Candidate({ firstlast, state, party }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [orgs, setOrgs] = React.useState({});
    React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetch(`/api/candidates/${firstlast}`).
            then((response) => response.json()).
            then((candidate) => {
                console.log("Got candidate response", candidate);
                setOrgs(candidate.candidate);
            })
    }, [isOpen, firstlast])
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Accordion.Toggle as={ReactBootstrap.Button} onClick={() => { setIsOpen(true) }} variant="link" eventKey={firstlast}>
                    <h5>{firstlast} ({party})</h5>
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {orgs.orgs &&
                <ReactBootstrap.Accordion.Collapse eventKey={firstlast}>
                    <ReactBootstrap.Card.Body>
                        <h5>{firstlast} received campaign contributions from:</h5>
                        <div>
                            <ReactBootstrap.Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <td><strong>Company</strong></td>
                                        <td><strong>Amount</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                {orgs.orgs.map(org => 
                                    <tr key={org.orgname}>
                                        <td>${org.amount.toLocaleString()}</td>
                                        <td>{org.orgname}</td>
                                    </tr>   
                                )}
                                </tbody>
                            </ReactBootstrap.Table>
                        </div>
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Accordion.Collapse>
            }
        </ReactBootstrap.Card>
    )
}


function CandidateState({ firstlast, state, party, openState, setOpenState }) {

    const [candidates, setCandidates] = React.useState({});
    // const isOpen = state == openState;
    const isOpen = true;
    React.useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetch(`/api/states/${state}`).
            then((response) => response.json()).
            then((state) => {
                console.log("Got state response", state);
                setCandidates(state.state);
            })
    }, [isOpen, state])
    return (
        <ReactBootstrap.Card>
            <ReactBootstrap.Card.Header>
                <ReactBootstrap.Button
                    // onClick={() => setIsOpen(!isOpen)}
                    onClick={() => setOpenState(state)}
                    aria-controls={`collapse-${state}`}
                    aria-expanded={isOpen}
                >
                    <h4>{state}</h4>
                </ReactBootstrap.Button>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Collapse in={isOpen}>
                    <ReactBootstrap.Card.Body>
                        {candidates.candidates.map(candidate => {
                            return (
                                <Candidate key={candidate.firstlast} firstlast={candidate.firstlast} state={candidate.state} party={candidate.party}></Candidate>
                            )
                        })}
                    </ReactBootstrap.Card.Body>
                </ReactBootstrap.Collapse>
            }
        </ReactBootstrap.Card>
    )
}



// make list of bill names and bill texts and loop over that, then makelistof quizzes and loop overthat

function AllStates() {
    const [states, setStates] = React.useState([]);
    const [openState, setOpenState] = React.useState(null);
    React.useEffect(() => {
        fetch('/api/states').
            then((response) => response.json()).
            then((states) => setStates(states.states));
    }, [])
    if (states.length === 0) return <div>Loading...</div>
    const content = []
    for (const state of states) {
        content.push(<CandidateState key={state}
            state={state}
            openState={openState}
            setOpenState={setOpenState} />);
    }
    return <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
}


function QuizContainer() {
    const [questionNum, setQuestionNum] = React.useState(1);
    function goToNextQuestion() {
        setQuestionNum(questionNum + 1);
    }
    const [quizResults, setQuizResults] = React.useState({});
    function quizFinished(quizResult, billName) {
        setQuizResults({[billName]: quizResult, ...quizResults})
    }
    console.log("quizResult is", quizResults)

    const [name, setName] = React.useState(null);
    const [resultId, setResultId] = React.useState(null);
    function handleSubmit(event) {
        event.preventDefault();
        return fetch('/api/quiz_result', {
            method: 'POST',
            body: JSON.stringify({results: quizResults, full_name: name}),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                return setResultId(data.result_id);
                })
            .catch((err) => console.log(err))
        }
        

    return (<div>
        {questionNum >= 1 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Raise the Wage Act" billText="Do you think the federal minimum wage should be raised to $15/hr?" companies={["McDonald's Corp", "Taco Bell", "PepsiCo Inc", "Domino's Pizza", "Coca-Cola Co"]} />}
        {questionNum >= 2 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Climate Action Now Act" billText="Do you think that the U.S. should remain a participant in the Paris Climate Accord to counter the climate crisis?" companies={["Molson Coors Brewing", "Target Corp", "Walmart Inc", "Tyson Foods", "Waffle House Inc"]} />}
        {questionNum >= 3 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Equality Act" billText="Should the 1964 law that outlawed race discrimination be updated to include LGBTQ individuals?" companies={["Russell Stover Candies", "Meijer Inc", "Jelly Belly Candy", "Trident Seafoods", "Starbucks Corp"]} />}
        {questionNum > 3 && <form action="/result/:resultId" method="POST">
            <label>
                Please enter your name:
                <input type="text" name="name" onChange={(event) => { setName(event.target.value) }}/>
            </label><br></br>
            <button type="button" onClick={handleSubmit}>Share My Quiz Result</button>
        </form>}
        {resultId && <a href={`/result/${resultId}`}>ur result</a>}
        </div>)
}


function Quiz({ billName, billText, companies, goToNextQuestion, quizFinished, initialYesNo, initialSelectedCompany }) {
    const [yesNo, setYesNo] = React.useState(initialYesNo);
    const [selectedCompany, setSelectedCompany] = React.useState(initialSelectedCompany);
    const [answer, setAnswer] = React.useState(null);

    React.useEffect(() => {
        console.log("Quiz useEffect yesNo", yesNo, "selectedCompany", selectedCompany)
        if (!yesNo || !selectedCompany) {
            return;
        }
        fetch(`/api/answer/${billName}/${yesNo}/${selectedCompany}`).
            then((response) => response.json()).
            then((response) => {
                console.log("Got answer response", response);
                setAnswer(response.response);
                goToNextQuestion();

                const quizResult = {
                    billName: billName,
                    billText: billText,
                    yesNo: yesNo,
                    selectedCompany: selectedCompany,
                }
                
                quizFinished(quizResult, billName);
            })
    }, [yesNo, selectedCompany])

    function handleSubmit(event) {
        event.preventDefault();
    }
    const companiesContent = []
    for (const company of companies) {
        companiesContent.push(
            <div>
                <input type="radio" name="brand" value={company} onChange={(e) => setSelectedCompany(e.target.value)} />
                <label>{company}</label><br></br>
            </div>
        );
    }
    console.log("Quiz() answer", answer);
    return (
        <form onSubmit={handleSubmit}>
            <br></br>
            <p>{billText}</p>
            <input type="radio" name="vote" value="Yes" onChange={(e) => setYesNo("No")} />
                <label>Yes</label><br></br>
            <input type="radio" name="vote" value="No" onChange={(e) => setYesNo("Yes")} />
                <label>No</label> <br></br><br></br>
            <p>Next, choose which of these brands you like:</p>
            {companiesContent}
            {answer && yesNo == "No" && <p>Oh no! You disagreed with {selectedCompany}. They donated ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName}</p>}
            {answer && yesNo == "Yes" && <p>Oh no! You disagreed with {selectedCompany}. They donated ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName}</p>}
        </form>
    );
}

function Result() {
    let { resultId } = ReactRouterDOM.useParams();
    const [result, setResult] = React.useState(null);
    const [name, setName] = React.useState(null);
    React.useEffect(() => {
        fetch(`/api/quiz_result/${resultId}`).
            then((response) => response.json()).
            then((result) => {
                console.log("urrrrrrr got result", result)
                setResult(result.quiz_result);
                setName(result.quiz_result.full_name);
            })
    }, [])
    if (!result) return <div>Loading...</div>
    return(
        <div>
            <h1>{name}'s Eat Drink Vote quiz results:</h1>
            <h3>#1: {result.results_json['Raise the Wage Act'].billName}</h3>
            <strong>The Issue:</strong><br></br>
            {result.results_json['Raise the Wage Act'].billText}<br></br>
            <strong>{name} voted:</strong><br></br>
            {result.results_json['Raise the Wage Act'].yesNo}<br></br>
            <strong>{name} likes the brand:</strong><br></br>
            {result.results_json['Raise the Wage Act'].selectedCompany}<br></br>
            <strong>The result:</strong><br></br>
            <h3>#2: {result.results_json['Equality Act'].billName}</h3>
            <strong>The Issue:</strong><br></br>
            {result.results_json['Equality Act'].billText}<br></br>
            <strong>{name} voted:</strong><br></br>
            {result.results_json['Equality Act'].yesNo}<br></br>
            <strong>{name} likes the brand:</strong><br></br>
            {result.results_json['Equality Act'].selectedCompany}<br></br>
            <strong>The result:</strong><br></br>
            <h3>#3: {result.results_json['Climate Action Now Act'].billName}</h3>
            <strong>The Issue:</strong><br></br>
            {result.results_json['Climate Action Now Act'].billText}<br></br>
            <strong>{name} voted:</strong><br></br>
            {result.results_json['Climate Action Now Act'].yesNo}<br></br>
            <strong>{name} likes the brand:</strong><br></br>
            {result.results_json['Climate Action Now Act'].selectedCompany}<br></br>
            <strong>The result:</strong><br></br>
        </div>
    )
}

{/* or try to eat at Black-owned establishments to advance racial equity. Our decisions about what to put on our plates are informed by what issues matter to us. */ }

function Home() {
    return(
        <React.Fragment>
            <h3>Welcome to Eat Drink Vote!</h3>
            <strong>About</strong><br></br>
            Our food choices are extensions of our identities. We gravitate toward food brands that we know and love, ones that evoke nostalgia and bring comfort. 
            Our food choices are also reflections of our values. For example, one might try to minimize meat consumption to prioritize animal welfare, or to take action on climate change.
            As consumers, we strive to balance our health, likings, and values when we make decisions about which to foods to buy.
            <br></br>
            But, are our values shared by the food companies that we know, love, and patronize? When we buy our beloved KitKat bar, how is a company like Hershey allocating our money?
            Food companies, like other big businesses, engage in lobbying practices and funnel tens of thousands of dollars to politicians.
            OpenSecrets API
            As consumers, we are entitled to transparency and truth. an understanding of what is really behind the label -- both nutritionally and politically.
            <h4>Take the Eat Drink Vote Quiz!</h4>
        </React.Fragment>
    )
}

function NavBar({ searchResult, setSearchResult }) {
    return (
        <div>
            <ReactBootstrap.Navbar bg="dark" variant="dark">
                <ReactBootstrap.Navbar.Brand href="/">Eat Drink Vote</ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                    <ReactBootstrap.Nav className="mr-auto">
                        {/* <ReactRouterDOM.Link to="/home" className="nav-link" >Home</ReactRouterDOM.Link> */}
                        <ReactRouterDOM.Link to="/quiz" className="nav-link" >Take the Quiz</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/industries" className="nav-link" >Browse Companies</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/candidates" className="nav-link" >Browse Candidates</ReactRouterDOM.Link>
                    </ReactBootstrap.Nav>
                    <ReactBootstrap.Form inline>
                        <input value={searchResult} onChange={event => setSearchResult(event.target.value)} type="text" placeholder="Search" className="mr-sm-2" /> 
                    </ReactBootstrap.Form>
                </ReactBootstrap.Navbar.Collapse>
            </ReactBootstrap.Navbar>
        </div>
    )
}

function App() {
    const [searchResult, setSearchResult] = React.useState('')
    return (
        <ReactRouterDOM.BrowserRouter>
            <NavBar searchResult={searchResult} setSearchResult={setSearchResult} /> 
            <ReactRouterDOM.Switch>
                {/* updates here vv */}
                <ReactRouterDOM.Route path="/" exact>
                {/* updates here ^^ */}
                    <Home />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/industries" exact>
                    <AllIndustries searchResult={searchResult} />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/candidates" exact>
                    <AllStates />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/quiz" exact>
                    <QuizContainer />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/result/:resultId">
                    <Result />
                </ReactRouterDOM.Route>
            </ReactRouterDOM.Switch>
        </ReactRouterDOM.BrowserRouter>
    );
}


ReactDOM.render(<App />, document.getElementById('root'))