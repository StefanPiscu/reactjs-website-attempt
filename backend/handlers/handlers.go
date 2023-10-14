package handlers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"main.go/models"
)

var SecretKey = "SECRETKEY1234";
//var SecretKey string =  os.Getenv("SECRETKEY");

func loginUser(c *fiber.Ctx, user *models.User) error{
	var inputErrors []string;
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		inputErrors = append(inputErrors, "Server error, try again later")
		c.SendStatus(500)
		return c.JSON(fiber.Map{
			"errors": inputErrors,
		})
	}

	cookie := fiber.Cookie{
		Name:		  "jwt",
		Value:		token,
		Expires:	time.Now().Add(time.Hour * 24),
		HTTPOnly:	true,
	}
	c.Cookie(&cookie);
	c.Status(200);	
	return c.JSON(user.GetPublicPart());
}

func DefaultHandler(c *fiber.Ctx) error{
	return c.SendFile("dist/index.html")
}

