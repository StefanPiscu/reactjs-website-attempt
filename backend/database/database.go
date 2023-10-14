package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"main.go/models"
)

var DB *gorm.DB

func Setup() error {
	db, err := gorm.Open(mysql.Open("root:password@/myjourneydata"), &gorm.Config{
		//Logger: logger.Default.LogMode(logger.Silent),
	});
	DB=db;
	if err != nil {
		panic("failed database connection");
	}
	DB.AutoMigrate(&models.User{});
	return nil;
}