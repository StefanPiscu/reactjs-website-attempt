package models

type User struct {
	Id           uint   `json:"id"`
	Username     string `json:"username" gorm:"unique" `
	Email        string `json:"email" gorm:"unique"`
	PasswordHash []byte `json:"passwordhash"`
	PowerLevel   uint   `json:"powerlevel"`
}

type UserPublic struct {
	Username   string `json:"username"`
	Email      string `json:"email"`
	PowerLevel uint   `json:"powerlevel"`
}

func (protected User) GetPublicPart() UserPublic {
	var public UserPublic
	public.Username = protected.Username
	public.Email = protected.Email
	public.PowerLevel = protected.PowerLevel
	return public
}
