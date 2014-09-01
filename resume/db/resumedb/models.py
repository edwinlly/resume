import sys

try:
    from django.db import models
except Exception as e:
    print "There was an error loading django modules. Do you have django installed?"
    raise e
    sys.exit()
    
# Sample User model
class User(models.Model):
    name = models.CharField(max_length=30)
    email = models.EmailField(max_length=50)
    password = models.CharField(max_length=30)


class Resume(models.Model):
    name = models.CharField(max_length=30)
    age = models.IntegerField()
    sex = models.IntegerField()
    education = models.CharField(max_length=30)
    major = models.CharField(max_length=30)
    