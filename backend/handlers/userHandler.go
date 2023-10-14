package handlers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"main.go/database"
	"main.go/models"
)

func getUser(c *fiber.Ctx) (models.User, error){
	cookie := c.Cookies("jwt");
	token, err:= jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error){
		return []byte(SecretKey), nil;
	});
	if err!=nil{
		fmt.Println(err);
		return models.User{}, err;
	}
	claims := token.Claims.(*jwt.StandardClaims);
	var user models.User;
	database.DB.Where("id = ?", claims.Issuer).Take(&user);
	return user, nil

}

func UserHandler(c *fiber.Ctx) error{
	user, err := getUser(c);
	if err!=nil{
		c.SendStatus(400);
		errorList := []string{"Unauthenticated"};
		return c.JSON(fiber.Map{
			"errors": errorList,
		})
	}
	c.Status(200);
	return c.JSON(user.GetPublicPart());
}