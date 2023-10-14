package handlers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"main.go/database"
	"main.go/models"
)

func LoginHandler(c *fiber.Ctx) error {
	var data map[string]string
	var inputErrors []string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	err := database.DB.Where("username = ?", data["username"]).Take(&user).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		inputErrors = append(inputErrors, "Username not registered")
		c.SendStatus(404)
		return c.JSON(fiber.Map{
			"errors": inputErrors,
		})
	}
	if err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(data["password"])); err != nil {
		inputErrors = append(inputErrors, "Incorrect password")
		c.SendStatus(400)
		return c.JSON(fiber.Map{
			"errors": inputErrors,
		})
	}

	return loginUser(c, &user);
}