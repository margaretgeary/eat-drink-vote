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
                <ReactBootstrap.Accordion.Toggle class="orgname-button" as={ReactBootstrap.Button} onClick={() => { setIsOpen(true) }} variant="link" eventKey={orgname}>
                    <h4 class ="orgname">{orgname}</h4>
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={orgname}>
                    <ReactBootstrap.Card.Body>
                    <p class="orgname-txt"><strong>{orgname}</strong> gave</p>
                        <p class="dems">{candidates.totals.d_perc}% to Democrats</p>
                        <p class="and"> and </p>
                        <p class="reps">{candidates.totals.r_perc}% to Republicans.</p>
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
                    class="btn-primary"
                    onClick={() => setOpenCatname(catname) }
                    aria-controls={`collapse-${catcode}`}
                    aria-expanded={isOpen}
                    >
                        <p>{catname}</p>
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
    return (
        <div class="browse-container">
            <div class="browse-flex">
                <p class="browse-companies" >Browse Companies</p>
                <p class="select-company">Select a food industry to get started, then select a company to uncover which politicians they financed.</p>
                <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
            </div>
        </div>
    )
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
    const isOpen = state == openState;
    // const isOpen = true;
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
    return (
        <React.Fragment>
            <h3>Browse Politicians</h3>
            First select a US state, then select a politician to uncover which food companies financed their campaign.
            <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
        </React.Fragment>
        )
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
        

    return (
        <div>
            <h3 class="quiz-head">Eat Drink Vote Quiz</h3>
            {questionNum >= 1 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Raise the Wage Act" billText="Do you think the federal minimum wage should be raised to $15/hr?" companies={["McDonald's Corp","Taco Bell","PepsiCo Inc","Domino's Pizza","Coca-Cola Co"]} />}
        {questionNum >= 2 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Climate Action Now Act" billText="Do you think that the U.S. should remain a participant in the Paris Climate Accord to counter the climate crisis?" companies={["Molson Coors Brewing", "Target Corp", "Walmart Inc", "Tyson Foods", "Waffle House Inc"]} />}
        {questionNum >= 3 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Equality Act" billText="Should the 1964 law that outlawed race discrimination be updated to include LGBTQ individuals?" companies={["Russell Stover Candies", "Meijer Inc", "Jelly Belly Candy", "Trident Seafoods", "Starbucks Corp"]} />}
        {questionNum > 3 && <form action="/result/:resultId" method="POST">
            <div class="save-results-container">
                <div class="save-results-flex">
                    <div class="done">Surprised by what you learned?</div>
                    <div class="done-text"> Enter your name to get a personalized, shareable results link:</div>
                    <label>
                        <input type="text" placeholder="Your name" name="name" onChange={(event) => { setName(event.target.value) }} />
                    </label>
                    <button type="button" class="submit-button" onClick={handleSubmit}>Submit</button>
                    {resultId && <a href={`/result/${resultId}`}>Quiz Result for {name}</a>}
                </div>
            </div>
        </form>}
        </div>
        )
}


function Quiz({ billName, billText, companies, goToNextQuestion, quizFinished, initialYesNo, initialSelectedCompany }) {
    const [yesNo, setYesNo] = React.useState(initialYesNo);
    const [selectedCompany, setSelectedCompany] = React.useState(initialSelectedCompany);
    const [answer, setAnswer] = React.useState(null);

    const companyNameToImage = {
        "McDonald's Corp": '/static/css/mcdonalds.png',
        'Taco Bell': '/static/css/tacobell.jpg',
        'PepsiCo Inc': '/static/css/pepsi.png',
        "Domino's Pizza": '/static/css/dominos.jpg',
        "Coca-Cola Co": 'static/css/cocacola.png',
        "Molson Coors Brewing": 'static/css/coors.jpeg',
        "Target Corp": 'static/css/target.png',
        "Walmart Inc": 'static/css/walmart.jpg',
        "Tyson Foods": 'static/css/tyson.png',
        "Waffle House Inc": 'static/css/waffle.png',
        "Russell Stover Candies": 'static/css/rsc.png',
        "Meijer Inc": 'static/css/meijer.png',
        "Jelly Belly Candy": 'static/css/jelly.jpg',
        "Trident Seafoods": 'static/css/trident.png',
        "Starbucks Corp": 'static/css/starbucks.jpg',
    }

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
            <div class="flex-nested-item">
                <label><img class="brand-img" src={companyNameToImage[company]}></img><input class="brand-radio" type="radio" name="brand" value={company} onChange={(e) => setSelectedCompany(e.target.value)} />
                {company}</label>
            </div>
        );
    }
    console.log("Quiz() answer", answer);
    return (
        <form onSubmit={handleSubmit}>
        <div class="container">
            <div class="flex-item"><h5>{billText}</h5>
                    <div class="flex-nested-item">
                        <div class="radio-item">
                        <label for="rad1" >
                            <input id="rad1" type="radio" name="rad" onChange={(e) => setYesNo("No")} />    Yes
                        </label>
                    </div>
                    </div>
                    <div class="flex-nested-item">
                    <div class="radio-item">
                        <label for="rad2">
                            <input id="rad2" type="radio" name="rad" onChange={(e) => setYesNo("Yes")} />    No
                        </label>
                    </div>
                    </div>
            </div>
        </div>
        <div class="container">
            <div class="flex-item"><h5>Which of these brands do you think agreed with your vote?</h5>
                <div class="flex-nested-item">   {companiesContent} </div>
            </div>
        </div>
        <div class="answer-container">
            {answer && yesNo == "No" && 
                <div class="answer-flex">
                    <div class="oh-no">You guessed incorrectly!</div>
                    <div class="answer">{selectedCompany} gave ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName} in 2018.</div></div>}
        <div class="answer-container">
            {answer && yesNo == "Yes" && 
                <div class="answer-flex">
                    <div class="oh-yes">You're right!</div>
                    <div class="answer">{selectedCompany} gave ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName} in 2018.</div></div>}
        </div>
        </div>
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
        <div class="results-container">
            <div class="results-flex-item">
                <p class="result-h"> Quiz Result for:</p>
                <p class="result-name"> {name}</p>
                <p class="bill-name">#1: {result.results_json['Raise the Wage Act'].billName}</p>
                The Issue:
                {result.results_json['Raise the Wage Act'].billText}
                {name} voted:
                {result.results_json['Raise the Wage Act'].yesNo}
                {name} likes the brand:
                {result.results_json['Raise the Wage Act'].selectedCompany}
                The result:
                <h3>#2: {result.results_json['Equality Act'].billName}</h3>
                <strong>The Issue:</strong><br></br>
                {result.results_json['Equality Act'].billText}<br></br>
                <strong>{name} voted:</strong><br></br>
                {result.results_json['Equality Act'].yesNo}<br></br>
                <strong>{name} likes the brand:</strong><br></br>
                {result.results_json['Equality Act'].selectedCompany}<br></br>
                <strong>The result:</strong><br></br><br></br>
                <h3>#3: {result.results_json['Climate Action Now Act'].billName}</h3>
                <strong>The Issue:</strong><br></br>
                {result.results_json['Climate Action Now Act'].billText}<br></br>
                <strong>{name} voted:</strong><br></br>
                {result.results_json['Climate Action Now Act'].yesNo}<br></br>
                <strong>{name} likes the brand:</strong><br></br>
                {result.results_json['Climate Action Now Act'].selectedCompany}<br></br>
                <strong>The result:</strong><br></br>
            </div>
        </div>
    )
}

