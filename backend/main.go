package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"main.go/database"
	"main.go/routes"
)



func main() {
  database.Setup();

  app := fiber.New();
  app.Use(cors.New(cors.Config{
    AllowCredentials: true,
  }));
  routes.Setup(app);
  app.Listen(":4000");
}