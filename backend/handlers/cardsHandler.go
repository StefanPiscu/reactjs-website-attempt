package handlers

import (
	"io/ioutil"

	"github.com/gofiber/fiber/v2"
	"main.go/models"
)

func CardsHandler(c *fiber.Ctx) error {

	files, err := ioutil.ReadDir("journeys/commits");
	if err!=nil{return c.SendStatus(500);}

	var cardJSONList []string;
	for _, it :=range files{
		journeyJSONbyte, err := ioutil.ReadFile("journeys/commits/"+it.Name());
		if err!=nil{return c.SendStatus(500);}
		myJourney := models.GetJourneyData(string(journeyJSONbyte));
		cardJSONList = append(cardJSONList, myJourney.GetJourneyCard().GetJSON());
	}
	if len(cardJSONList)==0{
		return c.SendStatus(404);
	}

	c.SendStatus(200);
	return c.JSON(cardJSONList);
}