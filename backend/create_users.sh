#!/bin/bash

# Loop through and create each user with respective credentials
for i in 1 2 3 4; do
    case $i in
        1)
            USERNAME="t"
            EMAIL="t@example.com"
            PASSWORD="ttt"
            AVATAR="images/0.jpg"
            S_TOKEN="OKDOFK"
            ;;
        2)
            USERNAME="y"
            EMAIL="y@example.com"
            PASSWORD="yyy"
            AVATAR="images/1.jpg"
            S_TOKEN="OKDEREROFK"
            ;;
        3)
            USERNAME="u"
            EMAIL="u@example.com"
            PASSWORD="uuu"
            AVATAR="images/2.jpg"
            S_TOKEN="OKDTTGOFK"
            ;;
        4)
            USERNAME="i"
            EMAIL="i@example.com"
            PASSWORD="iii"
            AVATAR="images/3.jpg"
            S_TOKEN="OKDDFDFOFK"
            ;;
    esac
    
    # Check if the user already exists
    if ! echo "from django.contrib.auth import get_user_model; User = get_user_model(); # print(User.objects.filter(username='$USERNAME').exists())" | python manage.py shell | grep True; then
        echo "Creating user $USERNAME..."
        
        # Create the user and assign an avatar
        echo "
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.create_user(username='$USERNAME', email='$EMAIL', password='$PASSWORD', s_token='$S_TOKEN')
user.avatar = '$AVATAR'
user.save()
" | python manage.py shell

        echo "User $USERNAME created with avatar $AVATAR."
    else
        echo "User $USERNAME already exists."
    fi
done

# Make each user a friend of the others
echo "
from django.contrib.auth import get_user_model
User = get_user_model()

# Fetch all users
user1 = User.objects.get(username='t')
user2 = User.objects.get(username='y')
user3 = User.objects.get(username='u')
user4 = User.objects.get(username='i')

# Add friendships (assuming friends is a ManyToManyField)
user1.friends.add(user2, user3, user4)
user2.friends.add(user1, user3, user4)
user3.friends.add(user1, user2, user4)
user4.friends.add(user1, user2, user3)

# Save changes
user1.save()
user2.save()
user3.save()
user4.save()

" | python manage.py shell

echo "Users are now friends with each other."