# -*- coding: utf-8 -*-
import sys, os, json, re, urlparse, logging, traceback
from os.path import *
from json import JSONEncoder
from urllib2 import HTTPError
from bottle import request, response, HTTPResponse
# sys.path.append("/ci/lib")

# Django specific settings
os.environ["DJANGO_SETTINGS_MODULE"] = "resume.db.settings"

class cLoginAPI(object):
    def __init__(self):
        return

    def validate(self):
        data = request.json
        response.headers['Content-Type'] = 'application/json'
        from resume.db.resumedb.models import User
        if len(User.objects.filter(name = data["username"], password = data["password"])) > 0:
            result = {
                'sessionID': 'ORHC2TAxj8FrDuWOf0rDD0YNhVdmECB4'
                }
            return json.dumps(result)
        else:
            return HTTPResponse(json.dumps({"message":"The given username and password might be wrong."}), status=400)


class cResumeAPI(object):
    def __init__(self):
        return

    def getAResume(self, rid):
        response.headers['Content-Type'] = 'application/json'
        result = {
            'rid' : rid,
            'name': '无人性' + rid,
            'score': 30,
            'resumeContent': '''<html><html>'''
            }
        return json.dumps(result)

    def getAllResume(self):
        response.headers['Content-Type'] = 'application/json'
        relist = []
        from resume.db.resumedb.models import Resume
        for resume in Resume.objects.all():
            relist.append({
                    'id': resume.id,
                    'name': resume.name,
                    'age' : resume.age,
                    'sex' : resume.sex,
                    'education': resume.education,
                    'major' : resume.major
                           })
        return json.dumps({'resumes': relist})