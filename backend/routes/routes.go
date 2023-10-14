package routes

import (
	"github.com/gofiber/fiber/v2"
	"main.go/handlers"
)


func Setup(app *fiber.App){


	//setup api handlers
	app.Post("/api/register", handlers.RegisterHandler);
	app.Post("/api/login", handlers.LoginHandler);
	app.Post("/api/logout", handlers.LogoutHandler);
	app.Post("/api/journey/save", func (c *fiber.Ctx) error {
		return handlers.JourneySaveHandler(c, false);
	});
	app.Post("/api/journey/commit", func (c *fiber.Ctx) error {
		return handlers.JourneySaveHandler(c, true);
	});
	app.Get("/api/journey/:journeyId/edit", func(c *fiber.Ctx) error{
		return handlers.JourneyGetHandler(c, true);
	});
	app.Get("/api/journey/:journeyId/view", func(c *fiber.Ctx) error{
		return handlers.JourneyGetHandler(c, false);
	});
	app.Get("/api/journey/cards", handlers.CardsHandler);
	app.Get("/api/user", handlers.UserHandler);
			
	//static distribution
	app.Static("/", "./dist");
	//default route 
	app.Get("/*", handlers.DefaultHandler)

}
