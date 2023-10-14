package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func LogoutHandler(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}
	c.Cookie(&cookie)
	return c.SendStatus(fiber.StatusOK)
}