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
                    <h4 class="orgname">{orgname}</h4>
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {candidates.candidates &&
                <ReactBootstrap.Accordion.Collapse eventKey={orgname}>
                    <ReactBootstrap.Card.Body>
                        <p class="orgname-txt">Since 2018, <strong>{orgname}</strong> has given</p>
                        <p class="dems">{candidates.totals.d_perc}% to Democrats</p>
                        <p class="and"> and </p>
                        <p class="reps">{candidates.totals.r_perc}% to Republicans.</p>
                        <div>
                            <ReactBootstrap.Table class="table" striped bordered hover size="sm">
                                <thead class="thead">
                                    <tr>
                                        <td class="amount-row"><strong>Amount</strong></td>
                                        <td class="party-row"><strong>Party-State</strong></td>
                                        <td class="candidate-row"><strong>Candidate</strong></td>
                                    </tr>
                                </thead>
                                <tbody class="tbody">
                                    {candidates.candidates.map(candidate =>
                                        <tr key={candidate.firstlast}>
                                            <td>${candidate.total.toLocaleString()}</td>
                                            <td>{candidate.party}-{candidate.state}</td>
                                            <td><a class="candidate-name" href={`http://www.google.com/search?q=${candidate.firstlast}&btnI`}>{candidate.firstlast}</a></td>
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
    // const isOpen = catname==openCatname;
    // ^^ vv just swap these two if you want to expand all candidates
    const isOpen = true;
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
                    onClick={() => setOpenCatname(catname)}
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
    if (industries.length === 0) return (
        <div><ReactBootstrap.Spinner class="spinner" animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </ReactBootstrap.Spinner></div>)
    const content = []
    for (const industry of industries) {
        content.push(<Industry key={industry.catcode} catcode={industry.catcode} catname={industry.catname} openCatname={openCatname} setOpenCatname={setOpenCatname} searchResult={searchResult} />);
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
                <ReactBootstrap.Accordion.Toggle class="orgname-button" as={ReactBootstrap.Button} onClick={() => { setIsOpen(true) }} variant="link" eventKey={firstlast}>
                    <h4 class="orgname">{firstlast} ({party})</h4>
                </ReactBootstrap.Accordion.Toggle>
            </ReactBootstrap.Card.Header>
            {orgs.orgs &&
                <ReactBootstrap.Accordion.Collapse eventKey={firstlast}>
                    <ReactBootstrap.Card.Body>
                        <p class="politician-txt">Since 2018, <strong>{firstlast}</strong> has received<br></br>campaign contributions from:</p>
                        <div>
                            <ReactBootstrap.Table class="table" striped bordered hover size="sm">
                                <thead class="thead">
                                    <tr>
                                        <td><strong>Amount</strong></td>
                                        <td><strong>Company</strong></td>
                                    </tr>
                                </thead>
                                <tbody class="tbody">
                                    {orgs.orgs.map(org =>
                                        <tr key={org.orgname}>
                                            <td>${org.amount.toLocaleString()}</td>
                                            <td><a class="candidate-name" href={`http://www.google.com/search?q=${org.orgname}&btnI`}>{org.orgname}</a></td>
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


function CandidateState({ firstlast, state, party, openState, setOpenState, searchResult }) {
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
    console.log("urrrrrrrrrrrrrrrr candidates are", candidates);
    if (Object.keys(candidates).length === 0) {
        return <div></div>
    }
    const candidateSearch = candidates.candidates.filter(entry => entry.firstlast.toLowerCase().includes(searchResult));
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
                        {candidateSearch.map(candidate => {
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


function AllStates({ searchResult }) {
    const [states, setStates] = React.useState([]);
    const [openState, setOpenState] = React.useState(null);
    React.useEffect(() => {
        fetch('/api/states').
            then((response) => response.json()).
            then((states) => setStates(states.states));
    }, [])
    if (states.length === 0) return (
        <div><ReactBootstrap.Spinner class="spinner" animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </ReactBootstrap.Spinner></div>)
    const content = []
    for (const state of states) {
        content.push(<CandidateState key={state}
            state={state}
            openState={openState}
            setOpenState={setOpenState}
            searchResult={searchResult} />);
    }
    return (
        <div class="browse-container">
            <div class="browse-flex">
                <p class="browse-companies">Browse Politicians</p>
                <p class="select-company">First select a US state, then select a politician to uncover which companies financed their campaign.</p>
                <ReactBootstrap.Accordion>{content}</ReactBootstrap.Accordion>
            </div>
        </div>
    )
}


function QuizContainer() {
    const [questionNum, setQuestionNum] = React.useState(1);
    // 1 is initial state, setQuestionNum is function for changing state
    function goToNextQuestion() {
        setQuestionNum(questionNum + 1);
        // function called goToNextQuestion that changes the state to questionNum +1
    }
    const [quizResults, setQuizResults] = React.useState({});
    // quizResults is empty object, setQuizResult is function for changing state
    function quizFinished(quizResult, billName) {
        setQuizResults({ [billName]: quizResult, ...quizResults })
        // function called quizFinished that sets the quizResults to an object where the key is billName and the value is the quizResult -- do this for all quizResults
    }
    const [name, setName] = React.useState(null);
    // initial state for name is null
    const [resultId, setResultId] = React.useState(null);
    // initial state for resultID is null
    function handleSubmit(event) {
        event.preventDefault();
        // when the button for submitting results is clicked...
        return fetch('/api/quiz_result', {
            // posting the quizResults and full_name as a JSON object to the database
            method: 'POST',
            body: JSON.stringify({ results: quizResults, full_name: name }),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                return setResultId(data.result_id);
            })
            // resultID is set as the number for resultID that you get back from the JSON response, which is autoincremented
            .catch((err) => console.log(err))
    }


    return (
        <div>
            <h3 class="quiz-head">Eat Drink Vote Quiz</h3>
            <p class="why-matter">Why does it matter? Take a quiz to find out how your values align with those of the big corporations.</p>
            {questionNum >= 1 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Raise the Wage Act" billText="Do you think the federal minimum wage should be raised to $15/hr?" companies={["Domino's Pizza", "McDonald's Corp", "Taco Bell", "Starbucks Corp"]} yesOrNo={["Yes", "No"]} />}
            {questionNum >= 2 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="CURD Act" billText="Do you think that the label 'natural cheese' should apply to plant-based cheese alternatives?" companies={["Land O'Lakes", "Stonyfield Farms", "Leprino Foods", "PepsiCo Inc"]} yesOrNo={["Yes", "No"]} />}
            {questionNum >= 3 && <Quiz goToNextQuestion={goToNextQuestion} quizFinished={quizFinished} billName="Agriculture Improvement Act" billText="Do you think that there should be a limit on number of federal subsidies for corporate mega-farms?" companies={["Tyson Foods", "Mountaire Corp", "Coca-Cola Co", "Molson Coors Brewing"]} yesOrNo={["Yes", "No"]} />}
            {/* if question number is >= 1 --> pass to Quiz component the props goToNextQuestion and quizFinished. we are also defining here the variables for each question: billName and billText and companies */}
            {questionNum > 3 && <form action="/result/:resultId" method="POST">
                <div class="save-results-container">
                    <div class="save-results-flex">
                        <div class="done">Want to share what you learned?</div>
                        <div class="done-text"> Enter your name to get a personalized, shareable results link:</div>
                        <label>
                            <input type="text" placeholder="Your name" name="name" onChange={(event) => { setName(event.target.value) }} />
                        </label>
                        <button type="button" class="submit-button" onClick={handleSubmit}>Submit</button>
                        <p class="result-button-wrap">
                            {resultId && <a class="home-button" href={`/result/${resultId}`}>Quiz Result for {name}</a>}
                        </p>
                        {/* once we finish the quiz, we can submit our name and post our result to the database. we get back a resultID that we use to make the link */}
                    </div>
                </div>
            </form>}
        </div>
    )
}

// summary of quizcontainer: this is the component that we use to determine question number, advance to the next question, 
// determine that the quiz is done, post our results to the database, get back a resultID that we give to the user as link
// we are passing props for goToNextQuestion and quizFinished to quiz component


function Quiz({ billName, billText, companies, goToNextQuestion, quizFinished, initialYesNo, initialSelectedCompany }) {
    const [yesNo, setYesNo] = React.useState(initialYesNo);
    // initial state is called initialYesNo -- we will pass this in when we make quiz results page!
    const [selectedCompany, setSelectedCompany] = React.useState(initialSelectedCompany);
    // initial state is called initialSelectedCompany -- we will pass this in when we make quiz results page
    const [answer, setAnswer] = React.useState(null);
    // initial state of answer is none --> is set when we get the API response back!

    const companyNameToImage = {
        "McDonald's Corp": '/static/css/mcdonalds.png',
        'Taco Bell': '/static/css/tacobell.jpg',
        'PepsiCo Inc': '/static/css/pepsi.png',
        "Domino's Pizza": '/static/css/dominos.jpg',
        "Coca-Cola Co": '/static/css/cocacola.png',
        "Molson Coors Brewing": '/static/css/coors.jpeg',
        "Target Corp": '/static/css/target.png',
        "Walmart Inc": '/static/css/walmart.jpg',
        "Tyson Foods": '/static/css/tyson.png',
        "Waffle House Inc": '/static/css/waffle.png',
        "Russell Stover Candies": '/static/css/rsc.png',
        "Meijer Inc": '/static/css/meijer.png',
        "Jelly Belly Candy": '/static/css/jelly.jpg',
        "Trident Seafoods": '/static/css/trident.png',
        "Starbucks Corp": '/static/css/starbucks.jpg',
        "Leprino Foods": '/static/css/leprino.png',
        "Land O'Lakes": '/static/css/landolakes.jpeg',
        "Stonyfield Farms": '/static/css/stonyfield.jpg',
        'Mountaire Corp': '/static/css/mountaire.png'
    }
    // company name to image object

    React.useEffect(() => {
        if (!yesNo || !selectedCompany) {
            return;
        }
        // if yesNo and selectedCompany do not exist yet (if the user has not started the quiz) --> don't do anything just return
        fetch(`/api/answer/${billName}/${yesNo}/${selectedCompany}`).
            then((response) => response.json()).
            then((response) => {
                console.log("Got answer response", response);
                setAnswer(response.response);
                // we get a response back from the API call that has the answer (incl candidate count, vote of company, total donated) --> and we setAnswer to be this response
                goToNextQuestion();
                // then we call the goToNextQuestion function to advance the question number and show the next question

                const quizResult = {
                    billName: billName,
                    billText: billText,
                    yesNo: yesNo,
                    selectedCompany: selectedCompany,
                }
                // from our API repsonse, quizResult constant is a dictionary with billName, billText, yesNo, selectedCompany

                quizFinished(quizResult, billName);
                // once we've gone through all of the question, we call quizFinished (inherited from quizcontainer) sets the quizResults to an object where the key is billName and the value is the quizResult
                // this component is all about just the quiz questions. we can't call quizFinished here because we need all of the questions to be collected together at the end
            })
    }, [yesNo, selectedCompany])
    // if yesNo and selectedCompany have changed, re-render the component

    function handleSubmit(event) {
        event.preventDefault();
    }
    // there will be a button
    const companiesContent = []
    for (const company of companies) {
        // companies is coming from quizContainer --> we hard-coded them for each quiz question
        companiesContent.push(
            <div class="flex-nested-item">
                <label>
                    <input class="radio" type="radio" name="brand" checked={selectedCompany === company} value={company} onChange={(e) => setSelectedCompany(e.target.value)} />
                    <img class="brand-img" src={companyNameToImage[company]}></img>   {company}
                </label>
            </div>
        );
    }
    // into the array companiesContent we are pushing the radio buttons for each company. when a company button is selected, we setSelectedCompany to that company that the user chose.
    console.log("Quiz() answer", answer);
    return (
        <form onSubmit={handleSubmit}>
            <div class="container">
                <div class="flex-item"><h5>{billText}</h5>
                    <div class="flex-nested-item">
                        <label hidden = {initialYesNo && initialYesNo === "Yes"}>
                            <input type="radio" class="radio" checked={yesNo === "No"} value="No" onChange={(e) => setYesNo(e.target.value)} />    Yes
                        </label>
                    </div>
                    <div class="flex-nested-item">
                        <label hidden={initialYesNo && initialYesNo === "No"}>
                            <input type="radio" class="radio" checked={yesNo === "Yes"} value="Yes" onChange={(e) => setYesNo(e.target.value)} />    No
                            {/* when a user selects yes or no, we setYesNo to the opposite of what they said */}
                            {/* want to show the companies that disagree with you --> why yesno is reversed from user answer */}
                        </label>
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
                    // if answer is not null and if yesNo is equal to No, show "you guessed incorrectly" etc.
                    <div class="answer-flex">
                        <div class="oh-no">You guessed incorrectly!</div>
                        <div class="answer">{selectedCompany} gave ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName} in 2018.</div></div>}
                <div class="answer-container">
                    {answer && yesNo == "Yes" &&
                        // if answer is not null and yesNo is equal to Yes, show "you guessed correctly" etc.
                        <div class="answer-flex">
                            <div class="oh-yes">You're right!</div>
                            <div class="answer">{selectedCompany} gave ${answer.total_received.toLocaleString()} to {answer.candidate_count} politicians who voted {yesNo} on the {billName} in 2018.</div></div>}
                </div>
            </div>
        </form>
    );
}


// this is the componet that renders each quiz question individually. it is not responsible for advancing the quiz or indicating the quiz is finished.
// we are getting an API response with the answer info. then we compare this against what the user said and that dictates what the "you are correct" etc. statement reads


function Result() {
    let { resultId } = ReactRouterDOM.useParams();
    // we will use resultID to define a path to result for that ID --> resultID will be a parameter
    const [result, setResult] = React.useState(null);
    // initial state of result is null
    const [name, setName] = React.useState(null);
    // initial state of name is null
    // states are things that have the potential to change!
    React.useEffect(() => {
        fetch(`/api/quiz_result/${resultId}`).
            then((response) => response.json()).
            then((result) => {
                console.log("urrrrrrr got result", result)
                // collect response from API for that resultID (which is a dictionary with key "result" that has values resultID, name, and results_json)
                setResult(result.quiz_result);
                // using the API response, setResult to quiz_result from result of API call
                setName(result.quiz_result.full_name);
                // do the same as above for name
            })
    }, [])
    if (!result) return (
        <div><ReactBootstrap.Spinner class="spinner" animation="border" role="status">
            <span className="sr-only">Loading...</span>
        </ReactBootstrap.Spinner></div>)
    return (
        <div class="results-parent">
            <div class="results-container">
                <div class="results-flex-item">
                    <p class="result-h"> Quiz Result for:</p>
                    <p class="result-name"> {name}</p>
                        <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-text="I took a quiz on political donation patterns of big food companies -- want to see how I did?" data-hashtags="#campaignfinance #corporatelobbying" data-show-count="false">
                            <img class="tweet-img" src="/static/css/tweet.png"></img>
                        </a>
                        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                    <Quiz goToNextQuestion={() => null} quizFinished={() => null} initialYesNo={result.results_json['Raise the Wage Act'].yesNo} initialSelectedCompany={result.results_json['Raise the Wage Act'].selectedCompany} billName="Raise the Wage Act" billText="Do you think the federal minimum wage should be raised to $15/hr?" companies={[result.results_json['Raise the Wage Act'].selectedCompany]} />
                    <Quiz goToNextQuestion={() => null} quizFinished={() => null} initialYesNo={result.results_json['CURD Act'].yesNo} initialSelectedCompany={result.results_json['CURD Act'].selectedCompany} billName="CURD Act" billText="Do you think that the label 'natural cheese' should apply to plant-based cheese alternatives?" companies={[result.results_json['CURD Act'].selectedCompany]} />
                    <Quiz goToNextQuestion={() => null} quizFinished={() => null} initialYesNo={result.results_json['Agriculture Improvement Act'].yesNo} initialSelectedCompany={result.results_json['Agriculture Improvement Act'].selectedCompany} billName="Agriculture Improvement Act" billText="Do you think there should be a limit on number of federal subsidies for corporate mega-farms?" companies={[result.results_json['Agriculture Improvement Act'].selectedCompany]} />
                    {/* quiz takes a prop called go to next question that you need to pass in. when you are using a component in another compoent where one of the props is a function, it is best to pass in the function even just with a null value*/}
                </div>
            </div>
        </div>
        // render the results for the specific user/resultID
    )
}

function Home() {
    return (
        <div>
            <div>
                <p class="title-h">Eat Drink Vote</p>
                <p class="title-p">Uncover how big food companies take political stances.</p>
                <p class="title-p">Satisfy you appetite for transparency.</p>
                <p class="button-wrap">
                    <a class="home-button" href="/companies">Browse Companies</a>
                </p>
            </div>
            <div class="bar"></div>
        </div>
    )
}

function About() {
    return (
        <React.Fragment>
            <p class="about-h">About</p>
            <p class="about-p">
                <p>Our food choices are extensions of our identities. We gravitate toward food brands that we know and love, ones that evoke nostalgia and bring comfort.</p>
                <p>Our food choices are also reflections of our values. For example, one might try to minimize meat consumption to prioritize animal welfare or to take action on climate change.</p>
                <p>As consumers, we strive to balance our health, likings, and values when we make decisions about what to put on our table.</p>
                <p>But, are our values shared by the food companies that we know, love, and patronize? </p>
                <p>Food companies, like other big businesses, lobby the politicians who shape the policies that regulate the food industry -- and that may or may not align with our values.</p>
                <p>As consumers, we are entitled to transparency and truth. The Eat Drink Vote app will help you make sense of what is really behind the food label -- both nutritionally and politically.</p>
            </p>
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
                        <ReactRouterDOM.Link to="/companies" className="nav-link" >Browse Companies</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/politicians" className="nav-link" >Browse Politicians</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/quiz" className="nav-link" >Why It Matters Quiz</ReactRouterDOM.Link>
                        <ReactRouterDOM.Link to="/about" className="nav-link" >About</ReactRouterDOM.Link>
                    </ReactBootstrap.Nav>
                    <ReactBootstrap.Form inline>
                        <input class="search-bar" value={searchResult} onChange={event => setSearchResult(event.target.value)} type="text" placeholder=" Search" className="mr-sm-2" />
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
                    <AllStates searchResult={searchResult} />
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