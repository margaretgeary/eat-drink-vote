# Eat Drink Vote
Eat Drink Vote is a full stack web application that uncovers how the food industry plays in the political space by financing politicians -- and what effect this has on our laws.

The objective of Eat Drink Vote was to build a coherent educational tool that can inform your decisions on what foods to buy based on the issues that matter to you.

In the end, I achieved my goal of making the complicated world of campaign finance, and its intersection with food & beverage, available to a wider audience.

Access the live webapp [here](http://eatdrinkvoteapp.com).

![Homepage](/static/gif/homepage.gif "Homepage")

## Contents
 - [Technologies](#technologies)
- [Datasets/APIs](#apis)
 - [Installation](#installation)
 - [Features](#features)
 - [Features for 2.0](#featuresfor2.0)
 - [About the Developer](#aboutthedeveloper)

### Technologies
* Python 3.7
* PostgresSQL
* Flask
* Flask-SQLAlchemy
* SQLAlchemy
* Javascript
* AJAX/JSON
* React
* React Router
* Bootstrap
* HTML/CSS

### <a name="apis"></a> Datasets/APIs
* [Federal Elections Commission](https://api.open.fec.gov/developers/) 
* [GovTrack](https://www.govtrack.us/congress/votes)
* [OpenSecrets](https://www.opensecrets.org/bulk-data)
* [GetLegislators API](https://www.opensecrets.org/open-data/api-documentation)
---
### Installation
#### Prerequisites
To run Eat Drink Vote, you must have installed:
 - [PostgreSQL](https://www.postgresql.org/)
 - [Python 3.7](https://www.python.org/downloads/)
 - [API key for the GetLegislators API](https://www.opensecrets.org/api/admin/index.php?function=signup)

 #### Run Eat Drink Vote on your local computer
Download OpenSecrets Campaign Finance Data:
> This web app uses data from the OpenSecrest campaign fiance bulk database. 
>The data was parsed with a python algorithm and seeded into a PostgreSQL database.
> To access the data, create an Open Secrets Bulk Data account, then under the Campaign Finance Data tab, select 2018 Cycle Tables. Save the file indivs18.txt as a CSV in
> the main folder of the repo.

[Campaign Finance Data - 2018 Cycle Tables](https://www.opensecrets.org/bulk-data/downloads)

 Clone or fork repository:
 ```
 $ git clone https://github.com/margaretgeary/eat-drink-vote
 ```

Create and activate a virtual environment within your Eat Drink Vote directory:
```
$ virtualenv env
$ source env/bin/activate
```
Install dependencies:
```
$ pip install -r requirements.txt
```
Get an API key from OpenSecrets and add your API key to the opensecrets_api.py file.

Create database 'donations':
   ```
$ createdb donations
```
To create the database tables and seed the database with each CSV file (indivs18, votes, industry_codes), run the following commands:
   ```
$ python3 bulk_data.py
```
   ```
$ python3 industry_data.py
```
   ```
$ python3 votes_data.py
```
   ```
$ python3 opensecrets_api.py
```
   ```
$ python3 seed_database.py
```
To run the app from the command line:
```
$ python3 server.py
```
---
### Features
Access the live webapp: [eatdrinkvoteapp.com](http://eatdrinkvoteapp.com)

#### Browse Companies
Here, you can view a list of American food companies sorted by industry, select one, and learn which politicians that company has funded since 2018 and see their donation ratio of Democats vs. Republicans. Each politician's name links out to their campaign website.
![Browse Companies](/static/gif/browsecompanies.gif "Browse Companies")
#### Browse Politicians
Here, you can find your US state, see or search for who your representatives are, and learn which food companies donated to them since 2018. Each company's name links out to their corporate website.
![Browse Politicians](/static/gif/browsepoliticians.gif "Browse Politicians")
#### Why It Matters Quiz
Here, you answer questions about where you stand on some key issues, and try to guess which food companies donated to candidates who aligned with you based on aggregations of congressional voting records.
![Why It Matters Quiz](/static/gif/quiz.gif "Why It Matters Quiz")
#### Save & Share Results
Once you finish the quiz, you can submit your name to receive a personalized results link to your own webpage so that you can save your quiz results and others can view them.
![Save & Share Quiz Results](/static/gif/saveresults.gif "Save & Share Quiz Results")

---
### <a name="featuresfor2.0"></a> Features for 2.0
Future iterations of this project will include:
* When a user searches for a company/politician in the search bar, all industry/state cells not containing that company will disappear. 
* Companies' names on the quiz page link out to their cells on the Browse Companies page.
* Quiz will be expanded to recommend food companies to users based on the issues that matter to them.
* Quiz will be lengthened to include more questions on more key issues.
---


### <a name="aboutthedeveloper"></a> About the Developer
Eat Drink Vote developer Margaret Geary is a chocolate scientist and software engineer. This is her first full-stack project. She can be found on [LinkedIn](https://www.linkedin.com/in/margaretgeary/) and on [Github](https://github.com/margaret).