{/* or try to eat at Black-owned establishments to advance racial equity. Our decisions about what to put on our plates are informed by what issues matter to us. */ }

function Home() {
    return(
        <div>
            <h3 class="title-h">Eat Drink Vote</h3>
        {/* <div class="hero-flex-center">
            <div class="hero-message"> */}
                <p class="title-p">Uncover how big food companies take political stances and engage in corporate lobbying.</p>
                <p class="title-p">Satisfy you appetite for transparency and learn what's behind the food label.</p>
            {/* </div>
        </div> */}
            <p class="button-wrap">
                 <a class="home-button" href="/quiz">Take the quiz</a>
            </p>
        </div>
    )
}

function About() {
    return (
        <React.Fragment>
            <h3>About</h3>
            <p>Our food choices are extensions of our identities. We gravitate toward food brands that we know and love, ones that evoke nostalgia and bring comfort.</p>
            <p>Our food choices are also reflections of our values. For example, one might try to minimize meat consumption to prioritize animal welfare or to take action on climate change.</p>
            <p>As consumers, we strive to balance our health, likings, and values when we make decisions about what to put on our table.</p>
            <p>But, are our values shared by the food companies that we know, love, and patronize? When we buy our beloved KitKat bar, how is a company like Hershey allocating our money?</p>
            <p>Food companies, like other big businesses, engage in lobbying and funnel tens of thousands of dollars to politicians who shape the policies that regulate their industry.</p>
            <p>When big food companies use money to influence government agencies, this can harm public health, the environment, and human rights -- and can grossly misalign with our values.</p>
            <p>As consumers, we are entitled to transparency and truth -- the Eat Drink Vote app will help you make sense of what is really behind the food label -- both nutritionally and politically.</p>
        </React.Fragment>
    )
}

function NavBar({ searchResult, setSearchResult }) {
    return (
        <div>
            <ReactBootstrap.Navbar class="nav" variant="dark">
                <ReactBootstrap.Navbar.Brand href="/">Eat Drink Vote</ReactBootstrap.Navbar.Brand>
                <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
                <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
                    <ReactBootstrap.Nav className="mr-auto">
                        <ReactRouterDOM.Link to="/about" className="nav-link" >About</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/quiz" className="nav-link" >Take the Quiz</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/companies" className="nav-link" >Browse Companies</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/politicians" className="nav-link" >Browse Politicians</ReactRouterDOM.Link>
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
                <ReactRouterDOM.Route path="/" exact>
                    <Home />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/companies" exact>
                    <AllIndustries searchResult={searchResult} />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/politicians" exact>
                    <AllStates />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/quiz" exact>
                    <QuizContainer />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/about" exact>
                    <About />
                </ReactRouterDOM.Route>
                <ReactRouterDOM.Route path="/result/:resultId">
                    <Result />
                </ReactRouterDOM.Route>
            </ReactRouterDOM.Switch>
        </ReactRouterDOM.BrowserRouter>
    );
}


ReactDOM.render(<App />, document.getElementById('root'))