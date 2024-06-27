package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/neo4j/neo4j-go-driver/v4/neo4j"
)

// Structs for parsing JSON data
type ThreatActor struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Aliases     []string `json:"aliases"`
	Targets     []string `json:"targets"`
	Country     string   `json:"country"`
}

type Relationship struct {
	SourceRef        string `json:"source_ref"`
	TargetRef        string `json:"target_ref"`
	RelationshipType string `json:"relationship_type"`
}

func main() {
	// Command-line flag to accept the path to a STIX JSON file
	stixFilePath := flag.String("stix-file", "", "Path to a STIX JSON file")
	flag.Parse()

	// Neo4j connection information
	uri := "neo4j://localhost:7687"
	username := "neo4j"
	password := "toor"

	var stixData string

	// Check if a STIX file path was provided
	if *stixFilePath != "" {
		// Read the STIX file
		fileData, err := os.ReadFile(*stixFilePath)
		if err != nil {
			log.Fatalf("Error reading STIX file: %v", err)
		}
		stixData = string(fileData)
	} else {
		// Use embedded STIX data if no file path is provided
		stixData = `{
			"threat_actors": [
			  {
				"id": "threat-actor-1",
				"name": "APT1",
				"description": "An advanced persistent threat group known for cyber espionage.",
				"aliases": ["Comment Panda", "Comment Crew"],
				"targets": ["Technology companies", "Government agencies"],
				"country": "China"
			  },
			  {
				"id": "threat-actor-2",
				"name": "APT28",
				"description": "A threat group attributed to cyber attacks with political motivations.",
				"aliases": ["Fancy Bear", "Sofacy"],
				"targets": ["Military institutions", "Media entities"],
				"country": "Russia"
			  }
			],
			"relationships": [
			  {
				"source_ref": "threat-actor-1",
				"target_ref": "threat-actor-2",
				"relationship_type": "affiliated-with"
			  }
			]
		  }` // Replace with your actual STIX JSON data
	}

	// Unmarshal JSON data
	var data map[string][]interface{}
	if err := json.Unmarshal([]byte(stixData), &data); err != nil {
		log.Fatalf("Error decoding STIX data: %v", err)
	}

	// Create Neo4j driver
	driver, err := neo4j.NewDriver(uri, neo4j.BasicAuth(username, password, ""))
	if err != nil {
		log.Fatalf("Failed to create Neo4j driver: %v", err)
	}
	defer driver.Close()

	// Create Neo4j session
	session := driver.NewSession(neo4j.SessionConfig{AccessMode: neo4j.AccessModeWrite})
	defer session.Close()

	// Begin transaction
	tx, err := session.BeginTransaction()
	if err != nil {
		log.Fatalf("Failed to begin transaction: %v", err)
	}
	defer func() {
		if err := tx.Rollback(); err != nil {
			log.Println("Failed to rollback transaction: ", err)
		}
	}()

	// Process Threat Actors
	threatActors := data["threat_actors"]
	for _, actorData := range threatActors {
		actor := actorData.(map[string]interface{})

		// Cypher query to create nodes for Threat Actors
		cypherQuery := `
			MERGE (a:ThreatActor {id: $id})
			SET a.name = $name,
				a.description = $description,
				a.aliases = $aliases,
				a.targets = $targets,
				a.country = $country
		`

		// Execute Cypher query for each Threat Actor
		_, err := tx.Run(cypherQuery, map[string]interface{}{
			"id":          actor["id"].(string),
			"name":        actor["name"].(string),
			"description": actor["description"].(string),
			"aliases":     actor["aliases"].([]interface{}),
			"targets":     actor["targets"].([]interface{}),
			"country":     actor["country"].(string),
		})
		if err != nil {
			log.Fatalf("Error running Cypher query for Threat Actor: %v", err)
		}
	}

	// Process Relationships
	relationships := data["relationships"]
	for _, relData := range relationships {
		rel := relData.(map[string]interface{})

		// Cypher query to create relationships
		cypherQuery := `
			MATCH (source:ThreatActor {id: $sourceRef})
			MATCH (target:ThreatActor {id: $targetRef})
			MERGE (source)-[:USES]->(target)
		`

		// Execute Cypher query for each Relationship
		_, err := tx.Run(cypherQuery, map[string]interface{}{
			"sourceRef": rel["source_ref"].(string),
			"targetRef": rel["target_ref"].(string),
		})
		if err != nil {
			log.Fatalf("Error running Cypher query for Relationship: %v", err)
		}
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		log.Fatalf("Error committing transaction: %v", err)
	}

	fmt.Println("STIX data uploaded successfully to Neo4j!")
}
