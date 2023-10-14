package handlers

import (
	"errors"
	"io/ioutil"
	"os"

	"github.com/gofiber/fiber/v2"
	"main.go/models"
)

func JourneyGetHandler(c *fiber.Ctx, isEdit bool) error{

	var path string;
	if isEdit{
		path="journeys/drafts/"+c.Params("journeyId")+".json";
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			c.SendStatus(404);
			return c.JSON(fiber.Map{
				"errors": "File not found",
			});
		}

		journeyJSONbyte, _ := ioutil.ReadFile(path);
		journeyJSON := string(journeyJSONbyte);

		var myJourney models.JourneyData = models.GetJourneyData(journeyJSON);

		user, err := getUser(c);
		userCollab := false;

	
		for _, it := range myJourney.Collaborators{
			if it == user.Username{
				userCollab=true;
			}
		}
		if err!=nil || (user.PowerLevel<1 && !userCollab){
			c.SendStatus(400);
			return c.JSON(fiber.Map{
				"errors": "Unathenticated or not allowed",
			})
		}
	} else{
		path="journeys/commits/"+c.Params("journeyId")+".json";
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			c.SendStatus(404);
			return c.JSON(fiber.Map{
				"errors": "File not found",
			});
		}
	}
	c.SendStatus(200);
	return c.SendFile(path);
}