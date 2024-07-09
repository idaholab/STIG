# TestData and loading Neo4j

The collection of files here provide a quick and easy way to populate Neo4j with STIX objects!


## Getting Started

- First, ensure go is intalled on your system. You can check if go is installed and the version by running "go version" in your command line.
- Next, you're going to need a running instance of Neo4j that the program can connect to. Take note of the URL
- Install Neo4j Go Driver: Install the Neo4j driver for Go by running the following command in your terminal:


    go get github.com/neo4j/neo4j-go-driver/v4/neo4j


### Prerequisites

- Once the files are all downloaded, save them to a trusted and rememberable directory and you should be good to go!


## Usage




- Save the Go program code in a file with a .go extension, for example, upload_stix.go.

- Provide STIX JSON File (Optional): If you want to upload STIX data from an external file rather than the embedded data in the code, ensure you have the STIX JSON file ready and know its file path.

- Compile the Program: Navigate to the directory containing your .go file in the terminal and compile the Go program by running:


    go build
This will generate an executable file.

Run the Program: You can now run the program. Once it starts running you will be prompted to input how many nodes you would like to populate into Neo4j. THe command is down below.



    go run neo4jData.go

Check the Output: If the program runs successfully, it will upload the STIX data to the Neo4j database and print a success message. If there are errors, they will be logged to the terminal. Then just refreshed the window where your database is and the nodes should be populated

## Deleting nodes inside of neo4J
- match(anyVariable) detach delete anyVariable inside the query box in the Neo4j browser!
