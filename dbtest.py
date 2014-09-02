# -*- coding: utf-8 -*-
# Django specific settings
import os, sys

os.environ["DJANGO_SETTINGS_MODULE"] = "resume.db.settings"

argvs = sys.argv
argvs.append('syncdb')
#syncdb
from django.core.management import execute_from_command_line
execute_from_command_line(argvs)


# Import your models for use in your script
from resume.db.resumedb.models import User, Resume

# Start of application script (demo code below)
user = User(name="dan", email="dancaron@gmail.com", password="12345678")
user.save()

user = User(name="admin", email="admin@gmail.com", password="12345678")
user.save()

Resume(name='name1', age=25, sex = 1, education=u'大专', major=u'工商管理' ).save()
Resume(name='name2', age=35, sex = 0, education=u'本科', major=u'家政服务' ).save()
Resume(name='name3', age=26, sex = 1, education=u'研究生', major=u'汽车代驾' ).save()
Resume(name='name4', age=28, sex = 0, education=u'博士', major=u'三陪' ).save()

sample_user = User.objects.filter(name='admin')[0]

print sample_user.name, sample_user.email, sample_user.password