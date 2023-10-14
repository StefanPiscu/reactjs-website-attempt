package models

import (
	"encoding/json"
)

type JourneySection struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

type JourneyPage struct {
	Title       string           `json:"title"`
	Description string           `json:"description"`
	Summary     string           `json:"summary"`
	Sections    []JourneySection `json:"section"`
}

type JourneyData struct {
	Title         string        `json:"title"`
	Description   string        `json:"description"`
	Summary       string        `json:"summary"`
	Pages         []JourneyPage `json:"pages"`
	Authors       []string      `json:"authors"`
	Editors       []string      `json:"editors"`
	Collaborators []string      `json:"collaborators"`
	Id 						string 				`json:"id"`
}

func (myJourneyData JourneyData) GetJSON() string {
	ret, _ := json.Marshal(myJourneyData);
	return string(ret);
}

func (myJourneyData JourneyData) GetJourneyCard() JourneyCard {
	return JourneyCard{
		myJourneyData.Title,
		myJourneyData.Description,
		myJourneyData.Authors,
		myJourneyData.Editors,
		myJourneyData.Id,
	};
}

func GetJourneyData(myJson string) JourneyData{
	var ret JourneyData;
	json.Unmarshal([]byte(myJson), &ret);
	return ret;
}

type JourneyCard struct{
	Title         string        `json:"title"`
	Description   string        `json:"description"`
	Authors       []string      `json:"authors"`
	Editors       []string      `json:"editors"`
	Id 						string 			  `json:"id"`
}

func (myJourneyCard JourneyCard) GetJSON() string {
	ret, _ := json.Marshal(myJourneyCard);
	return string(ret);
}