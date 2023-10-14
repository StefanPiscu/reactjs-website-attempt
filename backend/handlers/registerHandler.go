package handlers

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"main.go/database"
	"main.go/models"
)

func RegisterHandler(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	var trash []models.User
	var inputErrors []string

	ret := database.DB.Where("username = ?", data["username"]).Find(&trash)
	//handle ret.Error
	usernameExists := ret.RowsAffected > 0

	ret = database.DB.Where("email = ?", data["email"]).Find(&trash)
	//handle ret.Error
	emailExists := ret.RowsAffected > 0

	if usernameExists {
		inputErrors = append(inputErrors, "Username already registered")
	}
	if emailExists {
		inputErrors = append(inputErrors, "Email already registered")
	}
	if len(inputErrors) > 0 {
		c.SendStatus(400)
		return c.JSON(fiber.Map{
			"errors": inputErrors,
		})
	}

	user := models.User{
		Username: data["username"],
		Email:    data["email"],
		PowerLevel: 0,
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 12)
	user.PasswordHash = passwordHash
	database.DB.Create(&user)

	return loginUser(c, &user);
}