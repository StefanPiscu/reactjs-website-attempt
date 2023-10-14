package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"main.go/models"
)

func JourneySaveHandler(c *fiber.Ctx, isCommit bool) error{
	var data map[string]string;
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	var myJourney models.JourneyData = models.GetJourneyData(data["journey"]);
	user, err := getUser(c);
	userCollab := false;

	for _, it := range myJourney.Collaborators{
		if it == user.Username{
			userCollab=true;
			break;
		}
	}

	if err!=nil || (user.PowerLevel<1 && !userCollab){
		c.SendStatus(400);
		return c.JSON(fiber.Map{
			"errors": "Unathenticated or not allowed",
		})
	}
	path := "journeys/drafts/" + data["pathname"]+".json";
	journey := []byte(data["journey"]);
	if err := os.WriteFile(path, journey, 0644); err!=nil{
		return c.SendStatus(500);
	}
	if isCommit{
		path = "journeys/commits/" + data["pathname"]+".json";
		if err := os.WriteFile(path, journey, 0644); err!=nil{
			return c.SendStatus(500);
		}
	}
	return c.SendStatus(200);
}